import type { Team, MoveRecord } from '../engine';

const PIECE_VALUES: Record<string, number> = {
  P: 1,
  N: 3,
  B: 3,
  R: 5,
  Q: 9,
  K: 0
};

const CHECKMATE_BONUS = 25;

export function calculateScores(
  moveHistory: readonly MoveRecord[],
  eliminatedBy: Readonly<Partial<Record<Team, Team>>>
): Record<Team, number> {
  const scores: Record<Team, number> = { r: 0, b: 0, y: 0, g: 0 };

  for (const move of moveHistory) {
    if (move.captured) {
      const pieceType = move.captured.charAt(1);
      scores[move.team] += PIECE_VALUES[pieceType] ?? 0;
    }
  }

  for (const [, checkmater] of Object.entries(eliminatedBy)) {
    if (checkmater) {
      scores[checkmater as Team] += CHECKMATE_BONUS;
    }
  }

  return scores;
}
