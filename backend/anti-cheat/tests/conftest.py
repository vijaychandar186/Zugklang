"""Shared pytest fixtures for anti-cheat tests."""

from __future__ import annotations

import uuid

import pytest
from fastapi.testclient import TestClient
from src.main import _require_internal_auth, app

# Unique IDs per test session so runs never collide with real user data
WHITE_UID = f"test-white-{uuid.uuid4().hex[:10]}"
BLACK_UID = f"test-black-{uuid.uuid4().hex[:10]}"

# Ruy Lopez opening — 8 legal UCI moves (4 white, 4 black)
RUY_LOPEZ_MOVES = ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5", "a7a6", "b5a4", "g8f6"]
WHITE_TIMES_MS = [1200, 950, 800, 1100]
BLACK_TIMES_MS = [900, 750, 600, 1050]


@pytest.fixture(scope="session")
def client():
    """FastAPI test client — runs the full app lifespan (DB connect/disconnect)."""
    app.dependency_overrides[_require_internal_auth] = lambda: None
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_users(client):  # noqa: ARG001  — client ensures lifespan ran
    yield
    from src.db import get_db

    db = get_db()
    insights = db.gameinsight.find_many(
        where={"userId": {"in": [WHITE_UID, BLACK_UID]}}
    )
    for ins in insights:
        db.move.delete_many(where={"insightId": ins.id})
    db.gameinsight.delete_many(where={"userId": {"in": [WHITE_UID, BLACK_UID]}})


def make_game_payload(**overrides) -> dict:
    """Return a valid POST /game payload, with optional field overrides."""
    base = {
        "game_id": uuid.uuid4().hex,
        "variant": "standard",
        "time_control_minutes": 3,
        "time_control_increment": 0,
        "moves": RUY_LOPEZ_MOVES,
        "move_times_white_ms": WHITE_TIMES_MS,
        "move_times_black_ms": BLACK_TIMES_MS,
        "white_user_id": WHITE_UID,
        "black_user_id": BLACK_UID,
        "white_rating": 1500,
        "black_rating": 1400,
        "result": "white",
    }
    base.update(overrides)
    return base
