import { ARROW_COLORS } from '@/features/chess/config/colors';

export function fenToPosition(
  fen: string
): Record<string, { pieceType: string }> {
  const position: Record<string, { pieceType: string }> = {};
  const rows = fen.split(' ')[0].split('/');

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  rows.forEach((row, rowIndex) => {
    let fileIndex = 0;
    for (const char of row) {
      if (!isNaN(parseInt(char))) {
        fileIndex += parseInt(char);
      } else {
        const square = `${files[fileIndex]}${ranks[rowIndex]}`;
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
  const file = String.fromCharCode(97 + (index % 8));
  const rank = 8 - Math.floor(index / 8);
  return `${file}${rank}`;
}

export function squareToIndex(square: string): number {
  const file = square.charCodeAt(0) - 97;
  const rank = 8 - parseInt(square[1]);
  return rank * 8 + file;
}

export function getSquaresBetween(from: string, to: string): string[] {
  const fromFile = from.charCodeAt(0) - 97;
  const fromRank = parseInt(from[1]) - 1;
  const toFile = to.charCodeAt(0) - 97;
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
    const file = String.fromCharCode(97 + currentFile);
    const rank = (currentRank + 1).toString();
    squares.push(`${file}${rank}`);
    currentFile += fileStep;
    currentRank += rankStep;
  }

  return squares;
}

export function isLightSquare(square: string): boolean {
  const file = square.charCodeAt(0) - 97;
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
  return String.fromCharCode(97 + index);
}

export function getRankFromIndex(index: number): number {
  return 8 - index;
}
