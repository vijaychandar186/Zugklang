import { CSSProperties } from 'react';
import { CapturedPieces, PieceType } from './types';

const STARTING_PIECES = {
  white: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 },
  black: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 }
};

const PIECE_VALUES: Record<PieceType, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9
};

export function convertCSSPropertiesToStringObject(
  style: CSSProperties
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(style)) {
    if (value !== undefined && value !== null) {
      result[key] = String(value);
    }
  }
  return result;
}

export function getCapturedPiecesFromFEN(fen: string): CapturedPieces {
  const boardPart = fen.split(' ')[0];

  const currentPieces = {
    white: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    black: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
  };

  for (const char of boardPart) {
    if (char === '/') continue;
    if (!isNaN(parseInt(char))) continue;

    const isWhite = char === char.toUpperCase();
    const piece = char.toLowerCase() as 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
    if (isWhite) {
      currentPieces.white[piece]++;
    } else {
      currentPieces.black[piece]++;
    }
  }

  const captured: CapturedPieces = { white: [], black: [] };
  const pieceTypes: PieceType[] = ['q', 'r', 'b', 'n', 'p'];

  for (const piece of pieceTypes) {
    const blackMissing =
      STARTING_PIECES.black[piece] - currentPieces.black[piece];
    for (let i = 0; i < blackMissing; i++) {
      captured.white.push(piece);
    }

    const whiteMissing =
      STARTING_PIECES.white[piece] - currentPieces.white[piece];
    for (let i = 0; i < whiteMissing; i++) {
      captured.black.push(piece);
    }
  }

  return captured;
}

export function getMaterialAdvantage(captured: CapturedPieces): number {
  const whiteValue = captured.white.reduce(
    (sum, p) => sum + PIECE_VALUES[p],
    0
  );
  const blackValue = captured.black.reduce(
    (sum, p) => sum + PIECE_VALUES[p],
    0
  );
  return whiteValue - blackValue;
}
