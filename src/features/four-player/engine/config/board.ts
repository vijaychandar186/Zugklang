/** Board geometry constants for the 14x14 four-player chess board */
export const BOARD_CONFIG = {
  /** Total size of the board (14x14) */
  size: 14,
  /** Maximum valid index (size - 1) */
  maxIndex: 13,
  /** Size of each corner cutout (3x3) */
  cornerSize: 3,
  /** Upper corner boundary (size - cornerSize) */
  upperCornerStart: 11,
  /** File letters for the 14 columns */
  files: 'abcdefghijklmn'
} as const;
