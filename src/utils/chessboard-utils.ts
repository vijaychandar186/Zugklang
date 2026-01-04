/**
 * Utility functions for react-chessboard
 * These helpers work with the react-chessboard library to provide additional functionality
 */

/**
 * Converts a FEN string to a position object compatible with react-chessboard
 * This is useful for displaying positions without using FEN strings directly
 *
 * @example
 * const position = fenToPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
 * // Returns: { a8: { pieceType: 'bR' }, b8: { pieceType: 'bN' }, ... }
 */
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
        // Empty squares
        fileIndex += parseInt(char);
      } else {
        // Piece
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

/**
 * Creates an arrow object for react-chessboard
 * Arrows can be used to show best moves, threats, or any other visual indicators
 */
export function createArrow(
  from: string,
  to: string,
  color: string = '#FFD700'
): { startSquare: string; endSquare: string; color: string } {
  return { startSquare: from, endSquare: to, color };
}

/**
 * Creates multiple arrows from UCI notation strings
 * Useful for showing multiple variations or analysis lines
 *
 * @example
 * const arrows = createArrowsFromUCI(['e2e4', 'd7d5'], '#00FF00');
 */
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

/**
 * Converts a square index (0-63) to algebraic notation
 * Useful for working with board array representations
 */
export function indexToSquare(index: number): string {
  const file = String.fromCharCode(97 + (index % 8)); // a-h
  const rank = 8 - Math.floor(index / 8); // 8-1
  return `${file}${rank}`;
}

/**
 * Converts algebraic notation to square index (0-63)
 * Reverse of indexToSquare
 */
export function squareToIndex(square: string): number {
  const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
  const rank = 8 - parseInt(square[1]); // 8=0, 7=1, etc.
  return rank * 8 + file;
}

/**
 * Gets all squares between two squares (for showing move paths, etc.)
 * Returns empty array if squares are not on same rank, file, or diagonal
 */
export function getSquaresBetween(from: string, to: string): string[] {
  const fromFile = from.charCodeAt(0) - 97;
  const fromRank = parseInt(from[1]) - 1;
  const toFile = to.charCodeAt(0) - 97;
  const toRank = parseInt(to[1]) - 1;

  const fileDiff = toFile - fromFile;
  const rankDiff = toRank - fromRank;

  // Not on same rank, file, or diagonal
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

/**
 * Checks if a square is a light or dark square
 */
export function isLightSquare(square: string): boolean {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  return (file + rank) % 2 === 1;
}

/**
 * Gets the opposite color
 */
export function getOppositeColor(color: 'white' | 'black'): 'white' | 'black' {
  return color === 'white' ? 'black' : 'white';
}

/**
 * Chess piece unicode characters for display
 */
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

/**
 * Standard arrow colors for different purposes
 * Re-exported from centralized colors.ts
 */
export { ARROW_COLORS } from '@/constants/colors';

/**
 * Formats time in MM:SS or HH:MM:SS format
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Gets file letter from file index (0-7)
 */
export function getFileFromIndex(index: number): string {
  return String.fromCharCode(97 + index);
}

/**
 * Gets rank number from rank index (0-7)
 */
export function getRankFromIndex(index: number): number {
  return 8 - index;
}
