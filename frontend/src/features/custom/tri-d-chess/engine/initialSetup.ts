import type { PieceMap, AttackBoardSlots } from './types';
import { squareKey } from './types';
export function buildInitialPieces(): PieceMap {
  const pieces: PieceMap = {};
  function place(
    boardId: string,
    row: number,
    col: number,
    color: 'w' | 'b',
    type: 'k' | 'q' | 'r' | 'b' | 'n' | 'p'
  ) {
    pieces[squareKey({ boardId: boardId as never, row, col })] = {
      type,
      color
    };
  }
  place('wa1', 0, 0, 'w', 'r');
  place('wa1', 0, 1, 'w', 'q');
  place('wa1', 1, 0, 'w', 'p');
  place('wa1', 1, 1, 'w', 'p');
  place('wh', 0, 0, 'w', 'n');
  place('wh', 0, 1, 'w', 'b');
  place('wh', 0, 2, 'w', 'b');
  place('wh', 0, 3, 'w', 'n');
  place('wh', 1, 0, 'w', 'p');
  place('wh', 1, 1, 'w', 'p');
  place('wh', 1, 2, 'w', 'p');
  place('wh', 1, 3, 'w', 'p');
  place('wa2', 0, 0, 'w', 'k');
  place('wa2', 0, 1, 'w', 'r');
  place('wa2', 1, 0, 'w', 'p');
  place('wa2', 1, 1, 'w', 'p');
  place('ba1', 0, 0, 'b', 'p');
  place('ba1', 0, 1, 'b', 'p');
  place('ba1', 1, 0, 'b', 'r');
  place('ba1', 1, 1, 'b', 'q');
  place('bh', 2, 0, 'b', 'p');
  place('bh', 2, 1, 'b', 'p');
  place('bh', 2, 2, 'b', 'p');
  place('bh', 2, 3, 'b', 'p');
  place('bh', 3, 0, 'b', 'n');
  place('bh', 3, 1, 'b', 'b');
  place('bh', 3, 2, 'b', 'b');
  place('bh', 3, 3, 'b', 'n');
  place('ba2', 0, 0, 'b', 'p');
  place('ba2', 0, 1, 'b', 'p');
  place('ba2', 1, 0, 'b', 'k');
  place('ba2', 1, 1, 'b', 'r');
  return pieces;
}
export function buildInitialSlots(): AttackBoardSlots {
  return {
    wa1: 'left_low',
    wa2: 'right_low',
    ba1: 'left_high',
    ba2: 'right_high'
  };
}
