import { describe, it, expect } from 'vitest';
import {
  buildInitialPieces,
  buildInitialSlots
} from '@/features/custom/tri-d-chess/engine/initialSetup';
import { squareKey } from '@/features/custom/tri-d-chess/engine/types';

describe('buildInitialSlots', () => {
  it('wa1 starts at left_low', () => {
    expect(buildInitialSlots().wa1).toBe('left_low');
  });

  it('wa2 starts at right_low', () => {
    expect(buildInitialSlots().wa2).toBe('right_low');
  });

  it('ba1 starts at left_high', () => {
    expect(buildInitialSlots().ba1).toBe('left_high');
  });

  it('ba2 starts at right_high', () => {
    expect(buildInitialSlots().ba2).toBe('right_high');
  });
});

describe('buildInitialPieces', () => {
  it('places exactly 32 pieces', () => {
    const pieces = buildInitialPieces();
    expect(Object.keys(pieces).length).toBe(32);
  });

  it('white king is on wa2 at row 0, col 0', () => {
    const pieces = buildInitialPieces();
    const key = squareKey({ boardId: 'wa2', row: 0, col: 0 });
    expect(pieces[key]).toMatchObject({ type: 'k', color: 'w' });
  });

  it('black king is on ba2 at row 1, col 0', () => {
    const pieces = buildInitialPieces();
    const key = squareKey({ boardId: 'ba2', row: 1, col: 0 });
    expect(pieces[key]).toMatchObject({ type: 'k', color: 'b' });
  });

  it('white queen is on wa1 at row 0, col 1', () => {
    const pieces = buildInitialPieces();
    const key = squareKey({ boardId: 'wa1', row: 0, col: 1 });
    expect(pieces[key]).toMatchObject({ type: 'q', color: 'w' });
  });

  it('black queen is on ba1 at row 1, col 1', () => {
    const pieces = buildInitialPieces();
    const key = squareKey({ boardId: 'ba1', row: 1, col: 1 });
    expect(pieces[key]).toMatchObject({ type: 'q', color: 'b' });
  });

  it('no pieces are placed on fixed neutral board (n)', () => {
    const pieces = buildInitialPieces();
    const neutralKeys = Object.keys(pieces).filter((k) => k.startsWith('n:'));
    expect(neutralKeys).toHaveLength(0);
  });

  it('has 16 white pieces and 16 black pieces', () => {
    const pieces = buildInitialPieces();
    const all = Object.values(pieces);
    expect(all.filter((p) => p.color === 'w').length).toBe(16);
    expect(all.filter((p) => p.color === 'b').length).toBe(16);
  });

  it('white pawns on wh are at row 1', () => {
    const pieces = buildInitialPieces();
    const whPawns = [0, 1, 2, 3].map(
      (col) => pieces[squareKey({ boardId: 'wh', row: 1, col })]
    );
    whPawns.forEach((p) => {
      expect(p).toMatchObject({ type: 'p', color: 'w' });
    });
  });

  it('black pawns on bh are at row 2', () => {
    const pieces = buildInitialPieces();
    const bhPawns = [0, 1, 2, 3].map(
      (col) => pieces[squareKey({ boardId: 'bh', row: 2, col })]
    );
    bhPawns.forEach((p) => {
      expect(p).toMatchObject({ type: 'p', color: 'b' });
    });
  });
});
