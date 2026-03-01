import {
  type BoardId,
  type AttackBoardId,
  type AttackBoardSlot,
  type TriDSquare,
  type PieceMap,
  type AttackBoardSlots,
  type GlobalPos,
  type PieceType,
  type Color,
  squareKey,
  parseSquareKey,
  BOARD_SIZES,
  FIXED_BOARD_OFFSETS,
  SLOT_OFFSETS,
  ADJACENT_SLOTS,
  ALL_BOARDS,
  ATTACK_BOARDS
} from './types';
const SLOT_LEVEL: Record<AttackBoardSlot, number> = {
  left_low: 0,
  right_low: 0,
  left_mid_low: 1,
  right_mid_low: 1,
  left_mid_high: 2,
  right_mid_high: 2,
  left_high: 3,
  right_high: 3
};
function isBackwardMove(
  from: AttackBoardSlot,
  to: AttackBoardSlot,
  boardId: AttackBoardId
): boolean {
  const fromLevel = SLOT_LEVEL[from];
  const toLevel = SLOT_LEVEL[to];
  if (fromLevel === toLevel) return false;
  const isWhiteBoard = boardId === 'wa1' || boardId === 'wa2';
  return isWhiteBoard ? toLevel < fromLevel : toLevel > fromLevel;
}
export function getBoardOffset(
  boardId: BoardId,
  slots: AttackBoardSlots
): GlobalPos {
  if (boardId === 'wh') return FIXED_BOARD_OFFSETS.wh;
  if (boardId === 'n') return FIXED_BOARD_OFFSETS.n;
  if (boardId === 'bh') return FIXED_BOARD_OFFSETS.bh;
  const slot = slots[boardId as AttackBoardId];
  return SLOT_OFFSETS[slot];
}
export function squareToGlobal(
  sq: TriDSquare,
  slots: AttackBoardSlots
): GlobalPos {
  const off = getBoardOffset(sq.boardId, slots);
  return { x: off.x + sq.col, y: off.y + sq.row };
}
export function squaresAtGlobal(
  gx: number,
  gy: number,
  slots: AttackBoardSlots
): TriDSquare[] {
  const result: TriDSquare[] = [];
  for (const boardId of ALL_BOARDS) {
    const off = getBoardOffset(boardId, slots);
    const size = BOARD_SIZES[boardId];
    const row = gy - off.y;
    const col = gx - off.x;
    if (row >= 0 && row < size.rows && col >= 0 && col < size.cols) {
      result.push({ boardId, row, col });
    }
  }
  return result;
}
function pieceAtGlobal(
  gx: number,
  gy: number,
  pieces: PieceMap,
  slots: AttackBoardSlots
): {
  sq: TriDSquare;
  color: Color;
} | null {
  for (const { sq, piece } of piecesAtGlobal(gx, gy, pieces, slots)) {
    return { sq, color: piece.color };
  }
  return null;
}
function piecesAtGlobal(
  gx: number,
  gy: number,
  pieces: PieceMap,
  slots: AttackBoardSlots
): Array<{
  sq: TriDSquare;
  piece: {
    type: PieceType;
    color: Color;
    hasMoved?: boolean;
  };
}> {
  const result: Array<{
    sq: TriDSquare;
    piece: {
      type: PieceType;
      color: Color;
      hasMoved?: boolean;
    };
  }> = [];
  for (const sq of squaresAtGlobal(gx, gy, slots)) {
    const p = pieces[squareKey(sq)];
    if (p) result.push({ sq, piece: p });
  }
  return result;
}
function kingDeltas(sx: number, sy: number): GlobalPos[] {
  const result: GlobalPos[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) {
        result.push({ x: sx + dx, y: sy + dy });
      }
    }
  }
  return result;
}
function knightDeltas(sx: number, sy: number): GlobalPos[] {
  return [
    { x: sx + 2, y: sy + 1 },
    { x: sx + 2, y: sy - 1 },
    { x: sx - 2, y: sy + 1 },
    { x: sx - 2, y: sy - 1 },
    { x: sx + 1, y: sy + 2 },
    { x: sx + 1, y: sy - 2 },
    { x: sx - 1, y: sy + 2 },
    { x: sx - 1, y: sy - 2 }
  ];
}
export interface EnPassantTarget {
  gx: number;
  gy: number;
}
export function rawMovesForSquare(
  from: TriDSquare,
  pieces: PieceMap,
  slots: AttackBoardSlots,
  enPassantTarget?: EnPassantTarget | null
): TriDSquare[] {
  const piece = pieces[squareKey(from)];
  if (!piece) return [];
  const { x: sx, y: sy } = squareToGlobal(from, slots);
  const color = piece.color;
  const result: TriDSquare[] = [];
  const slidingRay = (dx: number, dy: number) => {
    for (let step = 1; step <= 7; step++) {
      const tx = sx + dx * step;
      const ty = sy + dy * step;
      if (tx < 0 || tx > 7 || ty < 0 || ty > 7) break;
      const dests = squaresAtGlobal(tx, ty, slots);
      if (dests.length === 0) break;
      const occupants = piecesAtGlobal(tx, ty, pieces, slots);
      if (occupants.length > 0) {
        const capturableSquares = dests.filter((d) => {
          const target = pieces[squareKey(d)];
          return !!target && target.color !== color;
        });
        result.push(...capturableSquares);
        break;
      }
      result.push(...dests);
    }
  };
  const addKnightStep = (targets: GlobalPos[]) => {
    for (const { x: tx, y: ty } of targets) {
      if (tx < 0 || tx > 7 || ty < 0 || ty > 7) continue;
      const dests = squaresAtGlobal(tx, ty, slots);
      if (dests.length === 0) continue;
      result.push(
        ...dests.filter((d) => pieces[squareKey(d)]?.color !== color)
      );
    }
  };
  const addKingStep = (targets: GlobalPos[]) => {
    for (const { x: tx, y: ty } of targets) {
      if (tx < 0 || tx > 7 || ty < 0 || ty > 7) continue;
      const dests = squaresAtGlobal(tx, ty, slots);
      if (dests.length === 0) continue;
      const occupants = piecesAtGlobal(tx, ty, pieces, slots);
      if (occupants.length === 0) {
        result.push(...dests);
        continue;
      }
      result.push(
        ...dests.filter((d) => {
          const target = pieces[squareKey(d)];
          return !!target && target.color !== color;
        })
      );
    }
  };
  switch (piece.type) {
    case 'r':
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
      ] as [number, number][])
        slidingRay(dx, dy);
      break;
    case 'b':
      for (const [dx, dy] of [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
      ] as [number, number][])
        slidingRay(dx, dy);
      break;
    case 'q':
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
      ] as [number, number][])
        slidingRay(dx, dy);
      break;
    case 'n':
      addKnightStep(knightDeltas(sx, sy));
      break;
    case 'k':
      addKingStep(kingDeltas(sx, sy));
      break;
    case 'p': {
      const dir = color === 'w' ? 1 : -1;
      const ty1 = sy + dir;
      if (ty1 >= 0 && ty1 <= 7) {
        const oneStepSquares = squaresAtGlobal(sx, ty1, slots);
        const blocked = pieceAtGlobal(sx, ty1, pieces, slots);
        if (oneStepSquares.length > 0 && !blocked) {
          result.push(...oneStepSquares);
          if (!piece.hasMoved) {
            const ty2 = sy + dir * 2;
            const twoStepSquares =
              ty2 >= 0 && ty2 <= 7 ? squaresAtGlobal(sx, ty2, slots) : [];
            if (
              twoStepSquares.length > 0 &&
              !pieceAtGlobal(sx, ty2, pieces, slots)
            )
              result.push(...twoStepSquares);
          }
        }
      }
      for (const dcx of [-1, 1]) {
        const tx = sx + dcx;
        const ty = sy + dir;
        if (tx < 0 || tx > 7 || ty < 0 || ty > 7) continue;
        const dests = squaresAtGlobal(tx, ty, slots);
        if (dests.length === 0) continue;
        const hit = pieceAtGlobal(tx, ty, pieces, slots);
        if (hit && hit.color !== color) {
          result.push(
            ...dests.filter((d) => {
              const target = pieces[squareKey(d)];
              return !!target && target.color !== color;
            })
          );
        }
        if (
          enPassantTarget &&
          tx === enPassantTarget.gx &&
          ty === enPassantTarget.gy &&
          !pieceAtGlobal(tx, ty, pieces, slots)
        ) {
          result.push(...dests);
        }
      }
      break;
    }
  }
  const seen = new Set<string>();
  return result.filter((sq) => {
    const k = squareKey(sq);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
function findKing(color: Color, pieces: PieceMap): TriDSquare | null {
  for (const [key, piece] of Object.entries(pieces)) {
    if (piece.type === 'k' && piece.color === color) {
      const [boardId, row, col] = key.split(':');
      return {
        boardId: boardId as BoardId,
        row: Number(row),
        col: Number(col)
      };
    }
  }
  return null;
}
export function isInCheck(
  color: Color,
  pieces: PieceMap,
  slots: AttackBoardSlots
): boolean {
  const king = findKing(color, pieces);
  if (!king) return false;
  const kingG = squareToGlobal(king, slots);
  const opponent: Color = color === 'w' ? 'b' : 'w';
  for (const [key, piece] of Object.entries(pieces)) {
    if (piece.color !== opponent) continue;
    const sq = parseSquareKey(key);
    const moves = rawMovesForSquare(sq, pieces, slots, null);
    if (
      moves.some((m) => {
        const mg = squareToGlobal(m, slots);
        return mg.x === kingG.x && mg.y === kingG.y;
      })
    )
      return true;
  }
  return false;
}
function getCastlingMoves(
  kingFrom: TriDSquare,
  color: Color,
  pieces: PieceMap,
  slots: AttackBoardSlots
): TriDSquare[] {
  const result: TriDSquare[] = [];
  if (!ATTACK_BOARDS.includes(kingFrom.boardId as AttackBoardId)) return result;
  const king = pieces[squareKey(kingFrom)];
  if (!king || king.hasMoved) return result;
  if (isInCheck(color, pieces, slots)) return result;
  const kingBoard = kingFrom.boardId as AttackBoardId;
  const isWhiteBoard = kingBoard === 'wa1' || kingBoard === 'wa2';
  const backRank = isWhiteBoard ? 0 : 1;
  const pairedBoard: AttackBoardId =
    kingBoard === 'wa1'
      ? 'wa2'
      : kingBoard === 'wa2'
        ? 'wa1'
        : kingBoard === 'ba1'
          ? 'ba2'
          : 'ba1';
  const kingSafeAt = (rookSq: TriDSquare): boolean => {
    const testPieces = { ...pieces };
    delete testPieces[squareKey(kingFrom)];
    testPieces[squareKey(rookSq)] = { type: 'k', color };
    return !isInCheck(color, testPieces, slots);
  };
  for (const [key, rook] of Object.entries(pieces)) {
    if (rook.type !== 'r' || rook.color !== color || rook.hasMoved) continue;
    const rookSq = parseSquareKey(key);
    if (rookSq.boardId !== kingBoard) continue;
    if (squareKey(rookSq) === squareKey(kingFrom)) continue;
    if (!kingSafeAt(rookSq)) continue;
    result.push(rookSq);
  }
  if (kingFrom.row === backRank) {
    for (const [key, rook] of Object.entries(pieces)) {
      if (rook.type !== 'r' || rook.color !== color || rook.hasMoved) continue;
      const rookSq = parseSquareKey(key);
      if (rookSq.boardId !== pairedBoard) continue;
      if (rookSq.row !== backRank) continue;
      const kingBoardOffset = getBoardOffset(kingBoard, slots);
      const pathY = kingBoardOffset.y + backRank;
      let pathClear = true;
      for (let x = 2; x <= 5; x++) {
        if (pieceAtGlobal(x, pathY, pieces, slots)) {
          pathClear = false;
          break;
        }
      }
      if (!pathClear) continue;
      if (!kingSafeAt(rookSq)) continue;
      result.push(rookSq);
    }
  }
  return result;
}
export function legalMovesForSquare(
  from: TriDSquare,
  pieces: PieceMap,
  slots: AttackBoardSlots,
  enPassantTarget?: EnPassantTarget | null
): TriDSquare[] {
  const piece = pieces[squareKey(from)];
  if (!piece) return [];
  const candidates = rawMovesForSquare(from, pieces, slots, enPassantTarget);
  const legal = candidates.filter((to) => {
    const newPieces = { ...pieces };
    delete newPieces[squareKey(from)];
    newPieces[squareKey(to)] = { ...piece, hasMoved: true };
    if (piece.type === 'p' && enPassantTarget) {
      const toG = squareToGlobal(to, slots);
      if (toG.x === enPassantTarget.gx && toG.y === enPassantTarget.gy) {
        const dir = piece.color === 'w' ? 1 : -1;
        for (const capturedSq of squaresAtGlobal(
          enPassantTarget.gx,
          enPassantTarget.gy - dir,
          slots
        )) {
          delete newPieces[squareKey(capturedSq)];
        }
      }
    }
    return !isInCheck(piece.color, newPieces, slots);
  });
  if (piece.type === 'k' && !piece.hasMoved) {
    const castlingDests = getCastlingMoves(from, piece.color, pieces, slots);
    for (const dest of castlingDests) {
      if (!legal.some((l) => squareKey(l) === squareKey(dest)))
        legal.push(dest);
    }
  }
  return legal;
}
export function legalAttackBoardMoves(
  boardId: AttackBoardId,
  color: Color,
  pieces: PieceMap,
  slots: AttackBoardSlots
): AttackBoardSlot[] {
  const currentSlot = slots[boardId];
  const size = BOARD_SIZES[boardId];
  let pieceCount = 0;
  let controllingColor: Color | null = null;
  for (let r = 0; r < size.rows; r++) {
    for (let c = 0; c < size.cols; c++) {
      const p = pieces[squareKey({ boardId, row: r, col: c })];
      if (p) {
        pieceCount++;
        if (controllingColor === null) controllingColor = p.color;
      }
    }
  }
  if (pieceCount > 1) return [];
  const defaultOwner: Color = boardId.startsWith('w') ? 'w' : 'b';
  const controller = controllingColor ?? defaultOwner;
  if (controller !== color) return [];
  const isOccupied = pieceCount === 1;
  const movingPassenger = isOccupied
    ? (() => {
        for (let r = 0; r < size.rows; r++) {
          for (let c = 0; c < size.cols; c++) {
            const sq: TriDSquare = { boardId, row: r, col: c };
            const piece = pieces[squareKey(sq)];
            if (piece) return { sq, piece };
          }
        }
        return null;
      })()
    : null;
  const takenSlots = new Set(Object.values(slots));
  takenSlots.delete(currentSlot);
  return ADJACENT_SLOTS[currentSlot].filter((slot) => {
    if (takenSlots.has(slot)) return false;
    if (isOccupied && isBackwardMove(currentSlot, slot, boardId)) return false;
    if (movingPassenger) {
      const destOffset = SLOT_OFFSETS[slot];
      const gx = destOffset.x + movingPassenger.sq.col;
      const gy = destOffset.y + movingPassenger.sq.row;
      const blockers = piecesAtGlobal(gx, gy, pieces, slots).filter(
        ({ sq, piece }) => {
          if (sq.boardId === boardId) return false;
          return piece.type !== 'n';
        }
      );
      if (blockers.length > 0) return false;
    }
    const testSlots: AttackBoardSlots = { ...slots, [boardId]: slot };
    if (isInCheck(color, pieces, testSlots)) return false;
    return true;
  });
}
export function hasAnyLegalMove(
  color: Color,
  pieces: PieceMap,
  slots: AttackBoardSlots,
  enPassantTarget?: EnPassantTarget | null
): boolean {
  for (const [key, piece] of Object.entries(pieces)) {
    if (piece.color !== color) continue;
    const sq = parseSquareKey(key);
    if (legalMovesForSquare(sq, pieces, slots, enPassantTarget).length > 0)
      return true;
  }
  for (const boardId of ATTACK_BOARDS) {
    if (legalAttackBoardMoves(boardId, color, pieces, slots).length > 0)
      return true;
  }
  return false;
}
export function isPawnPromotion(
  from: TriDSquare,
  to: TriDSquare,
  piece: {
    type: PieceType;
    color: Color;
  },
  slots: AttackBoardSlots
): boolean {
  if (piece.type !== 'p') return false;
  const { y: ty } = squareToGlobal(to, slots);
  return (piece.color === 'w' && ty === 7) || (piece.color === 'b' && ty === 0);
}
export function buildPieceSan(
  from: TriDSquare,
  to: TriDSquare,
  piece: {
    type: PieceType;
    color: Color;
  },
  captured: boolean,
  promotion?: PieceType,
  castlingSide?: 'k' | 'q',
  isEnPassant?: boolean
): string {
  if (castlingSide === 'k') return '0-0';
  if (castlingSide === 'q') return '0-0-0';
  const PIECE_SYM: Record<PieceType, string> = {
    k: 'K',
    q: 'Q',
    r: 'R',
    b: 'B',
    n: 'N',
    p: ''
  };
  const BOARD_SHORT: Record<string, string> = {
    wh: 'WH',
    n: 'N',
    bh: 'BH',
    wa1: 'WA1',
    wa2: 'WA2',
    ba1: 'BA1',
    ba2: 'BA2'
  };
  const FILE = 'abcd';
  const fromStr = `${BOARD_SHORT[from.boardId]}${FILE[from.col]}${from.row + 1}`;
  const toStr = `${BOARD_SHORT[to.boardId]}${FILE[to.col]}${to.row + 1}`;
  const sep = captured ? 'x' : '-';
  const promo = promotion ? `=${promotion.toUpperCase()}` : '';
  const ep = isEnPassant ? ' e.p.' : '';
  return `${PIECE_SYM[piece.type]}${fromStr}${sep}${toStr}${promo}${ep}`;
}
export function buildBoardSan(
  boardId: AttackBoardId,
  toSlot: AttackBoardSlot
): string {
  const SLOT_SHORT: Record<AttackBoardSlot, string> = {
    left_high: 'L4',
    left_mid_high: 'L3',
    left_mid_low: 'L2',
    left_low: 'L1',
    right_high: 'R4',
    right_mid_high: 'R3',
    right_mid_low: 'R2',
    right_low: 'R1'
  };
  return `${boardId.toUpperCase()}→${SLOT_SHORT[toSlot]}`;
}
