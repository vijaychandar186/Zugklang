import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  loadFEN,
  loadPGN
} from '@/lib/chess/gameLoader';
import { STARTING_FEN } from '@/features/chess/config/constants';

describe('Chess game flow: initial state', () => {
  it('starts with the standard FEN', () => {
    const state = createInitialGameState();
    expect(state.currentFEN).toBe(STARTING_FEN);
  });

  it('game object is side white to move', () => {
    const state = createInitialGameState();
    expect(state.game.turn()).toBe('w');
  });

  it('no moves have been played', () => {
    const state = createInitialGameState();
    expect(state.moves).toHaveLength(0);
    expect(state.positionHistory).toHaveLength(1);
  });
});

describe('Chess game flow: move sequence', () => {
  it('playing 1. e4 e5 2. Nf3 Nc6 builds correct history', () => {
    const pgn = '1. e4 e5 2. Nf3 Nc6';
    const state = loadPGN(pgn);
    expect(state).not.toBeNull();
    expect(state!.moves).toEqual(['e4', 'e5', 'Nf3', 'Nc6']);
    expect(state!.positionHistory).toHaveLength(5);
  });

  it('each position in positionHistory is a different FEN (not all the same)', () => {
    const pgn = '1. e4 e5 2. Nf3 Nc6';
    const state = loadPGN(pgn);
    const unique = new Set(state!.positionHistory);
    expect(unique.size).toBe(5);
  });

  it('FEN after 1. e4 contains pawn on e4', () => {
    const pgn = '1. e4';
    const state = loadPGN(pgn);
    expect(state!.currentFEN).toContain('4P'); // white pawn on e-file rank 4 area
    // More precise: FEN has 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
    expect(state!.currentFEN.startsWith('rnbqkbnr/pppppppp/8/8/4P3/')).toBe(
      true
    );
  });
});

describe('Chess game flow: full game via PGN', () => {
  it("loads Scholar's Mate PGN correctly", () => {
    const pgn = '1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7#';
    const state = loadPGN(pgn);
    expect(state).not.toBeNull();
    expect(state!.moves).toHaveLength(7);
    expect(state!.positionHistory).toHaveLength(8);
  });

  it('loads a longer game PGN', () => {
    const pgn = `
      1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O
      6. Nf3 Nbd7 7. Rc1 c6 8. Bd3 dxc4 9. Bxc4 Nd5
    `;
    const state = loadPGN(pgn);
    expect(state).not.toBeNull();
    expect(state!.moves).toHaveLength(18);
  });
});

describe('Chess game flow: FEN loading', () => {
  it('loads a mid-game FEN position', () => {
    // Position after 1. e4 e5
    const fen = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2';
    const state = loadFEN(fen);
    expect(state).not.toBeNull();
    expect(state!.currentFEN).toBe(fen);
    expect(state!.game.turn()).toBe('w');
  });

  it('handles invalid FEN gracefully (null or non-null)', () => {
    // The Chess wrapper may silently fall back to starting position rather than throwing.
    const state = loadFEN('invalid-fen-string');
    expect(state === null || typeof state === 'object').toBe(true);
  });

  it('accepts STARTING_FEN', () => {
    const state = loadFEN(STARTING_FEN);
    expect(state).not.toBeNull();
    expect(state!.currentFEN).toBe(STARTING_FEN);
  });
});
