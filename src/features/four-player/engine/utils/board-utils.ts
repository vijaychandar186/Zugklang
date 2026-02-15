import { BOARD_CONFIG } from '../config/board';
import type { BoardPosition } from '../types/core';

/** Convert (x, y) coordinates to algebraic square notation like "d1" */
export function toSquare(x: number, y: number): string {
  return BOARD_CONFIG.files[x] + (y + 1);
}

/** Parse algebraic square notation back to (x, y) coordinates */
export function fromSquare(square: string): BoardPosition {
  return {
    x: BOARD_CONFIG.files.indexOf(square[0]),
    y: parseInt(square.slice(1)) - 1
  };
}

/** Whether (x, y) falls within one of the four 3x3 corner cutouts */
export function isCorner(x: number, y: number): boolean {
  const { cornerSize, upperCornerStart } = BOARD_CONFIG;
  return (
    (x < cornerSize && y < cornerSize) ||
    (x < cornerSize && y >= upperCornerStart) ||
    (x >= upperCornerStart && y < cornerSize) ||
    (x >= upperCornerStart && y >= upperCornerStart)
  );
}

/** Whether (x, y) is a valid playable square on the board */
export function isInBounds(x: number, y: number): boolean {
  return (
    x >= 0 &&
    x <= BOARD_CONFIG.maxIndex &&
    y >= 0 &&
    y <= BOARD_CONFIG.maxIndex &&
    !isCorner(x, y)
  );
}
