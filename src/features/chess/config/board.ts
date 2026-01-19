export const BOARD_CONFIG = {
  size: 8,
  asciiLowercaseA: 97,
  files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ranks: ['8', '7', '6', '5', '4', '3', '2', '1']
} as const;

export const COOKIE_CONFIG = {
  maxAge: 31536000
} as const;

export const BOARD_3D_ENABLED_COOKIE = 'board3dEnabled';
