import {
  type Color,
  type PieceType,
  type BoardId,
  type AttackBoardId,
  type AttackBoardSlot,
  type TriDSquare,
  type TriDMove,
  type TriDPiece,
  type PieceMap,
  type AttackBoardSlots,
  squareKey,
  BOARD_SIZES,
  ATTACK_BOARDS
} from './types';
import {
  type EnPassantTarget,
  legalMovesForSquare,
  legalAttackBoardMoves,
  isInCheck,
  hasAnyLegalMove,
  isPawnPromotion,
  buildPieceSan,
  buildBoardSan,
  squareToGlobal,
  squaresAtGlobal
} from './moveGenerator';
import { buildInitialPieces, buildInitialSlots } from './initialSetup';

export interface TriDGameState {
  pieces: PieceMap;
  slots: AttackBoardSlots;
  turn: Color;
  moveHistory: TriDMove[];
  isOver: boolean;
  result: string | null;
  /** Global position of the en-passant target square, or null if not available. */
  enPassantTarget: EnPassantTarget | null;
  /** Snapshot of pieces+slots after each move (index 0 = initial) */
  snapshots: Array<{ pieces: PieceMap; slots: AttackBoardSlots }>;
}

export function createInitialState(): TriDGameState {
  const pieces = buildInitialPieces();
  const slots = buildInitialSlots();
  return {
    pieces,
    slots,
    turn: 'w',
    moveHistory: [],
    isOver: false,
    result: null,
    enPassantTarget: null,
    snapshots: [{ pieces: { ...pieces }, slots: { ...slots } }]
  };
}

// ---------------------------------------------------------------------------
// Apply a piece move (regular, castling, en passant, promotion)
// ---------------------------------------------------------------------------

