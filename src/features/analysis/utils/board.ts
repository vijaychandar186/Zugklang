import { Chess, Square } from 'chess.js';

interface Coordinate {
  x: number;
  y: number;
}

export interface InfluencingPiece {
  square: Square;
  color: string;
  type: string;
}

export const promotions = [undefined, 'b', 'n', 'r', 'q'] as const;

export const pieceValues: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: Infinity,
  m: 0 // placeholder for missing piece
};

function getBoardCoordinates(square: Square): Coordinate {
  return {
    x: 'abcdefgh'.indexOf(square.slice(0, 1)),
    y: parseInt(square.slice(1)) - 1
  };
}

function getSquare(coordinate: Coordinate): Square {
  return ('abcdefgh'.charAt(coordinate.x) +
    (coordinate.y + 1).toString()) as Square;
}

/**
 * Get all pieces that can attack a given square.
 */
export function getAttackers(fen: string, square: Square): InfluencingPiece[] {
  const attackers: InfluencingPiece[] = [];

  const board = new Chess(fen);
  const piece = board.get(square);

  if (!piece) return attackers;

  // Set colour to move to opposite of attacked piece
  board.load(
    fen.replace(/(?<= )(?:w|b)(?= )/g, piece.color === 'w' ? 'b' : 'w')
  );

  // Find each legal move that captures attacked piece
  const legalMoves = board.moves({ verbose: true });

  for (const move of legalMoves) {
    if (move.to === square) {
      attackers.push({
        square: move.from,
        color: move.color,
        type: move.piece
      });
    }
  }

  // If there is an opposite king around the attacked piece add him as an attacker
  // if he is not the only attacker or it is a legal move for the king to capture it
  let oppositeKing: InfluencingPiece | undefined;
  const oppositeColour = piece.color === 'w' ? 'b' : 'w';

  const pieceCoordinate = getBoardCoordinates(square);
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      if (xOffset === 0 && yOffset === 0) continue;

      const offsetSquare = getSquare({
        x: Math.min(Math.max(pieceCoordinate.x + xOffset, 0), 7),
        y: Math.min(Math.max(pieceCoordinate.y + yOffset, 0), 7)
      });
      const offsetPiece = board.get(offsetSquare);
      if (!offsetPiece) continue;

      if (offsetPiece.color === oppositeColour && offsetPiece.type === 'k') {
        oppositeKing = {
          color: offsetPiece.color,
          square: offsetSquare,
          type: offsetPiece.type
        };
        break;
      }
    }
    if (oppositeKing) break;
  }

  if (!oppositeKing) return attackers;

  let kingCaptureLegal = false;
  try {
    board.move({
      from: oppositeKing.square,
      to: square
    });
    kingCaptureLegal = true;
  } catch {
    // Move not legal
  }

  if (oppositeKing && (attackers.length > 0 || kingCaptureLegal)) {
    attackers.push(oppositeKing);
  }

  return attackers;
}

/**
 * Get all pieces that defend a given square.
 */
export function getDefenders(fen: string, square: Square): InfluencingPiece[] {
  const defenders: InfluencingPiece[] = [];

  const board = new Chess(fen);
  const piece = board.get(square);

  if (!piece) return defenders;

  // To find defenders, temporarily remove the piece and see what same-color pieces
  // can move to that square
  const pieceColor = piece.color;

  // Get all pieces of the same color that could capture on this square
  // if an enemy piece was there
  const legalMoves = board.moves({ verbose: true });

  for (const move of legalMoves) {
    // A defender is a piece that could recapture if the original piece was taken
    if (move.to === square && move.color === pieceColor) {
      defenders.push({
        square: move.from,
        color: move.color,
        type: move.piece
      });
    }
  }

  return defenders;
}

/**
 * Determine if a piece is "hanging" (can be captured without adequate defense).
 */
export function isPieceHanging(
  lastFen: string,
  fen: string,
  square: Square
): boolean {
  const lastBoard = new Chess(lastFen);
  const board = new Chess(fen);

  const lastPiece = lastBoard.get(square);
  const piece = board.get(square);

  // If no piece on the square, not hanging
  if (!piece) return false;

  const attackers = getAttackers(fen, square);
  const defenders = getDefenders(fen, square);

  // If piece was just traded equally or better, not hanging
  if (
    lastPiece &&
    pieceValues[lastPiece.type] >= pieceValues[piece.type] &&
    lastPiece.color !== piece.color
  ) {
    return false;
  }

  // If a rook took a minor piece that was only defended by one other
  // minor piece, it was a favourable rook exchange, so rook not hanging
  if (
    lastPiece &&
    piece.type === 'r' &&
    pieceValues[lastPiece.type] === 3 &&
    attackers.every((atk) => pieceValues[atk.type] === 3) &&
    attackers.length === 1
  ) {
    return false;
  }

  // If piece has an attacker of lower value, hanging
  if (
    attackers.some((atk) => pieceValues[atk.type] < pieceValues[piece.type])
  ) {
    return true;
  }

  if (attackers.length > defenders.length) {
    let minAttackerValue = Infinity;
    for (const attacker of attackers) {
      minAttackerValue = Math.min(pieceValues[attacker.type], minAttackerValue);
    }

    // If taking the piece even though it has more attackers than defenders
    // would be a sacrifice in itself, not hanging
    if (
      pieceValues[piece.type] < minAttackerValue &&
      defenders.some((dfn) => pieceValues[dfn.type] < minAttackerValue)
    ) {
      return false;
    }

    // If any of the piece's defenders are pawns, then the sacrificed piece
    // is the defending pawn. The least valuable attacker is equal in value
    // to the sacrificed piece at this point of the logic
    if (defenders.some((dfn) => pieceValues[dfn.type] === 1)) {
      return false;
    }

    return true;
  }

  return false;
}
