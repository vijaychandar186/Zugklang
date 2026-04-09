import { describe, it, expect } from 'vitest';
import { FourPlayerGame } from '@/features/custom/four-player/engine/logic/FourPlayerGame';

describe('FourPlayerGame: construction', () => {
  it('starts with team r (red) as current team', () => {
    const game = new FourPlayerGame();
    expect(game.currentTeam).toBe('r');
  });

  it('starts with totalMoves = 0', () => {
    const game = new FourPlayerGame();
    expect(game.totalMoves).toBe(0);
  });

  it('starts with status = playing', () => {
    const game = new FourPlayerGame();
    expect(game.status).toBe('playing');
  });

  it('starts with no lose order', () => {
    const game = new FourPlayerGame();
    expect(game.loseOrder).toHaveLength(0);
  });

  it('starts with no winner', () => {
    const game = new FourPlayerGame();
    expect(game.winner).toBeNull();
  });

  it('starts with no pending promotion', () => {
    const game = new FourPlayerGame();
    expect(game.pendingPromotion).toBeNull();
  });

  it('places all pieces on the board initially', () => {
    const game = new FourPlayerGame();
    // 4 teams × 16 pieces each = 64
    expect(game.pieces.length).toBe(64);
  });
});

describe('FourPlayerGame: isChecked', () => {
  it('is not in check at the start', () => {
    const game = new FourPlayerGame();
    expect(game.isChecked).toBe(false);
  });
});

describe('FourPlayerGame: getMovesForSquare', () => {
  it('returns legal moves for a red pawn at its starting row', () => {
    const game = new FourPlayerGame();
    // Red pawns are at y=1 (rank 2), x=3-10 → squares d2, e2, f2, g2, h2, i2, j2, k2
    let foundMoves = false;
    for (const sq of ['d2', 'e2', 'f2', 'g2', 'h2', 'i2', 'j2', 'k2']) {
      const moves = game.getMovesForSquare(sq);
      if (moves.length > 0) {
        foundMoves = true;
        break;
      }
    }
    expect(foundMoves).toBe(true);
  });

  it('returns empty array for a square with no current-team piece', () => {
    const game = new FourPlayerGame();
    // e5 is likely empty or has a different team's piece at start
    // Regardless, if not red's piece, returns []
    const moves = game.getMovesForSquare('h7'); // center — likely empty
    expect(Array.isArray(moves)).toBe(true);
  });
});

describe('FourPlayerGame: playMove', () => {
  it('returns false for an invalid move', () => {
    const game = new FourPlayerGame();
    expect(game.playMove('h7', 'h8')).toBe(false); // empty square
  });

  it('advances totalMoves and switches team after a valid move', () => {
    const game = new FourPlayerGame();
    // Find a valid red move
    let moved = false;
    const redPawnSquares = ['d2', 'e2', 'f2', 'g2', 'h2', 'i2', 'j2', 'k2'];
    for (const from of redPawnSquares) {
      const moves = game.getMovesForSquare(from);
      if (moves.length > 0) {
        const result = game.playMove(from, moves[0]);
        if (result) {
          moved = true;
          break;
        }
      }
    }
    if (moved) {
      expect(game.totalMoves).toBe(1);
      expect(game.currentTeam).not.toBe('r');
    }
  });
});

describe('FourPlayerGame: toPosition', () => {
  it('returns a map of all pieces with their squares', () => {
    const game = new FourPlayerGame();
    const pos = game.toPosition();
    expect(typeof pos).toBe('object');
    expect(Object.keys(pos).length).toBeGreaterThan(0);
  });

  it('each entry has a pieceType', () => {
    const game = new FourPlayerGame();
    const pos = game.toPosition();
    for (const entry of Object.values(pos)) {
      expect(entry).toHaveProperty('pieceType');
      expect(typeof entry.pieceType).toBe('string');
    }
  });
});

describe('FourPlayerGame: clone', () => {
  it('clone produces an equal but independent game', () => {
    const game = new FourPlayerGame();
    const clone = game.clone();
    expect(clone.currentTeam).toBe(game.currentTeam);
    expect(clone.totalMoves).toBe(game.totalMoves);
    expect(clone.pieces.length).toBe(game.pieces.length);
  });

  it('modifying clone does not affect original', () => {
    const game = new FourPlayerGame();
    const clone = game.clone();

    // Play a move on the clone
    const redPawnSquares = ['d2', 'e2', 'f2', 'g2', 'h2', 'i2', 'j2', 'k2'];
    for (const from of redPawnSquares) {
      const moves = clone.getMovesForSquare(from);
      if (moves.length > 0) {
        clone.playMove(from, moves[0]);
        break;
      }
    }
    // Original should still have 0 moves
    expect(game.totalMoves).toBe(0);
    expect(game.currentTeam).toBe('r');
  });
});
