/** The four team colors on a 4-player board */
export type Team = 'r' | 'b' | 'y' | 'g';

/** Piece type abbreviations */
export type PieceType = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';

/** Current state of the game */
export type GameStatus = 'playing' | 'gameover';

/** A coordinate on the 14x14 board */
export interface BoardPosition {
  readonly x: number;
  readonly y: number;
}

/** Record of a single move for the move history */
export interface MoveRecord {
  readonly from: string;
  readonly to: string;
  readonly team: Team;
  notation: string;
  readonly captured?: string;
}

/** Promotion-pending state exposed to consumers */
export interface PendingPromotion {
  readonly piece: { readonly team: Team };
  readonly x: number;
  readonly y: number;
}

/** The position map used by react-chessboard */
export type BoardPositionMap = Record<string, { pieceType: string }>;
