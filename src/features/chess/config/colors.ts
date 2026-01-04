export const ARROW_COLORS = {
  userPrimary: 'var(--arrow-user-primary)',
  userSecondary: 'var(--arrow-user-secondary)',
  userTertiary: 'var(--arrow-user-tertiary)',

  bestMove: 'var(--arrow-best-move)',
  threat: 'var(--arrow-threat)',

  alternative: 'var(--arrow-alternative)',
  blunder: 'var(--arrow-blunder)',
  good: 'var(--arrow-good)',
  mistake: 'var(--arrow-mistake)',
  brilliant: 'var(--arrow-brilliant)',
  info: 'var(--arrow-info)'
} as const;

export type ArrowColorKey = keyof typeof ARROW_COLORS;