export function applyPieceMove(
  state: TriDGameState,
  from: TriDSquare,
  to: TriDSquare,
  promotion?: PieceType
): { nextState: TriDGameState; move: TriDMove } | null {
  const { pieces, slots, turn, enPassantTarget } = state;
  const piece = pieces[squareKey(from)];
  if (!piece || piece.color !== turn) return null;

  const legalDests = legalMovesForSquare(from, pieces, slots, enPassantTarget);
  const isLegal = legalDests.some((d) => squareKey(d) === squareKey(to));
  if (!isLegal) return null;

  // Check promotion requirement
  if (isPawnPromotion(from, to, piece, slots) && !promotion) return null;

  const fromG = squareToGlobal(from, slots);
  const toG = squareToGlobal(to, slots);
  const nextTurn: Color = turn === 'w' ? 'b' : 'w';

  // ── Detect castling (Meder rules) ─────────────────────────────────────────
  // Castling is a king-rook swap on attack boards only.
  // Kingside:  king and rook on the SAME attack board → they swap squares.
  // Queenside: king and rook on PAIRED attack boards (wa1↔wa2 / ba1↔ba2) → swap.
  const destPiece = pieces[squareKey(to)];
  const kingOnAttackBoard = ATTACK_BOARDS.includes(
    from.boardId as AttackBoardId
  );
  const rookOnAttackBoard = ATTACK_BOARDS.includes(to.boardId as AttackBoardId);

  const isCastle =
    piece.type === 'k' &&
    !piece.hasMoved &&
    kingOnAttackBoard &&
    rookOnAttackBoard &&
    destPiece?.type === 'r' &&
    destPiece.color === turn &&
    !destPiece.hasMoved;

  if (isCastle) {
    // Both kingside and queenside execute identically: king ↔ rook position swap.
    const newPieces = { ...pieces };
    delete newPieces[squareKey(from)];
    delete newPieces[squareKey(to)];
    newPieces[squareKey(to)] = { type: 'k', color: turn, hasMoved: true };
    newPieces[squareKey(from)] = { type: 'r', color: turn, hasMoved: true };

    const side: 'k' | 'q' = to.boardId === from.boardId ? 'k' : 'q';
    const san = buildPieceSan(from, to, piece, false, undefined, side);
    const move: TriDMove = {
      type: 'piece',
      from,
      to,
      promotion: undefined,
      san
    };

    const newSlots = { ...slots };
    const inCheck = isInCheck(nextTurn, newPieces, newSlots);
    const noMoves = !hasAnyLegalMove(nextTurn, newPieces, newSlots, null);
    const isOver = noMoves;
    const castleResult = noMoves
      ? inCheck
        ? `${turn === 'w' ? 'White' : 'Black'} wins by checkmate`
        : 'Draw by stalemate'
      : null;

    return {
      move,
      nextState: {
        pieces: newPieces,
        slots: newSlots,
        turn: nextTurn,
        moveHistory: [...state.moveHistory, move],
        isOver,
        result: castleResult,
        enPassantTarget: null,
        snapshots: [
          ...state.snapshots,
          { pieces: { ...newPieces }, slots: { ...newSlots } }
        ]
      }
    };
  }

  // ── Detect en passant ────────────────────────────────────────────────────
  // En passant: pawn moves diagonally to the en-passant target square,
  // which has no piece on it — the captured pawn is one rank behind the target.
  const dir = turn === 'w' ? 1 : -1;
  const isEnPassant =
    piece.type === 'p' &&
    enPassantTarget !== null &&
    toG.x === enPassantTarget!.gx &&
    toG.y === enPassantTarget!.gy &&
    !destPiece; // destination is empty (pawn is behind it)

  const newPieces = { ...pieces };
  delete newPieces[squareKey(from)];

  if (isEnPassant) {
    // Remove the captured pawn (one rank "behind" the en-passant target)
    const capturedGy = enPassantTarget!.gy - dir;
    for (const capturedSq of squaresAtGlobal(
      enPassantTarget!.gx,
      capturedGy,
      slots
    )) {
      delete newPieces[squareKey(capturedSq)];
    }
  }

  // Place the moving piece (with hasMoved flag, or promoted piece)
  newPieces[squareKey(to)] = promotion
    ? { type: promotion, color: turn, hasMoved: true }
    : { ...piece, hasMoved: true };

  const captured = isEnPassant ? undefined : destPiece;
  const san = buildPieceSan(
    from,
    to,
    piece,
    !!captured || isEnPassant,
    promotion,
    undefined,
    isEnPassant
  );
  const move: TriDMove = { type: 'piece', from, to, captured, promotion, san };

  const newSlots = { ...slots };

  // ── Set new en-passant target ────────────────────────────────────────────
  // A pawn that just double-advanced sets the en-passant target to the
  // square it skipped over (Article 3.4(d)).
  let newEnPassantTarget: EnPassantTarget | null = null;
  if (piece.type === 'p' && Math.abs(toG.y - fromG.y) === 2) {
    newEnPassantTarget = { gx: fromG.x, gy: fromG.y + dir };
  }

  // ── Game-over detection ──────────────────────────────────────────────────
  let isOver = false;
  let result: string | null = null;

  if (captured?.type === 'k') {
    isOver = true;
    result = `${turn === 'w' ? 'White' : 'Black'} wins by capturing the King`;
  } else {
    const inCheck = isInCheck(nextTurn, newPieces, newSlots);
    const noMoves = !hasAnyLegalMove(
      nextTurn,
      newPieces,
      newSlots,
      newEnPassantTarget
    );
    if (noMoves) {
      isOver = true;
      result = inCheck
        ? `${turn === 'w' ? 'White' : 'Black'} wins by checkmate`
        : 'Draw by stalemate';
    }
  }

  const nextState: TriDGameState = {
    pieces: newPieces,
    slots: newSlots,
    turn: nextTurn,
    moveHistory: [...state.moveHistory, move],
    isOver,
    result,
    enPassantTarget: newEnPassantTarget,
    snapshots: [
      ...state.snapshots,
      { pieces: { ...newPieces }, slots: { ...newSlots } }
    ]
  };

  return { nextState, move };
}

// ---------------------------------------------------------------------------
// Apply an attack board move
// ---------------------------------------------------------------------------

