import { CSSProperties } from 'react';
import { ChessopsSquare as Square } from '@/lib/chess';

export type PlayerColor = 'white' | 'black';
export type PieceColor = 'w' | 'b';
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export type PieceCode =
  | 'wP'
  | 'wN'
  | 'wB'
  | 'wR'
  | 'wQ'
  | 'wK'
  | 'bP'
  | 'bN'
  | 'bB'
  | 'bR'
  | 'bQ'
  | 'bK';

export type CapturablePiece = 'p' | 'n' | 'b' | 'r' | 'q';

export type CapturedPieces = {
  white: CapturablePiece[];
  black: CapturablePiece[];
};

export type SquareStyles = {
  [key in Square]?: CSSProperties;
};

export type RightClickedSquares = {
  [key in Square]?: CSSProperties | undefined;
};
