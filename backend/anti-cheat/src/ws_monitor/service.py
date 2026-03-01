from __future__ import annotations

from dataclasses import dataclass, field
from math import sqrt
from threading import RLock
from typing import Literal

from config import settings


RiskLevel = Literal["low", "medium", "high"]


@dataclass
class PlayerMonitorState:
    user_id: str
    color: Literal["white", "black"]
    move_times_ms: list[int] = field(default_factory=list)
    instant_moves: int = 0
    slow_moves: int = 0

    def record_move(self, move_time_ms: int) -> None:
        ms = max(0, int(move_time_ms))
        self.move_times_ms.append(ms)
        if ms <= 700:
            self.instant_moves += 1
        if ms >= 10_000:
            self.slow_moves += 1


@dataclass
class GameMonitorState:
    game_id: str
    variant: str
    time_control: dict[str, str | int]
    white: PlayerMonitorState
    black: PlayerMonitorState
    started_at_ms: int
    turn_started_at_ms: int
    ply_count: int = 0
    status: Literal["active", "ended"] = "active"
    winner: Literal["white", "black"] | None = None
    reason: str | None = None
    last_event_ms: int = 0


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def _stats(values: list[int]) -> tuple[float, float]:
    if not values:
        return 0.0, 0.0
    avg = float(sum(values)) / len(values)
    if len(values) == 1:
        return avg, 0.0
    variance = sum((v - avg) ** 2 for v in values) / len(values)
    return avg, sqrt(max(variance, 0.0))


def _risk_level(score: float) -> RiskLevel:
    if score >= 0.75:
        return "high"
    if score >= 0.45:
        return "medium"
    return "low"


def _score_player(state: PlayerMonitorState) -> dict[str, object]:
    moves = len(state.move_times_ms)
    if moves == 0:
        return {
            "score": 0.0,
            "risk_level": "low",
            "avg_move_time_ms": None,
            "move_time_cv": None,
            "instant_ratio": None,
            "flags": [],
        }

    avg_ms, std_ms = _stats(state.move_times_ms)
    cv = 0.0 if avg_ms <= 0 else std_ms / avg_ms
    instant_ratio = state.instant_moves / moves
    slow_ratio = state.slow_moves / moves

    score = 0.05
    flags: list[str] = []

    if moves >= 12 and avg_ms <= 1_800:
        score += 0.15
        flags.append("fast_average_move_time")
    if moves >= 18 and avg_ms <= 1_200:
        score += 0.20
    if moves >= 12 and cv <= 0.45:
        score += 0.15
        flags.append("low_timing_variance")
    if moves >= 18 and cv <= 0.30:
        score += 0.20
    if moves >= 12 and instant_ratio >= 0.45:
        score += 0.15
        flags.append("high_instant_move_ratio")
    if moves >= 20 and instant_ratio >= 0.60:
        score += 0.20
    if slow_ratio >= 0.35:
        score -= 0.10
    if avg_ms >= 15_000:
        score -= 0.15

    score = _clamp(score, 0.0, 0.99)
    risk = _risk_level(score)

    return {
        "score": float(round(score, 4)),
        "risk_level": risk,
        "avg_move_time_ms": int(round(avg_ms)),
        "move_time_cv": float(round(cv, 4)),
        "instant_ratio": float(round(instant_ratio, 4)),
        "flags": flags,
    }


class WsMonitorStore:
    def __init__(self, retention_minutes: int = 120):
        self._games: dict[str, GameMonitorState] = {}
        self._retention_ms = max(5, retention_minutes) * 60_000
        self._lock = RLock()

    def _cleanup(self, now_ms: int) -> None:
        stale = [
            game_id
            for game_id, game in self._games.items()
            if game.status == "ended" and (now_ms - game.last_event_ms) > self._retention_ms
        ]
        for game_id in stale:
            self._games.pop(game_id, None)

    def start_game(
        self,
        game_id: str,
        variant: str,
        time_control: dict[str, str | int],
        white_user_id: str,
        black_user_id: str,
        started_at_ms: int,
    ) -> dict[str, object]:
        now = max(0, int(started_at_ms))
        with self._lock:
            self._cleanup(now)
            self._games[game_id] = GameMonitorState(
                game_id=game_id,
                variant=variant,
                time_control=time_control,
                white=PlayerMonitorState(user_id=white_user_id, color="white"),
                black=PlayerMonitorState(user_id=black_user_id, color="black"),
                started_at_ms=now,
                turn_started_at_ms=now,
                last_event_ms=now,
            )
            return self.get_game_report(game_id) or {}

    def record_move(
        self,
        game_id: str,
        color: Literal["white", "black"],
        event_at_ms: int,
        move_time_ms: int | None,
    ) -> dict[str, object]:
        now = max(0, int(event_at_ms))
        with self._lock:
            game = self._games.get(game_id)
            if game is None:
                raise KeyError(game_id)
            if game.status == "ended":
                return self.get_game_report(game_id) or {}

            derived_move_time = (
                max(0, int(move_time_ms))
                if move_time_ms is not None
                else max(0, now - game.turn_started_at_ms)
            )
            player = game.white if color == "white" else game.black
            player.record_move(derived_move_time)
            game.ply_count += 1
            game.turn_started_at_ms = now
            game.last_event_ms = now
            self._cleanup(now)
            return self.get_game_report(game_id) or {}

    def end_game(
        self,
        game_id: str,
        event_at_ms: int,
        reason: str,
        winner: Literal["white", "black"] | None,
    ) -> dict[str, object]:
        now = max(0, int(event_at_ms))
        with self._lock:
            game = self._games.get(game_id)
            if game is None:
                raise KeyError(game_id)
            game.status = "ended"
            game.reason = reason
            game.winner = winner
            game.last_event_ms = now
            self._cleanup(now)
            return self.get_game_report(game_id) or {}

    def get_game_report(self, game_id: str) -> dict[str, object] | None:
        game = self._games.get(game_id)
        if game is None:
            return None

        white = _score_player(game.white)
        black = _score_player(game.black)
        overall = max(float(white["score"]), float(black["score"]))
        return {
            "game_id": game.game_id,
            "status": game.status,
            "variant": game.variant,
            "time_control": game.time_control,
            "ply_count": game.ply_count,
            "last_event_ms": game.last_event_ms,
            "winner": game.winner,
            "reason": game.reason,
            "white": {
                "user_id": game.white.user_id,
                "color": "white",
                "moves": len(game.white.move_times_ms),
                **white,
            },
            "black": {
                "user_id": game.black.user_id,
                "color": "black",
                "moves": len(game.black.move_times_ms),
                **black,
            },
            "overall_score": float(round(overall, 4)),
            "overall_risk_level": _risk_level(overall),
        }


monitor_store = WsMonitorStore(settings.ws_monitor_retention_minutes)
