import { ARROW_COLORS } from '@/features/chess/config/colors';
import { BOARD_CONFIG } from '@/features/chess/config/board';

export function fenToPosition(
  fen: string
): Record<string, { pieceType: string }> {
  const position: Record<string, { pieceType: string }> = {};
  const rows = fen.split(' ')[0].split('/');

  rows.forEach((row, rowIndex) => {
    let fileIndex = 0;
    for (const char of row) {
      if (!isNaN(parseInt(char))) {
        fileIndex += parseInt(char);
      } else {
        const square = `${BOARD_CONFIG.files[fileIndex]}${BOARD_CONFIG.ranks[rowIndex]}`;
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const piece = char.toUpperCase();
        position[square] = { pieceType: `${color}${piece}` };
        fileIndex++;
      }
    }
  });

  return position;
}

export function createArrow(
  from: string,
  to: string,
  color: string = '#FFD700'
): { startSquare: string; endSquare: string; color: string } {
  return { startSquare: from, endSquare: to, color };
}

export function createArrowsFromUCI(
  uciMoves: string[],
  color: string = '#FFD700'
): Array<{ startSquare: string; endSquare: string; color: string }> {
  return uciMoves.map((uci) => ({
    startSquare: uci.slice(0, 2),
    endSquare: uci.slice(2, 4),
    color
  }));
}

export function indexToSquare(index: number): string {
  const file = String.fromCharCode(
    BOARD_CONFIG.asciiLowercaseA + (index % BOARD_CONFIG.size)
  );
  const rank = BOARD_CONFIG.size - Math.floor(index / BOARD_CONFIG.size);
  return `${file}${rank}`;
}

export function squareToIndex(square: string): number {
  const file = square.charCodeAt(0) - BOARD_CONFIG.asciiLowercaseA;
  const rank = BOARD_CONFIG.size - parseInt(square[1]);
  return rank * BOARD_CONFIG.size + file;
}

export function getSquaresBetween(from: string, to: string): string[] {
  const fromFile = from.charCodeAt(0) - BOARD_CONFIG.asciiLowercaseA;
  const fromRank = parseInt(from[1]) - 1;
  const toFile = to.charCodeAt(0) - BOARD_CONFIG.asciiLowercaseA;
  const toRank = parseInt(to[1]) - 1;

  const fileDiff = toFile - fromFile;
  const rankDiff = toRank - fromRank;

  if (
    fileDiff !== 0 &&
    rankDiff !== 0 &&
    Math.abs(fileDiff) !== Math.abs(rankDiff)
  ) {
    return [];
  }

  const squares: string[] = [];
  const fileStep = fileDiff === 0 ? 0 : fileDiff > 0 ? 1 : -1;
  const rankStep = rankDiff === 0 ? 0 : rankDiff > 0 ? 1 : -1;

  let currentFile = fromFile + fileStep;
  let currentRank = fromRank + rankStep;

  while (currentFile !== toFile || currentRank !== toRank) {
    const file = String.fromCharCode(
      BOARD_CONFIG.asciiLowercaseA + currentFile
    );
    const rank = (currentRank + 1).toString();
    squares.push(`${file}${rank}`);
    currentFile += fileStep;
    currentRank += rankStep;
  }

  return squares;
}

export function isLightSquare(square: string): boolean {
  const file = square.charCodeAt(0) - BOARD_CONFIG.asciiLowercaseA;
  const rank = parseInt(square[1]) - 1;
  return (file + rank) % 2 === 1;
}

export function getOppositeColor(color: 'white' | 'black'): 'white' | 'black' {
  return color === 'white' ? 'black' : 'white';
}

export const PIECE_UNICODE = {
  wP: '♙',
  wN: '♘',
  wB: '♗',
  wR: '♖',
  wQ: '♕',
  wK: '♔',
  bP: '♟',
  bN: '♞',
  bB: '♝',
  bR: '♜',
  bQ: '♛',
  bK: '♚'
} as const;

export { ARROW_COLORS };

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function getFileFromIndex(index: number): string {
  return String.fromCharCode(BOARD_CONFIG.asciiLowercaseA + index);
}

export function getRankFromIndex(index: number): number {
  return BOARD_CONFIG.size - index;
}
