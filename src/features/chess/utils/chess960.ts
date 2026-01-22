export function generateRandomChess960Number(): number {
  return Math.floor(Math.random() * 960);
}

export function chess960PositionToFEN(positionNumber: number): string {
  const pieces = new Array(8).fill('');

  const darkSquares = [1, 3, 5, 7];
  const lightSquares = [0, 2, 4, 6];

  const n = positionNumber;

  const n2 = Math.floor(n / 4);
  const b1 = n % 4;
  pieces[darkSquares[b1]] = 'B';

  const n3 = Math.floor(n2 / 4);
  const b2 = n2 % 4;
  pieces[lightSquares[b2]] = 'B';

  const n4 = Math.floor(n3 / 6);
  const q = n3 % 6;

  let emptySquares = pieces
    .map((p, i) => (p === '' ? i : -1))
    .filter((i) => i !== -1);
  pieces[emptySquares[q]] = 'Q';

  const knightPositions = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4]
  ];

  emptySquares = pieces
    .map((p, i) => (p === '' ? i : -1))
    .filter((i) => i !== -1);
  const [k1, k2] = knightPositions[n4];
  pieces[emptySquares[k1]] = 'N';
  pieces[emptySquares[k2]] = 'N';

  emptySquares = pieces
    .map((p, i) => (p === '' ? i : -1))
    .filter((i) => i !== -1);
  pieces[emptySquares[0]] = 'R';
  pieces[emptySquares[1]] = 'K';
  pieces[emptySquares[2]] = 'R';

  const whiteBackRank = pieces.join('');
  const blackBackRank = whiteBackRank.toLowerCase();

  return `${blackBackRank}/pppppppp/8/8/8/8/PPPPPPPP/${whiteBackRank} w KQkq - 0 1`;
}

export function generateRandomChess960FEN(): string {
  const positionNumber = generateRandomChess960Number();
  return chess960PositionToFEN(positionNumber);
}

export function isValidChess960BackRank(pieces: string[]): boolean {
  if (pieces.length !== 8) return false;

  const kingIndex = pieces.indexOf('K');
  const rookIndices = pieces
    .map((p, i) => (p === 'R' ? i : -1))
    .filter((i) => i !== -1);
  const bishopIndices = pieces
    .map((p, i) => (p === 'B' ? i : -1))
    .filter((i) => i !== -1);

  if (rookIndices.length !== 2) return false;
  if (kingIndex < rookIndices[0] || kingIndex > rookIndices[1]) return false;

  if (bishopIndices.length !== 2) return false;
  const b1Color = bishopIndices[0] % 2;
  const b2Color = bishopIndices[1] % 2;
  if (b1Color === b2Color) return false;

  return true;
}

export type ChessVariant = 'standard' | 'fischerRandom';
