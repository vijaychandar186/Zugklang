import { CSSProperties } from 'react';
import { Square } from 'chess.js';

export type OptionSquares = {
  [key in Square]?: CSSProperties;
};

export type RightClickedSquares = {
  [key in Square]?: CSSProperties | undefined;
};

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q';

export type CapturedPieces = {
  white: PieceType[]; // pieces white has captured (black's pieces)
  black: PieceType[]; // pieces black has captured (white's pieces)
};
