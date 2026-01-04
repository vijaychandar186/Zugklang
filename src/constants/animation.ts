export const ANIMATION_CONFIG = {
  /** Duration of piece movement animation in milliseconds */
  durationMs: 300,
  /** Small buffer after animation to prevent race conditions */
  bufferMs: 50
} as const;

/** Total delay to wait for animation to complete */
export const MOVE_DELAY =
  ANIMATION_CONFIG.durationMs + ANIMATION_CONFIG.bufferMs;
