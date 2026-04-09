"""SQL query functions replacing the MongoDB aggregation pipelines.

Each function returns a list of dicts with keys ``_id``, ``nb``, ``v``
to stay compatible with the insight-generation code that consumed MongoDB
aggregation results.

Bucket/dimension expressions (CASE WHEN) mirror the original Mongo $cond trees.
Date bucketing uses PostgreSQL NTILE(n) which produces n equal-count groups,
equivalent to MongoDB's $bucketAuto.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from prisma import Prisma

# ---------------------------------------------------------------------------
# SQL fragments – dimension bucket expressions
# ---------------------------------------------------------------------------

_MATERIAL = """
  CASE
    WHEN m.imbalance = 0    THEN 5
    WHEN m.imbalance < -6   THEN 1
    WHEN m.imbalance < -3   THEN 2
    WHEN m.imbalance < -1   THEN 3
    WHEN m.imbalance < 0    THEN 4
    WHEN m.imbalance <= 1   THEN 6
    WHEN m.imbalance <= 3   THEN 7
    WHEN m.imbalance <= 6   THEN 8
    ELSE 9
  END"""

_MOVETIME = """
  CASE
    WHEN m.move_time < 10   THEN 1
    WHEN m.move_time < 30   THEN 3
    WHEN m.move_time < 50   THEN 5
    WHEN m.move_time < 100  THEN 10
    WHEN m.move_time < 300  THEN 30
    ELSE 60
  END"""

_TIMEVARIANCE = """
  CASE
    WHEN m.variance <= 25000  THEN 25000
    WHEN m.variance <= 40000  THEN 40000
    WHEN m.variance <= 60000  THEN 60000
    WHEN m.variance <= 75000  THEN 75000
    ELSE 100000
  END"""

_CPL = """
  CASE
    WHEN m.cpl <= 0    THEN 0
    WHEN m.cpl <= 10   THEN 10
    WHEN m.cpl <= 25   THEN 25
    WHEN m.cpl <= 50   THEN 50
    WHEN m.cpl <= 100  THEN 100
    WHEN m.cpl <= 200  THEN 200
    WHEN m.cpl <= 500  THEN 500
    ELSE 99999
  END"""

_EVAL = """
  CASE
    WHEN m.eval < -600  THEN 1
    WHEN m.eval < -350  THEN 2
    WHEN m.eval < -175  THEN 3
    WHEN m.eval < -80   THEN 4
    WHEN m.eval < -25   THEN 5
    WHEN m.eval < 25    THEN 6
    WHEN m.eval < 80    THEN 7
    WHEN m.eval < 175   THEN 8
    WHEN m.eval < 350   THEN 9
    WHEN m.eval < 600   THEN 10
    ELSE 11
  END"""

# ---------------------------------------------------------------------------
# Generic query helpers
# ---------------------------------------------------------------------------

Row = dict[str, Any]


def _move_metric_by_date(
    db: Prisma,
    username: str,
    tc: int,
    start: datetime,
    end: datetime,
    metric_expr: str,
    max_games: int,
    max_moves: int,
    n_buckets: int,
    extra_move_filter: str = "",
) -> list[Row]:
    """NTILE(n_buckets) date bucketing over moves with an arbitrary metric."""
    sql = f"""
    WITH game_sub AS (
      SELECT id, played_at
      FROM game_insights
      WHERE user_id = $1
        AND time_control = $2
        AND played_at BETWEEN $3::timestamp AND $4::timestamp
      ORDER BY played_at DESC
      LIMIT $5
    ),
    bucketed AS (
      SELECT id, NTILE({n_buckets}) OVER (ORDER BY played_at) AS bucket
      FROM game_sub
    ),
    move_sub AS (
      SELECT b.bucket, ({metric_expr}) AS v
      FROM bucketed b
      JOIN moves m ON m.insight_id = b.id
      {extra_move_filter}
      LIMIT $6
    )
    SELECT
      bucket          AS "_id",
      COUNT(*)        AS nb,
      AVG(v)          AS v
    FROM move_sub
    WHERE v IS NOT NULL
    GROUP BY bucket
    ORDER BY bucket
    """
    return db.query_raw(sql, username, tc, start, end, max_games, max_moves)


def _move_metric_by_dim(
    db: Prisma,
    username: str,
    tc: int,
    start: datetime,
    end: datetime,
    metric_expr: str,
    dim_expr: str,
    max_games: int,
    max_moves: int,
    extra_move_filter: str = "",
    game_filter: str = "",
) -> list[Row]:
    """GROUP BY a computed dimension bucket over moves."""
    sql = f"""
    WITH game_sub AS (
      SELECT id, result
      FROM game_insights
      WHERE user_id = $1
        AND time_control = $2
        AND played_at BETWEEN $3::timestamp AND $4::timestamp
        {game_filter}
      ORDER BY played_at DESC
      LIMIT $5
    ),
    move_sub AS (
      SELECT ({dim_expr}) AS dim, ({metric_expr}) AS v
      FROM game_sub gi
      JOIN moves m ON m.insight_id = gi.id
      {extra_move_filter}
      LIMIT $6
    )
    SELECT
      dim             AS "_id",
      COUNT(*)        AS nb,
      AVG(v)          AS v
    FROM move_sub
    WHERE dim IS NOT NULL AND v IS NOT NULL
    GROUP BY dim
    ORDER BY dim
    """
    return db.query_raw(sql, username, tc, start, end, max_games, max_moves)


def _game_metric_by_date(
    db: Prisma,
    username: str,
    tc: int,
    start: datetime,
    end: datetime,
    metric_expr: str,
    max_games: int,
    n_buckets: int,
    game_filter: str = "",
) -> list[Row]:
    """NTILE(n_buckets) date bucketing at game level (no move join)."""
    sql = f"""
    WITH game_sub AS (
      SELECT id, played_at, ({metric_expr}) AS v
      FROM game_insights
      WHERE user_id = $1
        AND time_control = $2
        AND played_at BETWEEN $3::timestamp AND $4::timestamp
        {game_filter}
      ORDER BY played_at DESC
      LIMIT $5
    ),
    bucketed AS (
      SELECT NTILE({n_buckets}) OVER (ORDER BY played_at) AS bucket, v
      FROM game_sub
    )
    SELECT
      bucket          AS "_id",
      COUNT(*)        AS nb,
      AVG(v)          AS v
    FROM bucketed
    GROUP BY bucket
    ORDER BY bucket
    """
    return db.query_raw(sql, username, tc, start, end, max_games)


def _game_metric_by_dim(
    db: Prisma,
    username: str,
    tc: int,
    start: datetime,
    end: datetime,
    metric_expr: str,
    dim_expr: str,
    max_games: int,
    game_filter: str = "",
) -> list[Row]:
    """GROUP BY a game-level dimension (e.g. result)."""
    sql = f"""
    WITH game_sub AS (
      SELECT ({dim_expr}) AS dim, ({metric_expr}) AS v
      FROM game_insights
      WHERE user_id = $1
        AND time_control = $2
        AND played_at BETWEEN $3::timestamp AND $4::timestamp
        {game_filter}
      ORDER BY played_at DESC
      LIMIT $5
    )
    SELECT
      dim             AS "_id",
      COUNT(*)        AS nb,
      AVG(v)          AS v
    FROM game_sub
    WHERE dim IS NOT NULL
    GROUP BY dim
    ORDER BY dim
    """
    return db.query_raw(sql, username, tc, start, end, max_games)


# ---------------------------------------------------------------------------
# Move-level metrics – by date
# ---------------------------------------------------------------------------


def movetime_by_date(db, username, tc, start, end, max_games, max_moves, n_buckets):
    return _move_metric_by_date(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.move_time / 10.0",
        max_games=max_games,
        max_moves=max_moves,
        n_buckets=n_buckets,
    )


def timevariance_by_date(db, username, tc, start, end, max_games, max_moves, n_buckets):
    return _move_metric_by_date(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.variance / 100000.0",
        max_games=max_games,
        max_moves=max_moves,
        n_buckets=n_buckets,
        extra_move_filter="WHERE m.variance IS NOT NULL",
    )


def blur_by_date(db, username, tc, start, end, max_games, max_moves, n_buckets):
    return _move_metric_by_date(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="(m.blur::int) * 100",
        max_games=max_games,
        max_moves=max_moves,
        n_buckets=n_buckets,
    )


# Eval-mode only
def acplfiltered_by_date(db, username, tc, start, end, max_games, max_moves, n_buckets):
    return _move_metric_by_date(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.cpl",
        max_games=max_games,
        max_moves=max_moves,
        n_buckets=n_buckets,
        extra_move_filter=(
            "WHERE m.phase IN (2, 3) AND m.imbalance BETWEEN -3 AND 3 "
            "AND m.cpl IS NOT NULL"
        ),
    )


def movetime_by_date_eval(
    db, username, tc, start, end, max_games, max_moves, n_buckets
):
    """movetime_by_date used in eval mode (same query, different pipeline name)."""
    return movetime_by_date(
        db, username, tc, start, end, max_games, max_moves, n_buckets
    )


# ---------------------------------------------------------------------------
# Move-level metrics – by dimension
# ---------------------------------------------------------------------------


def movetime_by_material(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.move_time / 10.0",
        dim_expr=_MATERIAL,
        max_games=max_games,
        max_moves=max_moves,
    )


def movetime_by_phase(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.move_time / 10.0",
        dim_expr="m.phase",
        max_games=max_games,
        max_moves=max_moves,
    )


def movetime_by_blur(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.move_time / 10.0",
        dim_expr="m.blur::int",
        max_games=max_games,
        max_moves=max_moves,
    )


def movetime_by_timevariance(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.move_time / 10.0",
        dim_expr=_TIMEVARIANCE,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.variance IS NOT NULL",
    )


def movetime_by_result(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.move_time / 10.0",
        dim_expr="gi.result",
        max_games=max_games,
        max_moves=max_moves,
    )


def movetime_by_piecemoved(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.move_time / 10.0",
        dim_expr="m.role",
        max_games=max_games,
        max_moves=max_moves,
    )


def movetime_by_centipawnloss(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.move_time / 10.0",
        dim_expr=_CPL,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.cpl IS NOT NULL",
    )


def movetime_by_evaluation(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.move_time / 10.0",
        dim_expr=_EVAL,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.eval IS NOT NULL",
    )


def timevariance_by_movetime(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.variance / 100000.0",
        dim_expr=_MOVETIME,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.variance IS NOT NULL",
    )


def timevariance_by_material(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.variance / 100000.0",
        dim_expr=_MATERIAL,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.variance IS NOT NULL",
    )


def timevariance_by_phase(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.variance / 100000.0",
        dim_expr="m.phase",
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.variance IS NOT NULL",
    )


def timevariance_by_blur(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.variance / 100000.0",
        dim_expr="m.blur::int",
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.variance IS NOT NULL",
    )


def timevariance_by_result(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.variance / 100000.0",
        dim_expr="gi.result",
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.variance IS NOT NULL",
    )


def timevariance_by_piecemoved(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.variance / 100000.0",
        dim_expr="m.role",
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.variance IS NOT NULL",
    )


def timevariance_by_centipawnloss(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.variance / 100000.0",
        dim_expr=_CPL,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.variance IS NOT NULL AND m.cpl IS NOT NULL",
    )


def timevariance_by_evaluation(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.variance / 100000.0",
        dim_expr=_EVAL,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.variance IS NOT NULL AND m.eval IS NOT NULL",
    )


def blur_by_material(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="(m.blur::int) * 100",
        dim_expr=_MATERIAL,
        max_games=max_games,
        max_moves=max_moves,
    )


def blur_by_phase(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="(m.blur::int) * 100",
        dim_expr="m.phase",
        max_games=max_games,
        max_moves=max_moves,
    )


def blur_by_movetime(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="(m.blur::int) * 100",
        dim_expr=_MOVETIME,
        max_games=max_games,
        max_moves=max_moves,
    )


def blur_by_timevariance(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="(m.blur::int) * 100",
        dim_expr=_TIMEVARIANCE,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.variance IS NOT NULL",
    )


def blur_by_result(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="(m.blur::int) * 100",
        dim_expr="gi.result",
        max_games=max_games,
        max_moves=max_moves,
    )


def blurfiltered_by_result(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="(m.blur::int) * 100",
        dim_expr="gi.result",
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter=(
            "WHERE m.move_time BETWEEN 25 AND 300 "
            "AND m.phase IN (2, 3) "
            "AND m.imbalance BETWEEN -1 AND 1"
        ),
    )


def blur_by_piecemoved(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="(m.blur::int) * 100",
        dim_expr="m.role",
        max_games=max_games,
        max_moves=max_moves,
    )


def blur_by_centipawnloss(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="(m.blur::int) * 100",
        dim_expr=_CPL,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.cpl IS NOT NULL",
    )


def blur_by_evaluation(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="(m.blur::int) * 100",
        dim_expr=_EVAL,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.eval IS NOT NULL",
    )


# Eval-mode only
def acpl_by_movetime(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.cpl",
        dim_expr=_MOVETIME,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.cpl IS NOT NULL",
    )


def acpl_by_phase(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.cpl",
        dim_expr="m.phase",
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.cpl IS NOT NULL",
    )


def acpl_by_material(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.cpl",
        dim_expr=_MATERIAL,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.cpl IS NOT NULL",
    )


def acpl_by_blur(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.cpl",
        dim_expr="m.blur::int",
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.cpl IS NOT NULL",
    )


def acplfiltered_by_blur(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.cpl",
        dim_expr="m.blur::int",
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter=(
            "WHERE m.cpl IS NOT NULL AND m.eval IS NOT NULL "
            "AND m.move_time BETWEEN 25 AND 300 "
            "AND m.phase IN (2, 3) AND m.imbalance BETWEEN -1 AND 1"
        ),
    )


def acpl_by_timevariance(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.cpl",
        dim_expr=_TIMEVARIANCE,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.cpl IS NOT NULL AND m.variance IS NOT NULL",
    )


def acpl_by_result(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.cpl",
        dim_expr="gi.result",
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.cpl IS NOT NULL",
    )


def acpl_by_piecemoved(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.cpl",
        dim_expr="m.role",
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.cpl IS NOT NULL",
    )


def acpl_by_evaluation(db, username, tc, start, end, max_games, max_moves):
    return _move_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="m.cpl",
        dim_expr=_EVAL,
        max_games=max_games,
        max_moves=max_moves,
        extra_move_filter="WHERE m.cpl IS NOT NULL AND m.eval IS NOT NULL",
    )


# ---------------------------------------------------------------------------
# Game-level metrics
# ---------------------------------------------------------------------------


def opponentrating_by_date(db, username, tc, start, end, max_games, n_buckets):
    return _game_metric_by_date(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="opp_rating",
        max_games=max_games,
        n_buckets=n_buckets,
        game_filter="AND provisional = FALSE",
    )


def opponentrating_by_result(db, username, tc, start, end, max_games):
    return _game_metric_by_dim(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="opp_rating",
        dim_expr="result",
        max_games=max_games,
        game_filter="AND provisional = FALSE",
    )


def ratinggain_by_date(db, username, tc, start, end, max_games, n_buckets):
    return _game_metric_by_date(
        db,
        username,
        tc,
        start,
        end,
        metric_expr="rating_diff",
        max_games=max_games,
        n_buckets=n_buckets,
        game_filter="AND provisional = FALSE",
    )


# ---------------------------------------------------------------------------
# First-three-moves query (returns raw per-game rows)
# ---------------------------------------------------------------------------


def first_three_move_times(
    db: Prisma,
    username: str,
    tc: int,
    start: datetime,
    end: datetime,
) -> list[Row]:
    """Return one row per game with move times for moves 2, 3, 4 (1-indexed).

    Mirrors the original $slice: ["$m.t", 1, 3] which skips the first move
    and returns the next three.
    """
    sql = """
    WITH ranked AS (
      SELECT
        m.insight_id,
        m.move_time,
        ROW_NUMBER() OVER (PARTITION BY m.insight_id ORDER BY m.id) AS rn
      FROM moves m
      JOIN game_insights gi ON gi.id = m.insight_id
      WHERE gi.user_id = $1
        AND gi.time_control = $2
        AND gi.played_at BETWEEN $3::timestamp AND $4::timestamp
    )
    SELECT
      insight_id                                          AS id,
      MAX(CASE WHEN rn = 2 THEN move_time END)           AS m1,
      MAX(CASE WHEN rn = 3 THEN move_time END)           AS m2,
      MAX(CASE WHEN rn = 4 THEN move_time END)           AS m3
    FROM ranked
    WHERE rn IN (2, 3, 4)
    GROUP BY insight_id
    HAVING COUNT(*) = 3
    """
    return db.query_raw(sql, username, tc, start, end)


# ---------------------------------------------------------------------------
# Latest game date per (user, time_control)
# ---------------------------------------------------------------------------


def latest_game_date(db: Prisma, username: str, tc: int) -> datetime | None:
    rows = db.query_raw(
        """
        SELECT played_at
        FROM game_insights
        WHERE user_id = $1 AND time_control = $2
        ORDER BY played_at DESC
        LIMIT 1
        """,
        username,
        tc,
    )
    if not rows:
        return None
    val = rows[0]["played_at"]
    if isinstance(val, str):
        # prisma-client-py returns datetime columns as ISO strings via query_raw
        return datetime.fromisoformat(val.replace("Z", "+00:00")).replace(tzinfo=None)
    if hasattr(val, "tzinfo") and val.tzinfo is not None:
        return val.replace(tzinfo=None)
    return val


# ---------------------------------------------------------------------------
# All distinct user IDs in the insights table
# ---------------------------------------------------------------------------


def all_user_ids(db: Prisma) -> list[str]:
    rows = db.query_raw("SELECT DISTINCT user_id FROM game_insights")
    return [r["user_id"] for r in rows]
