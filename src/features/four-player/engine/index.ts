// ── Types ──────────────────────────────────────────────────────────
export type {
  Team,
  PieceType,
  GameStatus,
  MoveRecord,
  BoardPosition,
  BoardPositionMap,
  PendingPromotion
} from './types/core';

// ── Classes ────────────────────────────────────────────────────────
export { FourPlayerGame } from './logic/FourPlayerGame';
export { Piece } from './logic/Piece';

// ── Board utilities (used by components) ───────────────────────────
export {
  toSquare,
  fromSquare,
  isCorner,
  isInBounds
} from './utils/board-utils';

// ── Constants (used by components/store) ───────────────────────────
export { BOARD_CONFIG } from './config/board';
export { TURN_ORDER } from './config/teams';
