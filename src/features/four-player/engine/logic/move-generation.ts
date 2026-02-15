import type { BoardPosition } from '../types/core';
import type { Piece } from './Piece';
import { isInBounds } from '../utils/board-utils';
import {
  isOccupied,
  isOccupiedByOpponent,
  isEmptyOrOpponent
} from '../utils/piece-utils';
import { BOARD_CONFIG } from '../config/board';
import { TEAM_PAWN_CONFIG, isVerticalTeam } from '../config/teams';
import {
  KNIGHT_OFFSETS,
  DIAGONAL_DIRECTIONS,
  ORTHOGONAL_DIRECTIONS,
  ALL_DIRECTIONS,
  PAWN_ATTACK_OFFSETS
} from '../config/directions';

// ── Pawn moves ─────────────────────────────────────────────────────

export function generatePawnMoves(
  piece: Piece,
  pieces: readonly Piece[]
): BoardPosition[] {
  const moves: BoardPosition[] = [];
  const config = TEAM_PAWN_CONFIG[piece.team];

  if (config.axis === 'vertical') {
    // Forward move along y-axis
    const nextY = piece.y + config.direction;
    if (isInBounds(piece.x, nextY) && !isOccupied(pieces, piece.x, nextY)) {
      moves.push({ x: piece.x, y: nextY });

      // Double push from starting rank
      const doubleY = nextY + config.direction;
      if (
        piece.y === config.startRank &&
        isInBounds(piece.x, doubleY) &&
        !isOccupied(pieces, piece.x, doubleY)
      ) {
        moves.push({ x: piece.x, y: doubleY });
      }
    }

    // Diagonal captures
    for (const lateralOffset of PAWN_ATTACK_OFFSETS) {
      const attackX = piece.x + lateralOffset;
      const attackY = piece.y + config.direction;
      if (
        isInBounds(attackX, attackY) &&
        isOccupiedByOpponent(pieces, attackX, attackY, piece.team)
      ) {
        moves.push({ x: attackX, y: attackY });
      }
    }
  } else {
    // Forward move along x-axis (horizontal teams: Blue/Green)
    const nextX = piece.x + config.direction;
    if (isInBounds(nextX, piece.y) && !isOccupied(pieces, nextX, piece.y)) {
      moves.push({ x: nextX, y: piece.y });

      // Double push from starting rank
      const doubleX = nextX + config.direction;
      if (
        piece.x === config.startRank &&
        isInBounds(doubleX, piece.y) &&
        !isOccupied(pieces, doubleX, piece.y)
      ) {
        moves.push({ x: doubleX, y: piece.y });
      }
    }

    // Lateral captures
    for (const lateralOffset of PAWN_ATTACK_OFFSETS) {
      const attackX = piece.x + config.direction;
      const attackY = piece.y + lateralOffset;
      if (
        isInBounds(attackX, attackY) &&
        isOccupiedByOpponent(pieces, attackX, attackY, piece.team)
      ) {
        moves.push({ x: attackX, y: attackY });
      }
    }
  }

  return moves;
}

// ── Knight moves ───────────────────────────────────────────────────

export function generateKnightMoves(
  piece: Piece,
  pieces: readonly Piece[]
): BoardPosition[] {
  const moves: BoardPosition[] = [];

  for (const [dx, dy] of KNIGHT_OFFSETS) {
    const targetX = piece.x + dx;
    const targetY = piece.y + dy;
    if (
      isInBounds(targetX, targetY) &&
      isEmptyOrOpponent(pieces, targetX, targetY, piece.team)
    ) {
      moves.push({ x: targetX, y: targetY });
    }
  }

  return moves;
}

// ── Sliding moves (bishop, rook, queen) ────────────────────────────

export function generateSlidingMoves(
  piece: Piece,
  pieces: readonly Piece[],
  directions: ReadonlyArray<readonly [number, number]>
): BoardPosition[] {
  const moves: BoardPosition[] = [];

  for (const [dx, dy] of directions) {
    for (let step = 1; step < BOARD_CONFIG.size; step++) {
      const targetX = piece.x + dx * step;
      const targetY = piece.y + dy * step;

      if (!isInBounds(targetX, targetY)) break;

      if (!isOccupied(pieces, targetX, targetY)) {
        moves.push({ x: targetX, y: targetY });
      } else if (isOccupiedByOpponent(pieces, targetX, targetY, piece.team)) {
        moves.push({ x: targetX, y: targetY });
        break;
      } else {
        break; // Blocked by own piece
      }
    }
  }

  return moves;
}

