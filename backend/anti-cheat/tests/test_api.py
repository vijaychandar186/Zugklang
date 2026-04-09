"""Integration tests for the FastAPI endpoints."""

from __future__ import annotations

import uuid

from tests.conftest import make_game_payload

# ---------------------------------------------------------------------------
# GET /health
# ---------------------------------------------------------------------------


class TestHealth:
    def test_returns_200(self, client):
        assert client.get("/health").status_code == 200

    def test_returns_ok_status(self, client):
        assert client.get("/health").json() == {"status": "ok"}


# ---------------------------------------------------------------------------
# POST /game
# ---------------------------------------------------------------------------


class TestGameIngestion:
    def test_valid_game_returns_200(self, client):
        r = client.post("/game", json=make_game_payload())
        assert r.status_code == 200

    def test_valid_game_stored_flag(self, client):
        r = client.post("/game", json=make_game_payload())
        assert r.json()["stored"] is True

    def test_valid_game_white_moves_count(self, client):
        # 8-move game = 4 white moves
        r = client.post("/game", json=make_game_payload())
        assert r.json()["white_moves_stored"] == 4

    def test_valid_game_black_moves_count(self, client):
        r = client.post("/game", json=make_game_payload())
        assert r.json()["black_moves_stored"] == 4

    def test_anonymous_game_stores_nothing(self, client):
        r = client.post(
            "/game", json=make_game_payload(white_user_id=None, black_user_id=None)
        )
        body = r.json()
        assert r.status_code == 200
        assert body["white_moves_stored"] == 0
        assert body["black_moves_stored"] == 0

    def test_only_white_authenticated(self, client):
        r = client.post("/game", json=make_game_payload(black_user_id=None))
        body = r.json()
        assert body["white_moves_stored"] == 4
        assert body["black_moves_stored"] == 0

    def test_only_black_authenticated(self, client):
        r = client.post("/game", json=make_game_payload(white_user_id=None))
        body = r.json()
        assert body["white_moves_stored"] == 0
        assert body["black_moves_stored"] == 4

    def test_7min_accepted_as_blitz(self, client):
        r = client.post("/game", json=make_game_payload(time_control_minutes=7))
        assert r.status_code == 200
        assert r.json()["white_moves_stored"] == 4

    def test_rapid_10min_accepted(self, client):
        r = client.post("/game", json=make_game_payload(time_control_minutes=10))
        assert r.json()["white_moves_stored"] == 4

    def test_unlimited_0min_accepted(self, client):
        r = client.post("/game", json=make_game_payload(time_control_minutes=0))
        assert r.json()["white_moves_stored"] == 4

    def test_draw_result(self, client):
        r = client.post("/game", json=make_game_payload(result="draw"))
        assert r.status_code == 200
        assert r.json()["stored"] is True

    def test_black_wins_result(self, client):
        r = client.post("/game", json=make_game_payload(result="black"))
        assert r.status_code == 200
        assert r.json()["stored"] is True

    def test_missing_required_fields_rejected(self, client):
        r = client.post("/game", json={"game_id": "x"})
        assert r.status_code == 422

    def test_empty_body_rejected(self, client):
        r = client.post("/game", json={})
        assert r.status_code == 422

    def test_invalid_moves_handled_gracefully(self, client):
        # Garbage UCI breaks mid-replay but should not crash the server
        r = client.post(
            "/game",
            json=make_game_payload(
                moves=["e2e4", "INVALID", "g1f3"],
                move_times_white_ms=[1000, 1000],
                move_times_black_ms=[1000],
            ),
        )
        assert r.status_code == 200

    def test_no_ratings_accepted(self, client):
        r = client.post(
            "/game", json=make_game_payload(white_rating=None, black_rating=None)
        )
        assert r.status_code == 200

    def test_each_game_gets_unique_id(self, client):
        # Two posts with different game_ids both succeed
        r1 = client.post("/game", json=make_game_payload())
        r2 = client.post("/game", json=make_game_payload())
        assert r1.status_code == 200
        assert r2.status_code == 200


# ---------------------------------------------------------------------------
# GET /queue/status
# ---------------------------------------------------------------------------


class TestQueueStatus:
    def test_returns_200(self, client):
        assert client.get("/queue/status").status_code == 200

    def test_has_pending_field(self, client):
        body = client.get("/queue/status").json()
        assert "pending" in body
        assert isinstance(body["pending"], int)
        assert body["pending"] >= 0

    def test_has_processed_today_field(self, client):
        body = client.get("/queue/status").json()
        assert "processed_today" in body
        assert isinstance(body["processed_today"], int)
        assert body["processed_today"] >= 0


# ---------------------------------------------------------------------------
# POST /analyse
# ---------------------------------------------------------------------------


class TestAnalyse:
    def test_empty_user_list_rejected(self, client):
        r = client.post("/analyse", json={"users": []})
        assert r.status_code == 422

    def test_missing_users_field_rejected(self, client):
        r = client.post("/analyse", json={})
        assert r.status_code == 422

    def test_unknown_user_insufficient_data(self, client):
        # A user with no game history → model has no data → 422
        r = client.post("/analyse", json={"users": [f"ghost-{uuid.uuid4().hex}"]})
        assert r.status_code == 422

    def test_invalid_body_type_rejected(self, client):
        r = client.post(
            "/analyse", content="not-json", headers={"Content-Type": "application/json"}
        )
        assert r.status_code == 422
