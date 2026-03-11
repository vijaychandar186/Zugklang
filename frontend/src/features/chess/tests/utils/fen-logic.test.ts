import { describe, it, expect } from 'vitest';
import {
  getCapturedPiecesFromFEN,
  getMaterialAdvantage,
  convertCSSPropertiesToStringObject
} from '@/features/chess/utils/fen-logic';
import { STARTING_FEN } from '@/features/chess/config/constants';

describe('getCapturedPiecesFromFEN', () => {
  it('returns no captures for the starting position', () => {
    const captured = getCapturedPiecesFromFEN(STARTING_FEN);
    expect(captured.white).toHaveLength(0);
    expect(captured.black).toHaveLength(0);
  });

  it('detects a missing black queen (captured by white)', () => {
    // Remove black queen from starting position
    const fen = 'rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const captured = getCapturedPiecesFromFEN(fen);
    expect(captured.white).toContain('q');
    expect(captured.white).toHaveLength(1);
  });

  it('detects a missing white rook (captured by black)', () => {
    // Remove one white rook
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR w Kkq - 0 1';
    const captured = getCapturedPiecesFromFEN(fen);
    expect(captured.black).toContain('r');
  });

  it('detects multiple captures', () => {
    // Missing both queens and two pawns total
    const fen = 'rnb1kbnr/pppp1ppp/8/8/8/8/PPPP1PPP/RNB1KBNR w KQkq - 0 1';
    const captured = getCapturedPiecesFromFEN(fen);
    expect(captured.white).toContain('q');
    expect(captured.black).toContain('q');
    expect(captured.white).toContain('p');
    expect(captured.black).toContain('p');
  });
});

describe('getMaterialAdvantage', () => {
  it('returns 0 for equal captures', () => {
    const captured = { white: ['p' as const], black: ['p' as const] };
    expect(getMaterialAdvantage(captured)).toBe(0);
  });

  it('returns positive value when white has more captures', () => {
    // white captured a rook (5), black captured nothing
    const captured = { white: ['r' as const], black: [] };
    expect(getMaterialAdvantage(captured)).toBe(5);
  });

  it('returns negative value when black has more captures', () => {
    const captured = { white: [], black: ['q' as const] };
    expect(getMaterialAdvantage(captured)).toBe(-9);
  });

  it('calculates multi-piece advantage correctly', () => {
    // white: q(9) + r(5) = 14; black: n(3) + p(1) = 4; advantage = 10
    const captured = {
      white: ['q' as const, 'r' as const],
      black: ['n' as const, 'p' as const]
    };
    expect(getMaterialAdvantage(captured)).toBe(10);
  });

  it('returns 0 for empty captures', () => {
    expect(getMaterialAdvantage({ white: [], black: [] })).toBe(0);
  });
});

describe('convertCSSPropertiesToStringObject', () => {
  it('converts numeric values to strings', () => {
    const result = convertCSSPropertiesToStringObject({
      opacity: 0.5,
      zIndex: 10
    });
    expect(result.opacity).toBe('0.5');
    expect(result.zIndex).toBe('10');
  });

  it('passes string values through', () => {
    const result = convertCSSPropertiesToStringObject({
      color: 'red',
      display: 'flex'
    });
    expect(result.color).toBe('red');
    expect(result.display).toBe('flex');
  });

  it('excludes null/undefined values', () => {
    const result = convertCSSPropertiesToStringObject({ color: undefined });
    expect(result.color).toBeUndefined();
  });

  it('returns empty object for empty input', () => {
    expect(convertCSSPropertiesToStringObject({})).toEqual({});
  });
});
