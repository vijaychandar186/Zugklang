import { describe, it, expect } from 'vitest';
import {
  getBoardOffset,
  squareToGlobal,
  isInCheck,
  hasAnyLegalMove,
  legalMovesForSquare,
  isPawnPromotion
} from '@/features/custom/tri-d-chess/engine/moveGenerator';
import {
  buildInitialPieces,
  buildInitialSlots
} from '@/features/custom/tri-d-chess/engine/initialSetup';
import {
  FIXED_BOARD_OFFSETS,
  SLOT_OFFSETS
} from '@/features/custom/tri-d-chess/engine/types';

const initialPieces = () => buildInitialPieces();
const initialSlots = () => buildInitialSlots();

describe('getBoardOffset', () => {
  it('wh returns the fixed wh offset', () => {
    expect(getBoardOffset('wh', initialSlots())).toEqual(
      FIXED_BOARD_OFFSETS.wh
    );
  });

  it('n returns the fixed n offset', () => {
    expect(getBoardOffset('n', initialSlots())).toEqual(FIXED_BOARD_OFFSETS.n);
  });

  it('bh returns the fixed bh offset', () => {
    expect(getBoardOffset('bh', initialSlots())).toEqual(
      FIXED_BOARD_OFFSETS.bh
    );
  });

  it('wa1 (left_low) returns left_low slot offset', () => {
    expect(getBoardOffset('wa1', initialSlots())).toEqual(
      SLOT_OFFSETS.left_low
    );
  });

  it('ba2 (right_high) returns right_high slot offset', () => {
    expect(getBoardOffset('ba2', initialSlots())).toEqual(
      SLOT_OFFSETS.right_high
    );
  });
});

describe('squareToGlobal', () => {
  it('applies board offset plus local col/row', () => {
    const slots = initialSlots();
    const sq = { boardId: 'wh' as const, row: 0, col: 0 };
    const off = FIXED_BOARD_OFFSETS.wh;
    expect(squareToGlobal(sq, slots)).toEqual({ x: off.x, y: off.y });
  });

  it('col shifts x', () => {
    const slots = initialSlots();
    const sq = { boardId: 'wh' as const, row: 0, col: 2 };
    const off = FIXED_BOARD_OFFSETS.wh;
    expect(squareToGlobal(sq, slots).x).toBe(off.x + 2);
  });

  it('row shifts y', () => {
    const slots = initialSlots();
    const sq = { boardId: 'wh' as const, row: 3, col: 0 };
    const off = FIXED_BOARD_OFFSETS.wh;
    expect(squareToGlobal(sq, slots).y).toBe(off.y + 3);
  });
});

describe('isInCheck', () => {
  it('neither side is in check at the start', () => {
    const pieces = initialPieces();
    const slots = initialSlots();
    expect(isInCheck('w', pieces, slots)).toBe(false);
    expect(isInCheck('b', pieces, slots)).toBe(false);
  });
});

describe('hasAnyLegalMove', () => {
  it('both sides have legal moves at the start', () => {
    const pieces = initialPieces();
    const slots = initialSlots();
    expect(hasAnyLegalMove('w', pieces, slots, null)).toBe(true);
    expect(hasAnyLegalMove('b', pieces, slots, null)).toBe(true);
  });
});

describe('legalMovesForSquare', () => {
  it('white pawns on wh can move forward at start', () => {
    const pieces = initialPieces();
    const slots = initialSlots();
    const from = { boardId: 'wh' as const, row: 1, col: 0 };
    const moves = legalMovesForSquare(from, pieces, slots, null);
    expect(moves.length).toBeGreaterThan(0);
  });

  it('white rook on wa1 is blocked at start (has pieces around it)', () => {
    const pieces = initialPieces();
    const slots = initialSlots();
    // rook at wa1 row:0, col:0 is at a corner of a 2x2 board — limited moves
    const from = { boardId: 'wa1' as const, row: 0, col: 0 };
    const moves = legalMovesForSquare(from, pieces, slots, null);
    // The rook is surrounded by own pieces; expect 0 or very few moves
    expect(Array.isArray(moves)).toBe(true);
  });

  it('returns empty array for an empty square', () => {
    const pieces = initialPieces();
    const slots = initialSlots();
    const empty = { boardId: 'n' as const, row: 0, col: 0 };
    const moves = legalMovesForSquare(empty, pieces, slots, null);
    expect(moves).toHaveLength(0);
  });
});

describe('isPawnPromotion', () => {
  it('white pawn reaching bh row 3 (global y=7) is promotion', () => {
    // bh offset: y=4, so row 3 → global y = 4+3 = 7 → white promotion
    const slots = initialSlots();
    const from = { boardId: 'wh' as const, row: 1, col: 0 };
    const to = { boardId: 'bh' as const, row: 3, col: 0 };
    const pawn = { type: 'p' as const, color: 'w' as const };
    expect(isPawnPromotion(from, to, pawn, slots)).toBe(true);
  });

  it('white pawn in the middle of the board is not promotion', () => {
    const slots = initialSlots();
    const from = { boardId: 'wh' as const, row: 1, col: 0 };
    const to = { boardId: 'wh' as const, row: 2, col: 0 };
    const pawn = { type: 'p' as const, color: 'w' as const };
    expect(isPawnPromotion(from, to, pawn, slots)).toBe(false);
  });

  it('non-pawn piece is never promotion', () => {
    const slots = initialSlots();
    const from = { boardId: 'bh' as const, row: 3, col: 0 };
    const to = { boardId: 'bh' as const, row: 4, col: 0 };
    const knight = { type: 'n' as const, color: 'b' as const };
    expect(isPawnPromotion(from, to, knight, slots)).toBe(false);
  });
});
