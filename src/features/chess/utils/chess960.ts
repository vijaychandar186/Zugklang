/**
 * Chess960 / Fischer Random utility
 * Generates random starting positions according to Chess960 rules
 */

/**
 * Generate a random Chess960 position number (0-959)
 */
export function generateRandomChess960Number(): number {
  return Math.floor(Math.random() * 960);
}

/**
 * Generate a Chess960 starting position FEN from a position number (0-959)
 * Uses the standard Chess960 indexing scheme
 */
export function chess960PositionToFEN(positionNumber: number): string {
  const pieces = new Array(8).fill('');
  
  // Step 1: Place the bishops (must be on different colored squares)
  // First bishop on dark square (b, d, f, h = indexes 1, 3, 5, 7)
  const darkSquares = [1, 3, 5, 7];
  const lightSquares = [0, 2, 4, 6];
  
  let n = positionNumber;
  
  // Calculation based on Chess960 numbering scheme
  const n2 = Math.floor(n / 4);
  const b1 = n % 4; // First bishop on dark square
  pieces[darkSquares[b1]] = 'B';
  
  const n3 = Math.floor(n2 / 4);
  const b2 = n2 % 4; // Second bishop on light square
  pieces[lightSquares[b2]] = 'B';
  
  const n4 = Math.floor(n3 / 6);
  const q = n3 % 6; // Queen position among remaining squares
  
  // Get remaining empty squares
  let emptySquares = pieces.map((p, i) => p === '' ? i : -1).filter(i => i !== -1);
  pieces[emptySquares[q]] = 'Q';
  
  // Knights placement based on n4 (0-9 for 10 combinations of 2 from 5 remaining)
  const knightPositions = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 2], [1, 3], [1, 4],
    [2, 3], [2, 4],
    [3, 4]
  ];
  
  emptySquares = pieces.map((p, i) => p === '' ? i : -1).filter(i => i !== -1);
  const [k1, k2] = knightPositions[n4];
  pieces[emptySquares[k1]] = 'N';
  pieces[emptySquares[k2]] = 'N';
  
  // Remaining 3 squares get R, K, R (king between rooks)
  emptySquares = pieces.map((p, i) => p === '' ? i : -1).filter(i => i !== -1);
  pieces[emptySquares[0]] = 'R';
  pieces[emptySquares[1]] = 'K';
  pieces[emptySquares[2]] = 'R';
  
  // Build the FEN
  const whiteBackRank = pieces.join('');
  const blackBackRank = whiteBackRank.toLowerCase();
  
  return `${blackBackRank}/pppppppp/8/8/8/8/PPPPPPPP/${whiteBackRank} w KQkq - 0 1`;
}

/**
 * Generate a random Chess960 FEN directly
 */
export function generateRandomChess960FEN(): string {
  const positionNumber = generateRandomChess960Number();
  return chess960PositionToFEN(positionNumber);
}

/**
 * Validate if a back rank position is valid for Chess960
 * (King between rooks, bishops on different colors)
 */
export function isValidChess960BackRank(pieces: string[]): boolean {
  if (pieces.length !== 8) return false;
  
  const kingIndex = pieces.indexOf('K');
  const rookIndices = pieces.map((p, i) => p === 'R' ? i : -1).filter(i => i !== -1);
  const bishopIndices = pieces.map((p, i) => p === 'B' ? i : -1).filter(i => i !== -1);
  
  // King must be between the two rooks
  if (rookIndices.length !== 2) return false;
  if (kingIndex < rookIndices[0] || kingIndex > rookIndices[1]) return false;
  
  // Bishops must be on different colored squares
  if (bishopIndices.length !== 2) return false;
  const b1Color = bishopIndices[0] % 2;
  const b2Color = bishopIndices[1] % 2;
  if (b1Color === b2Color) return false;
  
  return true;
}

export type ChessVariant = 'standard' | 'fischerRandom';
