import type { Team } from '../types/core';

/** Turn order: Red → Blue → Yellow → Green */
export const TURN_ORDER: readonly Team[] = ['r', 'b', 'y', 'g'] as const;

/** Pawn configuration per team */
export const TEAM_PAWN_CONFIG = {
  r: { startRank: 1, direction: 1, promotionRank: 7, axis: 'vertical' },
  b: { startRank: 1, direction: 1, promotionRank: 7, axis: 'horizontal' },
  y: { startRank: 12, direction: -1, promotionRank: 6, axis: 'vertical' },
  g: { startRank: 12, direction: -1, promotionRank: 6, axis: 'horizontal' }
} as const satisfies Record<
  Team,
  {
    startRank: number;
    direction: 1 | -1;
    promotionRank: number;
    axis: 'vertical' | 'horizontal';
  }
>;

/** Whether a team's pieces are arranged vertically (Red/Yellow) or horizontally (Blue/Green) */
export function isVerticalTeam(team: Team): boolean {
  return team === 'r' || team === 'y';
}
