export function generateChess960Fen(): string {
  const files = [0, 1, 2, 3, 4, 5, 6, 7];
  const darkSquares = [1, 3, 5, 7];
  const lightSquares = [0, 2, 4, 6];
  const bishop1Pos = darkSquares[Math.floor(Math.random() * 4)]!;
  const bishop2Pos = lightSquares[Math.floor(Math.random() * 4)]!;
  files.splice(files.indexOf(bishop1Pos), 1);
  files.splice(files.indexOf(bishop2Pos), 1);
  const queenIdx = Math.floor(Math.random() * files.length);
  const queenPos = files[queenIdx]!;
  files.splice(queenIdx, 1);
  const knight1Idx = Math.floor(Math.random() * files.length);
  const knight1Pos = files[knight1Idx]!;
  files.splice(knight1Idx, 1);
  const knight2Idx = Math.floor(Math.random() * files.length);
  const knight2Pos = files[knight2Idx]!;
  files.splice(knight2Idx, 1);
  const [rook1Pos, kingPos, rook2Pos] = files.sort((a, b) => a - b);
  if (
    rook1Pos === undefined ||
    kingPos === undefined ||
    rook2Pos === undefined
  ) {
    throw new Error('Chess960 FEN generation failed');
  }
  const pieces = new Array<string>(8);
  pieces[bishop1Pos] = 'b';
  pieces[bishop2Pos] = 'b';
  pieces[queenPos] = 'q';
  pieces[knight1Pos] = 'n';
  pieces[knight2Pos] = 'n';
  pieces[rook1Pos] = 'r';
  pieces[kingPos] = 'k';
  pieces[rook2Pos] = 'r';
  const backRankBlack = pieces.join('');
  const backRankWhite = backRankBlack.toUpperCase();
  const leftRookFile = String.fromCharCode(97 + rook1Pos);
  const rightRookFile = String.fromCharCode(97 + rook2Pos);
  const castling = `KQ${leftRookFile}${rightRookFile}kq${leftRookFile}${rightRookFile}`;
  return `${backRankBlack}/pppppppp/8/8/8/8/PPPPPPPP/${backRankWhite} w ${castling} - 0 1`;
}
export function getStartingFen(variant: string): string {
  switch (variant) {
    case 'fischerRandom':
      return generateChess960Fen();
    case 'racingKings':
      return '8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w KQkq - 0 1';
    case 'horde':
      return 'rnbqkbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w kq - 0 1';
    default:
      return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }
}
