"""Unit tests for pure ingestion helper functions — no database required."""

from __future__ import annotations

import chess
from src.ingestion import (
    _game_phase,
    _material_imbalance,
    _movetime_variance_score,
    _tc_bucket,
)

# ---------------------------------------------------------------------------
# _tc_bucket
# ---------------------------------------------------------------------------


class TestTcBucket:
    # estimatedSeconds = minutes*60 + increment*40; < 600 → bucket 2, else → bucket 6

    def test_unlimited_0_0(self):
        assert _tc_bucket(0, 0) == 2  # 0s → blitz bucket

    def test_bullet_1_0(self):
        assert _tc_bucket(1, 0) == 2  # 60s

    def test_blitz_3_0(self):
        assert _tc_bucket(3, 0) == 2  # 180s

    def test_blitz_5_0(self):
        assert _tc_bucket(5, 0) == 2  # 300s

    def test_blitz_9_0(self):
        assert _tc_bucket(9, 0) == 2  # 540s

    def test_increment_pushes_into_rapid(self):
        # 9 min + 2 inc = 540 + 80 = 620 → rapid
        assert _tc_bucket(9, 2) == 6

    def test_rapid_boundary_exactly_600(self):
        # 10 min + 0 = 600 → not < 600 → rapid
        assert _tc_bucket(10, 0) == 6

    def test_rapid_10_2(self):
        assert _tc_bucket(10, 2) == 6  # 680s

    def test_classical_30_0(self):
        assert _tc_bucket(30, 0) == 6  # 1800s

    def test_increment_alone_stays_blitz(self):
        # 0 min + 10 inc = 400s → still blitz
        assert _tc_bucket(0, 10) == 2


# ---------------------------------------------------------------------------
# _movetime_variance_score
# ---------------------------------------------------------------------------


class TestMovetimeVarianceScore:
    def test_empty_list_returns_none(self):
        assert _movetime_variance_score([]) is None

    def test_one_move_returns_none(self):
        assert _movetime_variance_score([1000]) is None

    def test_two_moves_returns_none(self):
        assert _movetime_variance_score([1000, 2000]) is None

    def test_three_moves_minimum_required(self):
        result = _movetime_variance_score([1000, 2000, 1500])
        assert result is not None

    def test_identical_times_zero_variance(self):
        assert _movetime_variance_score([1000, 1000, 1000, 1000]) == 0

    def test_result_is_int(self):
        result = _movetime_variance_score([1000, 2000, 1500, 800, 3000])
        assert isinstance(result, int)

    def test_result_capped_at_100000(self):
        # Extreme difference → CV would be huge, must be capped
        result = _movetime_variance_score([1, 1_000_000, 1, 1_000_000, 1])
        assert result == 100_000

    def test_high_variance_above_50000(self):
        result = _movetime_variance_score([100, 50_000, 100, 50_000, 100])
        assert result is not None and result > 50_000

    def test_low_variance_below_5000(self):
        # Times within 10% of each other → low CV
        result = _movetime_variance_score([1000, 1050, 980, 1020, 1010])
        assert result is not None and result < 5_000

    def test_non_negative(self):
        result = _movetime_variance_score([500, 1000, 750, 2000, 300])
        assert result is not None and result >= 0


# ---------------------------------------------------------------------------
# _material_imbalance
# ---------------------------------------------------------------------------


class TestMaterialImbalance:
    def test_equal_at_start_white(self):
        assert _material_imbalance(chess.Board(), True) == 0

    def test_equal_at_start_black(self):
        assert _material_imbalance(chess.Board(), False) == 0

    def test_white_up_one_pawn(self):
        # e4 d5 exd5 — white captures a pawn
        board = chess.Board()
        for san in ["e4", "d5", "exd5"]:
            board.push_san(san)
        assert _material_imbalance(board, True) == 1
        assert _material_imbalance(board, False) == -1

    def test_symmetry_after_equal_trade(self):
        # Exchange e-pawns: e4 e5 — still equal
        board = chess.Board()
        board.push_san("e4")
        board.push_san("e5")
        assert _material_imbalance(board, True) == 0
        assert _material_imbalance(board, False) == 0

    def test_queen_capture_large_imbalance(self):
        # Set up a board where white has extra queen
        # White has queen, black doesn't in an artificial position
        board2 = chess.Board(
            fen="rnb1kbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
        )
        # Black missing queen (9 pts) — white should be +9 from white's view
        assert _material_imbalance(board2, True) == 9
        assert _material_imbalance(board2, False) == -9


# ---------------------------------------------------------------------------
# _game_phase
# ---------------------------------------------------------------------------


class TestGamePhase:
    def test_opening_move_0(self):
        assert _game_phase(chess.Board(), 0) == 1

    def test_opening_move_7_boundary(self):
        assert _game_phase(chess.Board(), 7) == 1

    def test_middlegame_move_8_full_board(self):
        # All heavy pieces present on starting board → middlegame after move 8
        assert _game_phase(chess.Board(), 8) == 2

    def test_middlegame_move_20_full_board(self):
        assert _game_phase(chess.Board(), 20) == 2

    def test_endgame_one_rook(self):
        # Only 1 rook on board → heavy_pieces=1 ≤ 2 → endgame
        board = chess.Board(fen="8/8/4k3/8/8/4K3/8/7R w - - 0 1")
        assert _game_phase(board, 30) == 3

    def test_endgame_two_heavy_pieces_boundary(self):
        # Exactly 2 heavy pieces → endgame
        board = chess.Board(fen="8/8/4k3/8/8/4K3/8/3RR3 w - - 0 1")
        assert _game_phase(board, 20) == 3

    def test_middlegame_three_heavy_pieces(self):
        # 3 heavy pieces → NOT endgame → middlegame
        board = chess.Board(fen="8/3r4/4k3/8/8/4K3/8/3RR3 w - - 0 1")
        assert _game_phase(board, 20) == 2

    def test_opening_phase_ignores_board_state(self):
        # Even with few pieces, if move < 8 it's opening
        board = chess.Board(fen="8/8/4k3/8/8/4K3/8/7R w - - 0 1")
        assert _game_phase(board, 3) == 1
