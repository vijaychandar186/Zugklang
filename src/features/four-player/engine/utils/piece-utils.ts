import type { Team } from '../types/core';
import type { Piece } from '../logic/Piece';

/** Find the piece at position (x, y), if any */
export function pieceAt(
  pieces: readonly Piece[],
  x: number,
  y: number
): Piece | undefined {
  return pieces.find((piece) => piece.isAtPosition(x, y));
}

/** Whether any piece occupies position (x, y) */
export function isOccupied(
  pieces: readonly Piece[],
  x: number,
  y: number
): boolean {
  return pieceAt(pieces, x, y) !== undefined;
}

/** Whether position (x, y) is occupied by an opponent of the given team */
export function isOccupiedByOpponent(
  pieces: readonly Piece[],
  x: number,
  y: number,
  team: Team
): boolean {
  const piece = pieceAt(pieces, x, y);
  return piece !== undefined && piece.team !== team;
}

/** Whether position (x, y) is empty or occupied by an opponent */
export function isEmptyOrOpponent(
  pieces: readonly Piece[],
  x: number,
  y: number,
  team: Team
): boolean {
  return !isOccupied(pieces, x, y) || isOccupiedByOpponent(pieces, x, y, team);
}