export function generateBishopMoves(
  piece: Piece,
  pieces: readonly Piece[]
): BoardPosition[] {
  return generateSlidingMoves(piece, pieces, DIAGONAL_DIRECTIONS);
}

export function generateRookMoves(
  piece: Piece,
  pieces: readonly Piece[]
): BoardPosition[] {
  return generateSlidingMoves(piece, pieces, ORTHOGONAL_DIRECTIONS);
}

export function generateQueenMoves(
  piece: Piece,
  pieces: readonly Piece[]
): BoardPosition[] {
  return generateSlidingMoves(piece, pieces, ALL_DIRECTIONS);
}

// ── King moves ─────────────────────────────────────────────────────

export function generateKingMoves(
  piece: Piece,
  pieces: readonly Piece[]
): BoardPosition[] {
  const moves: BoardPosition[] = [];

  for (const [dx, dy] of ALL_DIRECTIONS) {
    const targetX = piece.x + dx;
    const targetY = piece.y + dy;
    if (
      isInBounds(targetX, targetY) &&
      isEmptyOrOpponent(pieces, targetX, targetY, piece.team)
    ) {
      moves.push({ x: targetX, y: targetY });
    }
  }

  return moves;
}

// ── Raw move dispatch ──────────────────────────────────────────────

/** Dispatch to the correct move generator based on piece type */
export function generateRawMoves(
  piece: Piece,
  pieces: readonly Piece[]
): BoardPosition[] {
  switch (piece.type) {
    case 'P':
      return generatePawnMoves(piece, pieces);
    case 'N':
      return generateKnightMoves(piece, pieces);
    case 'B':
      return generateBishopMoves(piece, pieces);
    case 'R':
      return generateRookMoves(piece, pieces);
    case 'Q':
      return generateQueenMoves(piece, pieces);
    case 'K':
      return generateKingMoves(piece, pieces);
    default:
      return [];
  }
}

// ── Castling ───────────────────────────────────────────────────────

/** Generate castling target squares for the given king */
export function generateCastlingMoves(
  king: Piece,
  pieces: readonly Piece[]
): BoardPosition[] {
  const moves: BoardPosition[] = [];
  if (king.hasMoved) return moves;

  const rooks = pieces.filter(
    (piece) => piece.type === 'R' && piece.team === king.team && !piece.hasMoved
  );
  const isVertical = isVerticalTeam(king.team);

  for (const rook of rooks) {
    const direction = isVertical
      ? rook.x - king.x > 0
        ? 1
        : -1
      : rook.y - king.y > 0
        ? 1
        : -1;

    // Check path between king and rook is clear
    if (!isPathClear(king, rook, isVertical, direction, pieces)) continue;

    // Check that king's path (current + 2 squares toward rook) is not attacked
    if (!isCastlingPathSafe(king, isVertical, direction, pieces)) continue;

    moves.push({ x: rook.x, y: rook.y });
  }

  return moves;
}

function isPathClear(
  king: Piece,
  rook: Piece,
  isVertical: boolean,
  direction: number,
  pieces: readonly Piece[]
): boolean {
  if (isVertical) {
    for (let x = king.x + direction; x !== rook.x; x += direction) {
      if (isOccupied(pieces, x, king.y)) return false;
    }
  } else {
    for (let y = king.y + direction; y !== rook.y; y += direction) {
      if (isOccupied(pieces, king.x, y)) return false;
    }
  }
  return true;
}

function isCastlingPathSafe(
  king: Piece,
  isVertical: boolean,
  direction: number,
  pieces: readonly Piece[]
): boolean {
  const enemies = pieces.filter((piece) => piece.team !== king.team);

  for (let step = 0; step <= 2; step++) {
    const checkX = isVertical ? king.x + direction * step : king.x;
    const checkY = isVertical ? king.y : king.y + direction * step;

    for (const enemy of enemies) {
      const enemyMoves = generateRawMoves(enemy, pieces);
      if (enemyMoves.some((move) => move.x === checkX && move.y === checkY)) {
        return false;
      }
    }
  }

  return true;
}
