export const ANIMATION_CONFIG = {
  durationMs: 200,
  bufferMs: 50
} as const;

export const MOVE_DELAY =
  ANIMATION_CONFIG.durationMs + ANIMATION_CONFIG.bufferMs;
