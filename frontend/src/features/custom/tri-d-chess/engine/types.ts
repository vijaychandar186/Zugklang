export type Color = 'w' | 'b';
export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type FixedBoardId = 'wh' | 'n' | 'bh';
export type AttackBoardId = 'wa1' | 'wa2' | 'ba1' | 'ba2';
export type BoardId = FixedBoardId | AttackBoardId;

/**
 * Attack board slot defines where a 2×2 attack board is positioned.
 * Left/right = which side of the main 4×4 column.
 * high/mid_high/mid_low/low = vertical band (high = BH level, low = WH level).
 */
export type AttackBoardSlot =
  | 'left_high'
  | 'left_mid_high'
  | 'left_mid_low'
  | 'left_low'
  | 'right_high'
  | 'right_mid_high'
  | 'right_mid_low'
  | 'right_low';

export interface TriDPiece {
  type: PieceType;
  color: Color;
  /** True once the piece has moved (used for pawn double-advance and castling eligibility) */
  hasMoved?: boolean;
  /** True if this pawn has ever been transported by an attack-board move. */
  movedByBoard?: boolean;
}

export interface TriDSquare {
  boardId: BoardId;
  row: number; // 0-indexed, local to board
  col: number; // 0-indexed, local to board
}

/** Flat key for a square: "boardId:row:col" */
export function squareKey(sq: TriDSquare): string {
  return `${sq.boardId}:${sq.row}:${sq.col}`;
}

export function parseSquareKey(key: string): TriDSquare {
  const [boardId, row, col] = key.split(':');
  return { boardId: boardId as BoardId, row: Number(row), col: Number(col) };
}

export type PieceMap = Record<string, TriDPiece>;

export interface AttackBoardSlots {
  wa1: AttackBoardSlot;
  wa2: AttackBoardSlot;
  ba1: AttackBoardSlot;
  ba2: AttackBoardSlot;
}

export type TriDMove =
  | {
      type: 'piece';
      from: TriDSquare;
      to: TriDSquare;
      captured?: TriDPiece;
      promotion?: PieceType;
      san: string;
    }
  | {
      type: 'board';
      boardId: AttackBoardId;
      fromSlot: AttackBoardSlot;
      toSlot: AttackBoardSlot;
      san: string;
    };

export interface GlobalPos {
  x: number;
  y: number;
}

export const BOARD_SIZES: Record<BoardId, { rows: number; cols: number }> = {
  wh: { rows: 4, cols: 4 },
  n: { rows: 4, cols: 4 },
  bh: { rows: 4, cols: 4 },
  wa1: { rows: 2, cols: 2 },
  wa2: { rows: 2, cols: 2 },
  ba1: { rows: 2, cols: 2 },
  ba2: { rows: 2, cols: 2 }
};

/** Fixed board global offsets (x = file offset, y = rank offset) */
export const FIXED_BOARD_OFFSETS: Record<FixedBoardId, GlobalPos> = {
  wh: { x: 2, y: 0 },
  n: { x: 2, y: 2 },
  bh: { x: 2, y: 4 }
};

/** Slot → global offset for attack boards */
export const SLOT_OFFSETS: Record<AttackBoardSlot, GlobalPos> = {
  left_low: { x: 0, y: 0 },
  left_mid_low: { x: 0, y: 2 },
  left_mid_high: { x: 0, y: 4 },
  left_high: { x: 0, y: 6 },
  right_low: { x: 6, y: 0 },
  right_mid_low: { x: 6, y: 2 },
  right_mid_high: { x: 6, y: 4 },
  right_high: { x: 6, y: 6 }
};

/**
 * Adjacent slots for attack board movement.
 *
 * Per official rules (Article 3.6):
 *  - A board can reach any pin within distance-2 on the same side (forward or backward)
 *  - A board can reach the same-level pin on the opposite side ("sideways")
 *  - Extreme slots (low/high) have 3 adjacent pins; middle slots have 4
 *
 * Slot levels: low=0, mid_low=1, mid_high=2, high=3
 * From level L the same-side reachable set is all levels with |diff| ≤ 2.
 * Cross-side (left↔right) at the same level is always included.
 */
export const ADJACENT_SLOTS: Record<AttackBoardSlot, AttackBoardSlot[]> = {
  // low (level 0): same-side within dist-2 → mid_low(1), mid_high(2); cross-side → right_low
  left_low: ['left_mid_low', 'left_mid_high', 'right_low'],
  // mid_low (level 1): same-side → low(0), mid_high(1→2), high(1→3); cross-side → right_mid_low
  left_mid_low: ['left_low', 'left_mid_high', 'left_high', 'right_mid_low'],
  // mid_high (level 2): same-side → low(2→0), mid_low(1), high(3); cross-side → right_mid_high
  left_mid_high: ['left_low', 'left_mid_low', 'left_high', 'right_mid_high'],
  // high (level 3): same-side within dist-2 → mid_low(2), mid_high(1); cross-side → right_high
  left_high: ['left_mid_low', 'left_mid_high', 'right_high'],

  right_low: ['right_mid_low', 'right_mid_high', 'left_low'],
  right_mid_low: ['right_low', 'right_mid_high', 'right_high', 'left_mid_low'],
  right_mid_high: ['right_low', 'right_mid_low', 'right_high', 'left_mid_high'],
  right_high: ['right_mid_low', 'right_mid_high', 'left_high']
};

export const FIXED_BOARDS: FixedBoardId[] = ['wh', 'n', 'bh'];
export const ATTACK_BOARDS: AttackBoardId[] = ['wa1', 'wa2', 'ba1', 'ba2'];
export const ALL_BOARDS: BoardId[] = [...FIXED_BOARDS, ...ATTACK_BOARDS];

export const PIECE_LABELS: Record<PieceType, string> = {
  k: 'K',
  q: 'Q',
  r: 'R',
  b: 'B',
  n: 'N',
  p: ''
};

export const BOARD_LABELS: Record<BoardId, string> = {
  wh: 'WH',
  n: 'N',
  bh: 'BH',
  wa1: 'WA1',
  wa2: 'WA2',
  ba1: 'BA1',
  ba2: 'BA2'
};
