export type {
  Team,
  PieceType,
  GameStatus,
  MoveRecord,
  BoardPosition,
  BoardPositionMap,
  PendingPromotion
} from './types/core';

export { FourPlayerGame } from './logic/FourPlayerGame';
export { Piece } from './logic/Piece';

export {
  toSquare,
  fromSquare,
  isCorner,
  isInBounds
} from './utils/board-utils';

export { BOARD_CONFIG } from './config/board';
export { TURN_ORDER } from './config/teams';
