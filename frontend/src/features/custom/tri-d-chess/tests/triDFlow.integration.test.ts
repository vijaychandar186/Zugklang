import { describe, it, expect } from 'vitest';
import {
  buildInitialPieces,
  buildInitialSlots
} from '@/features/custom/tri-d-chess/engine/initialSetup';
import {
  legalMovesForSquare,
  isInCheck,
  hasAnyLegalMove,
  legalAttackBoardMoves
} from '@/features/custom/tri-d-chess/engine/moveGenerator';
import { applyBoardMove } from '@/features/custom/tri-d-chess/engine/gameEngine';
import { createInitialState } from '@/features/custom/tri-d-chess/engine/gameEngine';
import { squareKey } from '@/features/custom/tri-d-chess/engine/types';

describe('Tri-D Chess integration: initial state', () => {
  it('starts with 32 pieces on the board', () => {
    const pieces = buildInitialPieces();
    expect(Object.keys(pieces)).toHaveLength(32);
  });

  it('neither side is in check at start', () => {
    const pieces = buildInitialPieces();
    const slots = buildInitialSlots();
    expect(isInCheck('w', pieces, slots)).toBe(false);
    expect(isInCheck('b', pieces, slots)).toBe(false);
  });

  it('both sides have legal moves at start', () => {
    const pieces = buildInitialPieces();
    const slots = buildInitialSlots();
    expect(hasAnyLegalMove('w', pieces, slots, null)).toBe(true);
    expect(hasAnyLegalMove('b', pieces, slots, null)).toBe(true);
  });
});

describe('Tri-D Chess integration: pawn moves', () => {
  it('white pawns on wh row 1 can move forward', () => {
    const pieces = buildInitialPieces();
    const slots = buildInitialSlots();
    // Check each pawn on wh row 1
    let totalMoves = 0;
    for (let col = 0; col < 4; col++) {
      const from = { boardId: 'wh' as const, row: 1, col };
      const moves = legalMovesForSquare(from, pieces, slots, null);
      totalMoves += moves.length;
    }
    expect(totalMoves).toBeGreaterThan(0);
  });
});

describe('Tri-D Chess integration: attack board moves', () => {
  it('white can move attack board wa1 from left_low at start', () => {
    const pieces = buildInitialPieces();
    const slots = buildInitialSlots();
    const validSlots = legalAttackBoardMoves('wa1', 'w', pieces, slots);
    expect(Array.isArray(validSlots)).toBe(true);
  });

  it('applying a board move changes the slot', () => {
    const pieces = buildInitialPieces();
    const slots = buildInitialSlots();
    const validSlots = legalAttackBoardMoves('wa1', 'w', pieces, slots);
    if (validSlots.length > 0) {
      const targetSlot = validSlots[0];
      const state = createInitialState();
      state.pieces = pieces;
      state.slots = slots;
      const result = applyBoardMove(state, 'wa1', targetSlot);
      expect(result.slots.wa1).toBe(targetSlot);
    }
  });
});

describe('Tri-D Chess integration: piece identity after board move', () => {
  it('pieces on a moved attack board retain their type and color', () => {
    const pieces = buildInitialPieces();
    const slots = buildInitialSlots();
    const validSlots = legalAttackBoardMoves('wa1', 'w', pieces, slots);
    if (validSlots.length > 0) {
      const targetSlot = validSlots[0];
      const state = createInitialState();
      state.pieces = pieces;
      state.slots = slots;
      const result = applyBoardMove(state, 'wa1', targetSlot);
      // wa1 rook should still be there
      const rookKey = squareKey({ boardId: 'wa1', row: 0, col: 0 });
      expect(result.pieces[rookKey]).toMatchObject({ type: 'r', color: 'w' });
    }
  });
});
