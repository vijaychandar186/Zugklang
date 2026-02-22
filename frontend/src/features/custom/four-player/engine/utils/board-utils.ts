import { BOARD_CONFIG } from '../config/board';
import type { BoardPosition } from '../types/core';
export function toSquare(x: number, y: number): string {
  return BOARD_CONFIG.files[x] + (y + 1);
}
export function fromSquare(square: string): BoardPosition {
  return {
    x: BOARD_CONFIG.files.indexOf(square[0]),
    y: parseInt(square.slice(1)) - 1
  };
}
export function isCorner(x: number, y: number): boolean {
  const { cornerSize, upperCornerStart } = BOARD_CONFIG;
  return (
    (x < cornerSize && y < cornerSize) ||
    (x < cornerSize && y >= upperCornerStart) ||
    (x >= upperCornerStart && y < cornerSize) ||
    (x >= upperCornerStart && y >= upperCornerStart)
  );
}
export function isInBounds(x: number, y: number): boolean {
  return (
    x >= 0 &&
    x <= BOARD_CONFIG.maxIndex &&
    y >= 0 &&
    y <= BOARD_CONFIG.maxIndex &&
    !isCorner(x, y)
  );
}
