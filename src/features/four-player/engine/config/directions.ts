/** Knight movement offsets — all 8 L-shaped jumps */
export const KNIGHT_OFFSETS = [
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1]
] as const satisfies ReadonlyArray<readonly [number, number]>;

/** Diagonal directions for bishop movement */
export const DIAGONAL_DIRECTIONS = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1]
] as const satisfies ReadonlyArray<readonly [number, number]>;

/** Orthogonal directions for rook movement */
export const ORTHOGONAL_DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0]
] as const satisfies ReadonlyArray<readonly [number, number]>;

/** All 8 directions for queen/king movement */
export const ALL_DIRECTIONS = [
  ...ORTHOGONAL_DIRECTIONS,
  ...DIAGONAL_DIRECTIONS
] as const;

/** Pawn attack lateral offsets */
export const PAWN_ATTACK_OFFSETS = [-1, 1] as const;
