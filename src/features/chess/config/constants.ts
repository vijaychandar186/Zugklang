import { CapturablePiece, PieceCode } from '../types/core';

export const STARTING_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';

export const PIECE_VALUES: Record<CapturablePiece, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9
};

export const ALL_PIECE_CODES: PieceCode[] = [
  'wK',
  'wQ',
  'wR',
  'wB',
  'wN',
  'wP',
  'bK',
  'bQ',
  'bR',
  'bB',
  'bN',
  'bP'
];

export const WHITE_PIECES: PieceCode[] = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];
export const BLACK_PIECES: PieceCode[] = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
