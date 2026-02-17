export type Team = 'r' | 'b' | 'y' | 'g';

export type PieceType = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';

export type GameStatus = 'playing' | 'gameover';

export interface BoardPosition {
  readonly x: number;
  readonly y: number;
}

export interface MoveRecord {
  readonly from: string;
  readonly to: string;
  readonly team: Team;
  notation: string;
  readonly captured?: string;
  readonly promotedPiece?: boolean;
  readonly checkedKings?: Team[];
  readonly checkingPieceType?: PieceType;
  isCheckmate?: boolean;
  isStalemate?: boolean;
}

export interface PendingPromotion {
  readonly piece: { readonly team: Team };
  readonly x: number;
  readonly y: number;
}

export type BoardPositionMap = Record<string, { pieceType: string }>;
