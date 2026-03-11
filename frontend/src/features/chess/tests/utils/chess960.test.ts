import { describe, it, expect } from 'vitest';
import {
  generateRandomChess960Number,
  chess960PositionToFEN,
  generateRandomChess960FEN,
  isValidChess960BackRank
} from '@/features/chess/utils/chess960';

describe('generateRandomChess960Number', () => {
  it('returns an integer', () => {
    const n = generateRandomChess960Number();
    expect(Number.isInteger(n)).toBe(true);
  });

  it('returns a value in [0, 959]', () => {
    for (let i = 0; i < 50; i++) {
      const n = generateRandomChess960Number();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(959);
    }
  });
});

describe('chess960PositionToFEN', () => {
  it('returns a valid FEN string (contains 7 slashes)', () => {
    const fen = chess960PositionToFEN(0);
    expect(fen.split('/').length).toBe(8);
  });

  it('position 518 produces standard chess starting position back rank', () => {
    const fen = chess960PositionToFEN(518);
    // Standard: RNBQKBNR
    expect(fen.startsWith('rnbqkbnr/')).toBe(true);
    expect(fen).toContain('/RNBQKBNR ');
  });

  it('generated FEN white back rank is always 8 pieces', () => {
    for (const n of [0, 100, 500, 959]) {
      const fen = chess960PositionToFEN(n);
      const whiteBackRank = fen.split('/')[7].replace(/ .*/, '');
      expect(whiteBackRank.length).toBe(8);
    }
  });

  it('back rank contains exactly K, Q, 2R, 2B, 2N', () => {
    for (const n of [0, 1, 100, 500, 959]) {
      const fen = chess960PositionToFEN(n);
      const rank = fen.split('/')[7].split(' ')[0];
      expect(rank.split('').filter((c) => c === 'K').length).toBe(1);
      expect(rank.split('').filter((c) => c === 'Q').length).toBe(1);
      expect(rank.split('').filter((c) => c === 'R').length).toBe(2);
      expect(rank.split('').filter((c) => c === 'B').length).toBe(2);
      expect(rank.split('').filter((c) => c === 'N').length).toBe(2);
    }
  });

  it('white and black back ranks are mirror cases', () => {
    const fen = chess960PositionToFEN(100);
    const blackRank = fen.split('/')[0];
    const whiteRank = fen.split('/')[7].split(' ')[0];
    expect(blackRank).toBe(whiteRank.toLowerCase());
  });
});

describe('isValidChess960BackRank', () => {
  it('validates the standard chess back rank', () => {
    expect(
      isValidChess960BackRank(['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'])
    ).toBe(true);
  });

  it('rejects a rank with wrong length', () => {
    expect(isValidChess960BackRank(['R', 'K', 'R'])).toBe(false);
  });

  it('rejects when king is outside the rooks', () => {
    // K at index 0, rooks at 3 and 7 — king not between rooks
    expect(
      isValidChess960BackRank(['K', 'N', 'B', 'R', 'Q', 'B', 'N', 'R'])
    ).toBe(false);
  });

  it('rejects when bishops are on the same colour', () => {
    // Bishops at indices 0 and 2 — both even (light squares)
    expect(
      isValidChess960BackRank(['B', 'R', 'B', 'N', 'Q', 'K', 'N', 'R'])
    ).toBe(false);
  });

  it('accepts any position produced by chess960PositionToFEN', () => {
    for (const n of [0, 100, 518, 959]) {
      const fen = chess960PositionToFEN(n);
      const rank = fen.split('/')[7].split(' ')[0].split('');
      expect(isValidChess960BackRank(rank)).toBe(true);
    }
  });
});

describe('generateRandomChess960FEN', () => {
  it('generates a FEN with a valid back rank', () => {
    const fen = generateRandomChess960FEN();
    const rank = fen.split('/')[7].split(' ')[0].split('');
    expect(isValidChess960BackRank(rank)).toBe(true);
  });

  it('generates different FENs across multiple calls (probabilistic)', () => {
    const fens = new Set(
      Array.from({ length: 20 }, () => generateRandomChess960FEN())
    );
    expect(fens.size).toBeGreaterThan(1);
  });
});
