from __future__ import annotations

import json
from typing import Any

import mongomock

from config import Settings
from data_preparation.prepare_data import build_data
from db import db


def _quote_sql_text(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def _sql_in(values: list[str]) -> str:
    if not values:
        return "''"
    return ", ".join(_quote_sql_text(v) for v in values)


async def _table_columns(table_name: str) -> set[str]:
    rows = await db.query_raw(
        f"""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = '{table_name}'
        """
    )
    return {str(r["column_name"]) for r in rows if r.get("column_name")}


def _ensure_doc(row_doc: Any) -> dict[str, Any]:
    if isinstance(row_doc, dict):
        return row_doc
    if isinstance(row_doc, str):
        return json.loads(row_doc)
    raise TypeError(f"Unsupported insight row payload type: {type(row_doc)}")


async def _load_users(usernames: list[str]) -> list[dict[str, Any]]:
    in_list = _sql_in(usernames)
    rows = await db.query_raw(
        f"""
        SELECT id AS _id, marks
        FROM users
        WHERE id IN ({in_list})
        """
    )
    return [{"_id": str(r["_id"]), "marks": r.get("marks")} for r in rows if r.get("_id")]


async def _load_insights(usernames: list[str]) -> list[dict[str, Any]]:
    in_list = _sql_in(usernames)
    columns = await _table_columns("insights")
    if not columns:
        raise FileNotFoundError("Table 'insights' was not found in PostgreSQL.")

    user_col = next((c for c in ("u", "user_id", "user", "username") if c in columns), None)
    if user_col is None:
        raise FileNotFoundError(
            "No user column found on 'insights'. Expected one of: u, user_id, user, username."
        )

    if "doc" in columns:
        rows = await db.query_raw(
            f"""
            SELECT doc
            FROM insights
            WHERE {user_col} IN ({in_list})
            """
        )
        docs = [_ensure_doc(r["doc"]) for r in rows if r.get("doc") is not None]
    else:
        rows = await db.query_raw(
            f"""
            SELECT to_jsonb(i) AS doc
            FROM insights AS i
            WHERE i.{user_col} IN ({in_list})
            """
        )
        docs = [_ensure_doc(r["doc"]) for r in rows if r.get("doc") is not None]

    # Normalize user field expected by legacy code.
    for doc in docs:
        if "u" not in doc and user_col in doc:
            doc["u"] = doc[user_col]
    return docs


async def build_live_dataset(settings: Settings, users: list[str]) -> dict[tuple[int, int], dict[str, Any]]:
    """Build model-ready data dictionary for a live username batch."""
    if not users:
        return {}

    insight_docs = await _load_insights(users)
    user_docs = await _load_users(users)
    if not insight_docs or not user_docs:
        return {}

    # Reuse legacy pipeline by emulating Mongo collections in memory.
    client = mongomock.MongoClient()
    memdb = client["kaladin_live"]
    insights_coll = memdb["insights"]
    users_coll = memdb["users"]
    insights_coll.insert_many(insight_docs)
    users_coll.insert_many(user_docs)

    return build_data(insights_coll, users_coll, live=1, live_user_list=users)


def build_training_dataset(settings: Settings) -> None:
    raise NotImplementedError("Training dataset builder is not yet ported to Postgres in this service.")
