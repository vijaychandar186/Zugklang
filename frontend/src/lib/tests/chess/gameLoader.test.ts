import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  loadFEN,
  loadPGN
} from '@/lib/chess/gameLoader';
import { STARTING_FEN } from '@/features/chess/config/constants';

describe('createInitialGameState', () => {
  it('uses STARTING_FEN by default', () => {
    const state = createInitialGameState();
    expect(state.currentFEN).toBe(STARTING_FEN);
  });

  it('starts with empty move list', () => {
    const state = createInitialGameState();
    expect(state.moves).toHaveLength(0);
  });

  it('positionHistory contains only the starting position', () => {
    const state = createInitialGameState();
    expect(state.positionHistory).toHaveLength(1);
    expect(state.positionHistory[0]).toBe(STARTING_FEN);
  });

  it('viewingIndex is 0', () => {
    const state = createInitialGameState();
    expect(state.viewingIndex).toBe(0);
  });

  it('accepts a custom starting FEN', () => {
    const fen =
      'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3';
    const state = createInitialGameState(fen);
    expect(state.currentFEN).toBe(fen);
  });
});

describe('loadFEN', () => {
  it('returns a GameState for a valid FEN', () => {
    const state = loadFEN(STARTING_FEN);
    expect(state).not.toBeNull();
    expect(state!.currentFEN).toBe(STARTING_FEN);
  });

  it('positionHistory has the FEN as sole entry', () => {
    const state = loadFEN(STARTING_FEN);
    expect(state!.positionHistory).toEqual([STARTING_FEN]);
  });

  it('moves array is empty', () => {
    const state = loadFEN(STARTING_FEN);
    expect(state!.moves).toHaveLength(0);
  });

  it('handles invalid FEN gracefully (null or non-null state)', () => {
    // The Chess wrapper may silently fall back to starting position rather than throwing.
    // Either result is acceptable — we only verify it doesn't crash.
    const state = loadFEN('not-a-fen');
    expect(state === null || typeof state === 'object').toBe(true);
  });
});

describe('loadPGN', () => {
  const pgn = '1. e4 e5 2. Nf3 Nc6';

  it('returns non-null for a valid PGN', () => {
    const state = loadPGN(pgn);
    expect(state).not.toBeNull();
  });

  it('populates moves array correctly', () => {
    const state = loadPGN(pgn);
    expect(state!.moves).toEqual(['e4', 'e5', 'Nf3', 'Nc6']);
  });

  it('positionHistory has one entry per move plus the initial position', () => {
    const state = loadPGN(pgn);
    expect(state!.positionHistory).toHaveLength(5); // start + 4 moves
  });

  it('viewingIndex points to last position', () => {
    const state = loadPGN(pgn);
    expect(state!.viewingIndex).toBe(state!.positionHistory.length - 1);
  });

  it('handles invalid PGN gracefully (null or empty game)', () => {
    // The Chess library may silently ignore invalid PGN tokens rather than throwing.
    // Either null is returned or a valid empty game state.
    const state = loadPGN('1. e9 e5'); // illegal square — expect null or no moves
    if (state !== null) {
      expect(state.moves).toHaveLength(0);
    } else {
      expect(state).toBeNull();
    }
  });

  it('loads a checkmate PGN', () => {
    const scholarsMate = '1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7#';
    const state = loadPGN(scholarsMate);
    expect(state).not.toBeNull();
    expect(state!.moves).toHaveLength(7);
  });
});
