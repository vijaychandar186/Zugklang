from __future__ import annotations

import json
from typing import Any

from db import db


async def _execute(sql: str, *params: Any) -> None:
    if hasattr(db, "execute_raw"):
        await db.execute_raw(sql, *params)
        return
    # Fallback for runtimes without execute_raw.
    await db.query_raw(sql, *params)


async def _query(sql: str, *params: Any) -> list[dict[str, Any]]:
    rows = await db.query_raw(sql, *params)
    return [dict(r) for r in rows] if rows else []


async def ensure_ws_monitor_schema() -> None:
    await _execute(
        """
        CREATE TABLE IF NOT EXISTS ws_monitor_games (
          game_id TEXT PRIMARY KEY,
          variant TEXT NOT NULL,
          time_mode TEXT NOT NULL,
          time_minutes INTEGER NOT NULL,
          time_increment INTEGER NOT NULL,
          white_user_id TEXT NOT NULL,
          black_user_id TEXT NOT NULL,
          started_at_ms BIGINT NOT NULL,
          status TEXT NOT NULL,
          winner TEXT NULL,
          reason TEXT NULL,
          ply_count INTEGER NOT NULL DEFAULT 0,
          last_event_ms BIGINT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    await _execute(
        """
        CREATE TABLE IF NOT EXISTS ws_monitor_moves (
          id BIGSERIAL PRIMARY KEY,
          game_id TEXT NOT NULL,
          ply INTEGER NOT NULL,
          color TEXT NOT NULL,
          uci TEXT NOT NULL,
          move_time_ms INTEGER NULL,
          white_time_ms INTEGER NULL,
          black_time_ms INTEGER NULL,
          event_at_ms BIGINT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    await _execute(
        """
        CREATE TABLE IF NOT EXISTS ws_monitor_reports (
          id BIGSERIAL PRIMARY KEY,
          game_id TEXT NOT NULL,
          event_kind TEXT NOT NULL,
          event_at_ms BIGINT NOT NULL,
          payload JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    await _execute(
        "CREATE INDEX IF NOT EXISTS ws_monitor_moves_game_ply_idx ON ws_monitor_moves(game_id, ply)"
    )
    await _execute(
        "CREATE INDEX IF NOT EXISTS ws_monitor_reports_game_created_idx ON ws_monitor_reports(game_id, created_at DESC)"
    )


async def persist_game_start(body: dict[str, Any]) -> None:
    tc = body["time_control"]
    await _execute(
        """
        INSERT INTO ws_monitor_games (
          game_id, variant, time_mode, time_minutes, time_increment,
          white_user_id, black_user_id, started_at_ms, status, last_event_ms, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', $8, NOW())
        ON CONFLICT (game_id) DO UPDATE SET
          variant = EXCLUDED.variant,
          time_mode = EXCLUDED.time_mode,
          time_minutes = EXCLUDED.time_minutes,
          time_increment = EXCLUDED.time_increment,
          white_user_id = EXCLUDED.white_user_id,
          black_user_id = EXCLUDED.black_user_id,
          started_at_ms = EXCLUDED.started_at_ms,
          status = 'active',
          winner = NULL,
          reason = NULL,
          ply_count = 0,
          last_event_ms = EXCLUDED.last_event_ms,
          updated_at = NOW()
        """,
        body["game_id"],
        body["variant"],
        tc["mode"],
        int(tc["minutes"]),
        int(tc["increment"]),
        body["white_user_id"],
        body["black_user_id"],
        int(body["started_at_ms"]),
    )


async def persist_game_move(body: dict[str, Any]) -> None:
    move = body["move"]
    await _execute(
        """
        INSERT INTO ws_monitor_moves (
          game_id, ply, color, uci, move_time_ms, white_time_ms, black_time_ms, event_at_ms
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """,
        body["game_id"],
        int(body["ply"]),
        move["color"],
        move["uci"],
        int(move["move_time_ms"]) if move.get("move_time_ms") is not None else None,
        int(move["white_time_ms"]) if move.get("white_time_ms") is not None else None,
        int(move["black_time_ms"]) if move.get("black_time_ms") is not None else None,
        int(body["event_at_ms"]),
    )
    await _execute(
        """
        UPDATE ws_monitor_games
        SET ply_count = GREATEST(ply_count, $2),
            last_event_ms = $3,
            updated_at = NOW()
        WHERE game_id = $1
        """,
        body["game_id"],
        int(body["ply"]),
        int(body["event_at_ms"]),
    )


async def persist_game_end(body: dict[str, Any]) -> None:
    await _execute(
        """
        UPDATE ws_monitor_games
        SET status = 'ended',
            winner = $2,
            reason = $3,
            last_event_ms = $4,
            updated_at = NOW()
        WHERE game_id = $1
        """,
        body["game_id"],
        body.get("winner"),
        body["reason"],
        int(body["event_at_ms"]),
    )


async def persist_report(
    game_id: str,
    event_kind: str,
    event_at_ms: int,
    report: dict[str, Any],
) -> None:
    await _execute(
        """
        INSERT INTO ws_monitor_reports (game_id, event_kind, event_at_ms, payload)
        VALUES ($1, $2, $3, $4::jsonb)
        """,
        game_id,
        event_kind,
        int(event_at_ms),
        json.dumps(report),
    )


async def load_latest_report(game_id: str) -> dict[str, Any] | None:
    rows = await _query(
        """
        SELECT payload
        FROM ws_monitor_reports
        WHERE game_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        """,
        game_id,
    )
    if not rows:
        return None
    payload = rows[0].get("payload")
    if isinstance(payload, dict):
        return payload
    if isinstance(payload, str):
        return json.loads(payload)
    return None
