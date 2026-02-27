import type { PieceMap, AttackBoardSlots } from './types';
import { squareKey } from './types';

/**
 * Starting position for Star Trek Tri-Dimensional Chess.
 *
 * Global coordinate reference (row = y-offset within board, col = x-offset):
 *
 * ── White ──────────────────────────────────────────────────────────────────
 * wa1  (QL1 – Queen's side attack board, slot: left_low, global offset x=0 y=0)
 *   row 0 (rank 0): R(z0)  Q(a0)
 *   row 1 (rank 1): P(z1)  P(a1)
 *
 * WH   (White Home board, global offset x=2 y=0)
 *   row 0 (rank 0): N(a1)  B(b1)  B(c1)  N(d1)
 *   row 1 (rank 1): P(a2)  P(b2)  P(c2)  P(d2)
 *   row 2 (rank 2): — empty —
 *   row 3 (rank 3): — empty —
 *
 * wa2  (KL1 – King's side attack board, slot: right_low, global offset x=6 y=0)
 *   row 0 (rank 0): K(d0)  R(e0)
 *   row 1 (rank 1): P(d1)  P(e1)
 *
 * ── Black ──────────────────────────────────────────────────────────────────
 * ba1  (QL6 – Queen's side attack board, slot: left_high, global offset x=0 y=6)
 *   row 0 (rank 8): P(z8)  P(a8)
 *   row 1 (rank 9): R(z9)  Q(a9)
 *
 * BH   (Black Home board, global offset x=2 y=4)
 *   row 0 (rank 4): — empty —
 *   row 1 (rank 5): — empty —
 *   row 2 (rank 6): P(a7)  P(b7)  P(c7)  P(d7)   ← rank 7 in official notation
 *   row 3 (rank 7): N(a8)  B(b8)  B(c8)  N(d8)   ← rank 8 in official notation
 *
 * ba2  (KL6 – King's side attack board, slot: right_high, global offset x=6 y=6)
 *   row 0 (rank 8): P(d8)  P(e8)
 *   row 1 (rank 9): K(d9)  R(e9)
 *
 * Totals: 16 white pieces, 16 black pieces.
 */
export function buildInitialPieces(): PieceMap {
  const pieces: PieceMap = {};

  function place(
    boardId: string,
    row: number,
    col: number,
    color: 'w' | 'b',
    type: 'k' | 'q' | 'r' | 'b' | 'n' | 'p'
  ) {
    pieces[squareKey({ boardId: boardId as never, row, col })] = {
      type,
      color
    };
  }

  // ── White ──────────────────────────────────────────────────────────────────
  // wa1 (QL1): Rook + Queen on rank 0; Pawns on rank 1
  place('wa1', 0, 0, 'w', 'r'); // z0
  place('wa1', 0, 1, 'w', 'q'); // a0
  place('wa1', 1, 0, 'w', 'p'); // z1
  place('wa1', 1, 1, 'w', 'p'); // a1

  // WH: Knights + Bishops on row 0; Pawns on row 1
  place('wh', 0, 0, 'w', 'n'); // a1
  place('wh', 0, 1, 'w', 'b'); // b1
  place('wh', 0, 2, 'w', 'b'); // c1
  place('wh', 0, 3, 'w', 'n'); // d1
  place('wh', 1, 0, 'w', 'p'); // a2
  place('wh', 1, 1, 'w', 'p'); // b2
  place('wh', 1, 2, 'w', 'p'); // c2
  place('wh', 1, 3, 'w', 'p'); // d2

  // wa2 (KL1): King + Rook on rank 0; Pawns on rank 1
  place('wa2', 0, 0, 'w', 'k'); // d0
  place('wa2', 0, 1, 'w', 'r'); // e0
  place('wa2', 1, 0, 'w', 'p'); // d1
  place('wa2', 1, 1, 'w', 'p'); // e1

  // ── Black ──────────────────────────────────────────────────────────────────
  // ba1 (QL6): Pawns on rank 8 (row 0); Rook + Queen on rank 9 (row 1)
  place('ba1', 0, 0, 'b', 'p'); // z8
  place('ba1', 0, 1, 'b', 'p'); // a8
  place('ba1', 1, 0, 'b', 'r'); // z9
  place('ba1', 1, 1, 'b', 'q'); // a9

  // BH: Pawns on row 2; Knights + Bishops on row 3 (top)
  place('bh', 2, 0, 'b', 'p'); // a7
  place('bh', 2, 1, 'b', 'p'); // b7
  place('bh', 2, 2, 'b', 'p'); // c7
  place('bh', 2, 3, 'b', 'p'); // d7
  place('bh', 3, 0, 'b', 'n'); // a8
  place('bh', 3, 1, 'b', 'b'); // b8
  place('bh', 3, 2, 'b', 'b'); // c8
  place('bh', 3, 3, 'b', 'n'); // d8

  // ba2 (KL6): Pawns on rank 8 (row 0); King + Rook on rank 9 (row 1)
  place('ba2', 0, 0, 'b', 'p'); // d8
  place('ba2', 0, 1, 'b', 'p'); // e8
  place('ba2', 1, 0, 'b', 'k'); // d9
  place('ba2', 1, 1, 'b', 'r'); // e9

  return pieces;
}

export function buildInitialSlots(): AttackBoardSlots {
  return {
    wa1: 'left_low',
    wa2: 'right_low',
    ba1: 'left_high',
    ba2: 'right_high'
  };
}
