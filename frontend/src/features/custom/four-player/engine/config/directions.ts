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
export const DIAGONAL_DIRECTIONS = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1]
] as const satisfies ReadonlyArray<readonly [number, number]>;
export const ORTHOGONAL_DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0]
] as const satisfies ReadonlyArray<readonly [number, number]>;
export const ALL_DIRECTIONS = [
  ...ORTHOGONAL_DIRECTIONS,
  ...DIAGONAL_DIRECTIONS
] as const;
export const PAWN_ATTACK_OFFSETS = [-1, 1] as const;