export function applyBoardMove(
  state: TriDGameState,
  boardId: AttackBoardId,
  toSlot: AttackBoardSlot,
  arrivalChoice: 'identity' | 'rot180' = 'identity'
): { nextState: TriDGameState; move: TriDMove } | null {
  const { pieces, slots, turn } = state;

  const legalSlots = legalAttackBoardMoves(boardId, turn, pieces, slots);
  if (!legalSlots.includes(toSlot)) return null;

  const fromSlot = slots[boardId];
  const san = buildBoardSan(boardId, toSlot);
  const move: TriDMove = { type: 'board', boardId, fromSlot, toSlot, san };

  const newSlots: AttackBoardSlots = { ...slots, [boardId]: toSlot };
  const nextTurn: Color = turn === 'w' ? 'b' : 'w';

  // Collect all pieces on the moving board before mutation
  const size = BOARD_SIZES[boardId];
  const newPieces = { ...pieces };
  const boardPieces: Array<{ r: number; c: number; p: TriDPiece }> = [];
  for (let r = 0; r < size.rows; r++) {
    for (let c = 0; c < size.cols; c++) {
      const key = squareKey({ boardId, row: r, col: c });
      const p = newPieces[key];
      if (p) boardPieces.push({ r, c, p });
    }
  }

  // Remove pieces from their current positions
  for (const { r, c } of boardPieces) {
    delete newPieces[squareKey({ boardId, row: r, col: c })];
  }

  // Replace pieces at arrival positions (identity or rot180).
  // Transported pawns and all pieces gain hasMoved=true per Meder transport rules.
  for (const { r, c, p } of boardPieces) {
    const destR = arrivalChoice === 'rot180' ? size.rows - 1 - r : r;
    const destC = arrivalChoice === 'rot180' ? size.cols - 1 - c : c;
    const destKey = squareKey({ boardId, row: destR, col: destC });
    newPieces[destKey] =
      p.type === 'p'
        ? { ...p, hasMoved: true, movedByBoard: true }
        : { ...p, hasMoved: true };
  }

  // An attack board move clears the en-passant right (Article 9.2 analogy)
  const newEnPassantTarget = null;

  const inCheck = isInCheck(nextTurn, newPieces, newSlots);
  const noMoves = !hasAnyLegalMove(
    nextTurn,
    newPieces,
    newSlots,
    newEnPassantTarget
  );
  const isOver = noMoves;
  const result = noMoves
    ? inCheck
      ? `${turn === 'w' ? 'White' : 'Black'} wins by checkmate`
      : 'Draw by stalemate'
    : null;

  const nextState: TriDGameState = {
    pieces: newPieces,
    slots: newSlots,
    turn: nextTurn,
    moveHistory: [...state.moveHistory, move],
    isOver,
    result,
    enPassantTarget: newEnPassantTarget,
    snapshots: [
      ...state.snapshots,
      { pieces: { ...newPieces }, slots: { ...newSlots } }
    ]
  };

  return { nextState, move };
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

export function getLegalMoves(
  sq: TriDSquare,
  state: TriDGameState
): TriDSquare[] {
  const piece = state.pieces[squareKey(sq)];
  if (!piece || piece.color !== state.turn) return [];
  return legalMovesForSquare(
    sq,
    state.pieces,
    state.slots,
    state.enPassantTarget
  );
}

export function getLegalBoardMoves(
  boardId: AttackBoardId,
  state: TriDGameState
): AttackBoardSlot[] {
  return legalAttackBoardMoves(boardId, state.turn, state.pieces, state.slots);
}

export function getCurrentCheck(state: TriDGameState): boolean {
  return isInCheck(state.turn, state.pieces, state.slots);
}

export function getKingSquare(
  color: Color,
  pieces: PieceMap
): TriDSquare | null {
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

export function requiresPromotion(
  from: TriDSquare,
  to: TriDSquare,
  state: TriDGameState
): boolean {
  const piece = state.pieces[squareKey(from)];
  if (!piece) return false;
  return isPawnPromotion(from, to, piece, state.slots);
}

export { squareToGlobal };
