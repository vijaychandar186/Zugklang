"""Game ingestion: replay UCI moves and store Kaladin insight documents in PostgreSQL."""

from __future__ import annotations

import logging
from datetime import datetime

import chess
from prisma import Prisma

from .schemas import GameIngestionRequest

log = logging.getLogger(__name__)

_PIECE_VALUES: dict[int, int] = {
    chess.PAWN: 1,
    chess.KNIGHT: 3,
    chess.BISHOP: 3,
    chess.ROOK: 5,
    chess.QUEEN: 9,
    chess.KING: 0,
}


def _material_imbalance(board: chess.Board, is_white: bool) -> int:
    """Material difference (in pawns) from the moving player's perspective."""
    my_color = chess.WHITE if is_white else chess.BLACK
    opp_color = not my_color
    mine = sum(
        _PIECE_VALUES[pt] * len(board.pieces(pt, my_color)) for pt in _PIECE_VALUES
    )
    opp = sum(
        _PIECE_VALUES[pt] * len(board.pieces(pt, opp_color)) for pt in _PIECE_VALUES
    )
    return mine - opp


def _game_phase(board: chess.Board, full_move_index: int) -> int:
    """Return 1=opening, 2=middlegame, 3=endgame."""
    if full_move_index < 8:
        return 1
    heavy_pieces = sum(
        len(board.pieces(pt, c))
        for pt in [chess.ROOK, chess.QUEEN]
        for c in [chess.WHITE, chess.BLACK]
    )
    return 3 if heavy_pieces <= 2 else 2


def _movetime_variance_score(times_ms: list[int]) -> int | None:
    """Coefficient of variation scaled to 0–100 000 (Kaladin's m.v field)."""
    if len(times_ms) < 3:
        return None
    cs = [max(1, t // 10) for t in times_ms]
    mean = sum(cs) / len(cs)
    if mean == 0:
        return None
    variance = sum((t - mean) ** 2 for t in cs) / len(cs)
    cv = variance**0.5 / mean
    return min(int(cv * 100_000), 100_000)


def _tc_bucket(minutes: int, increment: int) -> int:
    """Map time control to Kaladin bucket: 2 (bullet/blitz) or 6 (rapid/classical).
    Mirrors the frontend getTimeCategory logic: estimatedSeconds = minutes*60 + increment*40.
    """
    estimated_seconds = minutes * 60 + increment * 40
    return 2 if estimated_seconds < 600 else 6


def ingest_game(data: GameIngestionRequest, db: Prisma) -> tuple[int, int]:
    """Replay the game with python-chess, compute per-move Kaladin fields, and
    write one GameInsight + its Move rows per player into PostgreSQL.

    Returns (white_moves_stored, black_moves_stored).
    """
    tc = _tc_bucket(data.time_control_minutes, data.time_control_increment)
    board = chess.Board()
    white_move_data: list[dict] = []
    black_move_data: list[dict] = []

    for i, uci in enumerate(data.moves):
        is_white_move = i % 2 == 0
        try:
            move = chess.Move.from_uci(uci)
        except ValueError:
            break
        piece = board.piece_at(move.from_square)
        if piece is None:
            break

        entry = {
            "imbalance": _material_imbalance(board, is_white_move),
            "phase": _game_phase(board, i // 2),
            "role": piece.piece_type,
        }
        if is_white_move:
            white_move_data.append(entry)
        else:
            black_move_data.append(entry)
        board.push(move)

    def _build_moves(move_data: list[dict], times_ms: list[int]) -> list[dict]:
        mv_score = _movetime_variance_score(times_ms)
        rows = []
        for md, t_ms in zip(move_data, times_ms, strict=False):
            row: dict = {
                "moveTime": max(1, t_ms // 10),
                "blur": False,
                "imbalance": md["imbalance"],
                "phase": md["phase"],
                "role": md["role"],
            }
            if mv_score is not None:
                row["variance"] = mv_score
            rows.append(row)
        return rows

    RESULT_MAP = {"white": 1, "draw": 2, "black": 3}
    INV_RESULT = {"white": "black", "black": "white", "draw": "draw"}
    played_at = data.played_at or datetime.utcnow()

    white_stored = black_stored = 0

    if data.white_user_id and white_move_data and data.move_times_white_ms:
        moves = _build_moves(white_move_data, data.move_times_white_ms)
        insight = db.gameinsight.create(
            data={
                "userId": data.white_user_id,
                "playedAt": played_at,
                "timeControl": tc,
                "result": RESULT_MAP.get(data.result, 2),
                "oppRating": data.black_rating or 0,
                "ratingDiff": 0,
                "oppStrength": (data.black_rating // 200) if data.black_rating else 5,
                "provisional": False,
                "aborted": False,
            }
        )
        db.move.create_many(data=[{"insightId": insight.id, **m} for m in moves])
        white_stored = len(moves)

    if data.black_user_id and black_move_data and data.move_times_black_ms:
        inv = INV_RESULT.get(data.result, "draw")
        moves = _build_moves(black_move_data, data.move_times_black_ms)
        insight = db.gameinsight.create(
            data={
                "userId": data.black_user_id,
                "playedAt": played_at,
                "timeControl": tc,
                "result": RESULT_MAP.get(inv, 2),
                "oppRating": data.white_rating or 0,
                "ratingDiff": 0,
                "oppStrength": (data.white_rating // 200) if data.white_rating else 5,
                "provisional": False,
                "aborted": False,
            }
        )
        db.move.create_many(data=[{"insightId": insight.id, **m} for m in moves])
        black_stored = len(moves)

    return white_stored, black_stored
