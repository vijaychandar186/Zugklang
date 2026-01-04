// Arrow colors using CSS variables from theme.css
// These are the fallback values for environments where CSS variables aren't available
export const ARROW_COLORS = {
  // User-drawn arrows (shift/ctrl click)
  userPrimary: 'var(--arrow-user-primary)',
  userSecondary: 'var(--arrow-user-secondary)',
  userTertiary: 'var(--arrow-user-tertiary)',

  // Analysis arrows
  bestMove: 'var(--arrow-best-move)',
  threat: 'var(--arrow-threat)',

  // Move quality indicators
  alternative: 'var(--arrow-alternative)',
  blunder: 'var(--arrow-blunder)',
  good: 'var(--arrow-good)',
  mistake: 'var(--arrow-mistake)',
  brilliant: 'var(--arrow-brilliant)',
  info: 'var(--arrow-info)'
} as const;

export type ArrowColorKey = keyof typeof ARROW_COLORS;
