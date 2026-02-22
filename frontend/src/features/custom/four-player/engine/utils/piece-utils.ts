import type { Team } from '../types/core';
import type { Piece } from '../logic/Piece';
export function pieceAt(
  pieces: readonly Piece[],
  x: number,
  y: number
): Piece | undefined {
  return pieces.find((piece) => piece.isAtPosition(x, y));
}
export function isOccupied(
  pieces: readonly Piece[],
  x: number,
  y: number
): boolean {
  return pieceAt(pieces, x, y) !== undefined;
}
export function isOccupiedByOpponent(
  pieces: readonly Piece[],
  x: number,
  y: number,
  team: Team
): boolean {
  const piece = pieceAt(pieces, x, y);
  return piece !== undefined && piece.team !== team;
}
export function isEmptyOrOpponent(
  pieces: readonly Piece[],
  x: number,
  y: number,
  team: Team
): boolean {
  return !isOccupied(pieces, x, y) || isOccupiedByOpponent(pieces, x, y, team);
}
