'use client';
import React, { useCallback } from 'react';
import Image from 'next/image';
import {
  type BoardId,
  type AttackBoardId,
  type AttackBoardSlot,
  type TriDSquare,
  type PieceMap,
  type AttackBoardSlots,
  squareKey,
  BOARD_SIZES
} from '../engine/types';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const DEFAULT_SQ = 36; // default square size in px
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isDark(row: number, col: number): boolean {
  return (row + col) % 2 === 1;
}

// ---------------------------------------------------------------------------
// Piece image
// ---------------------------------------------------------------------------

interface PieceImageProps {
  type: string;
  color: 'w' | 'b';
  pieceTheme: string;
  size: number;
}

function PieceImage({ type, color, pieceTheme, size }: PieceImageProps) {
  const fileName = `${color}${type}`;
  return (
    <Image
      src={`/theme/pieces/${pieceTheme}/${fileName}.png`}
      alt={`${color}${type}`}
      width={size}
      height={size}
      unoptimized
      draggable={false}
      className='pointer-events-none object-contain select-none'
      style={{ width: size, height: size }}
    />
  );
}

// ---------------------------------------------------------------------------
// Single square
// ---------------------------------------------------------------------------

interface SquareProps {
  boardId: BoardId;
  row: number;
  col: number;
  pieces: PieceMap;
  squareSize: number;
  pieceTheme: string;
  boardTheme: {
    darkSquareStyle: React.CSSProperties;
    lightSquareStyle: React.CSSProperties;
  };
  isSelected: boolean;
  isHighlighted: boolean;
  isInCheck: boolean;
  onClick: (sq: TriDSquare) => void;
  flipped: boolean;
}

function SquareCell({
  boardId,
  row,
  col,
  pieces,
  squareSize,
  pieceTheme,
  boardTheme,
  isSelected,
  isHighlighted,
  isInCheck,
  onClick,
  flipped
}: SquareProps) {
  const sq: TriDSquare = { boardId, row, col };
  const key = squareKey(sq);
  const piece = pieces[key];

  // Display row/col (flipped view)
  const displayRow = flipped ? BOARD_SIZES[boardId].rows - 1 - row : row;
  const displayCol = flipped ? BOARD_SIZES[boardId].cols - 1 - col : col;

  const dark = isDark(displayRow, displayCol);

  // Use overlay Tailwind class for highlights; fall back to themed CSS vars
  const isOverlay =
    isSelected || isHighlighted || (isInCheck && piece?.type === 'k');
  const baseStyle: React.CSSProperties = isOverlay
    ? {}
    : dark
      ? boardTheme.darkSquareStyle
      : boardTheme.lightSquareStyle;

  let bgClass = '';
  if (isSelected) bgClass = 'bg-yellow-400';
  else if (isHighlighted && piece) bgClass = 'bg-orange-400';
  else if (isHighlighted) bgClass = dark ? 'bg-[#cdd16f]' : 'bg-[#aaa23a]';
  else if (isInCheck && piece?.type === 'k') bgClass = 'bg-red-500';

  return (
    <div
      key={key}
      className={`${bgClass} relative flex cursor-pointer items-center justify-center`}
      style={{ width: squareSize, height: squareSize, ...baseStyle }}
      onClick={() => onClick(sq)}
    >
      {piece && (
        <PieceImage
          type={piece.type}
          color={piece.color}
          pieceTheme={pieceTheme}
          size={squareSize - 4}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single board renderer
// ---------------------------------------------------------------------------

interface BoardGridProps {
  boardId: BoardId;
  label: string;
  pieces: PieceMap;
  squareSize: number;
  pieceTheme: string;
  boardTheme: {
    darkSquareStyle: React.CSSProperties;
    lightSquareStyle: React.CSSProperties;
  };
  selectedKey: string | null;
  highlightedKeys: Set<string>;
  inCheckColor: 'w' | 'b' | null;
  onClick: (sq: TriDSquare) => void;
  flipped: boolean;
  isAttackBoard?: boolean;
  isSelectedBoard?: boolean;
  canMoveBoard?: boolean;
  onBoardClick?: () => void;
}

function BoardGrid({
  boardId,
  label,
  pieces,
  squareSize,
  pieceTheme,
  boardTheme,
  selectedKey,
  highlightedKeys,
  inCheckColor,
  onClick,
  flipped,
  isAttackBoard,
  isSelectedBoard,
  canMoveBoard,
  onBoardClick
}: BoardGridProps) {
  const size = BOARD_SIZES[boardId];
  const rows = Array.from({ length: size.rows }, (_, i) =>
    flipped ? i : size.rows - 1 - i
  );
  const cols = Array.from({ length: size.cols }, (_, i) =>
    flipped ? size.cols - 1 - i : i
  );

  const ringClass = isSelectedBoard
    ? 'ring-2 ring-yellow-400'
    : canMoveBoard
      ? 'ring-2 ring-blue-400 ring-opacity-60 cursor-pointer'
      : '';

  return (
    <div className='flex flex-col items-center gap-0.5'>
      <span
        className={`text-[10px] font-semibold tracking-widest uppercase ${isAttackBoard ? 'text-muted-foreground' : 'text-foreground'}`}
      >
        {label}
      </span>
      <div
        className={`border-border/40 relative inline-block border ${ringClass}`}
        onClick={canMoveBoard && onBoardClick ? onBoardClick : undefined}
      >
        {rows.map((row) => (
          <div key={row} className='flex'>
            {cols.map((col) => {
              const sq: TriDSquare = { boardId, row, col };
              const k = squareKey(sq);
              const p = pieces[k];
              const isKing = p?.type === 'k' && p.color === inCheckColor;
              return (
                <SquareCell
                  key={k}
                  boardId={boardId}
                  row={row}
                  col={col}
                  pieces={pieces}
                  squareSize={squareSize}
                  pieceTheme={pieceTheme}
                  boardTheme={boardTheme}
                  isSelected={selectedKey === k}
                  isHighlighted={highlightedKeys.has(k)}
                  isInCheck={isKing}
                  onClick={onClick}
                  flipped={flipped}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Attack board slot indicator (for valid destination slots)
// ---------------------------------------------------------------------------

interface SlotDropzoneProps {
  boardId: AttackBoardId;
  slot: AttackBoardSlot;
  isTarget: boolean;
  squareSize: number;
  onDrop: (boardId: AttackBoardId, slot: AttackBoardSlot) => void;
}

function SlotDropzone({
  boardId,
  slot,
  isTarget,
  squareSize,
  onDrop
}: SlotDropzoneProps) {
  if (!isTarget) return null;
  return (
    <div
      className='flex cursor-pointer items-center justify-center rounded border-2 border-dashed border-blue-400 bg-blue-400/20 text-[9px] font-bold text-blue-400 transition-colors hover:bg-blue-400/30'
      style={{ width: 2 * squareSize, height: 2 * squareSize }}
      onClick={() => onDrop(boardId, slot)}
    >
      ↓
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main board component
// ---------------------------------------------------------------------------

interface TriDChessBoardProps {
  pieces: PieceMap;
  slots: AttackBoardSlots;
  selectedSquare: TriDSquare | null;
  selectedBoardId: AttackBoardId | null;
  highlightedSquares: Set<string>;
  highlightedSlots: Set<AttackBoardSlot>;
  inCheck: boolean;
  turn: 'w' | 'b';
  flipped: boolean;
  onSquareClick: (sq: TriDSquare) => void;
  onAttackBoardClick: (boardId: AttackBoardId) => void;
  onSlotClick: (boardId: AttackBoardId, slot: AttackBoardSlot) => void;
  isActive: boolean;
  squareSize?: number;
  pieceTheme?: string;
}

const FIXED_BOARDS: Array<{ id: BoardId; label: string }> = [
  { id: 'bh', label: 'Black Home' },
  { id: 'n', label: 'Neutral Zone' },
  { id: 'wh', label: 'White Home' }
];

const ATTACK_BOARD_INFO: Record<AttackBoardId, { label: string }> = {
  wa1: { label: 'WA1' },
  wa2: { label: 'WA2' },
  ba1: { label: 'BA1' },
  ba2: { label: 'BA2' }
};

// Which attack boards are on which side
const LEFT_BOARDS: AttackBoardId[] = ['wa1', 'ba1'];
const RIGHT_BOARDS: AttackBoardId[] = ['wa2', 'ba2'];

const ALL_SLOTS_LEFT: AttackBoardSlot[] = [
  'left_high',
  'left_mid_high',
  'left_mid_low',
  'left_low'
];
const ALL_SLOTS_RIGHT: AttackBoardSlot[] = [
  'right_high',
  'right_mid_high',
  'right_mid_low',
  'right_low'
];

function getBoardAtSlot(
  side: 'left' | 'right',
  slot: AttackBoardSlot,
  slots: AttackBoardSlots
): AttackBoardId | null {
  const boards = side === 'left' ? LEFT_BOARDS : RIGHT_BOARDS;
  for (const id of boards) {
    if (slots[id] === slot) return id;
  }
  return null;
}

export function TriDChessBoard({
  pieces,
  slots,
  selectedSquare,
  selectedBoardId,
  highlightedSquares,
  highlightedSlots,
  inCheck,
  turn,
  flipped,
  onSquareClick,
  onAttackBoardClick,
  onSlotClick,
  isActive,
  squareSize = DEFAULT_SQ,
  pieceTheme = 'classic'
}: TriDChessBoardProps) {
  const sq = Math.max(28, squareSize);
  const boardTheme = useBoardTheme();
  const inCheckColor: 'w' | 'b' | null = inCheck ? turn : null;
  const selectedKey = selectedSquare ? squareKey(selectedSquare) : null;

  // When flipped, reverse both the fixed board order and the slot column order
  // so the layout genuinely reflects the black-side perspective.
  const orderedFixedBoards = flipped
    ? [...FIXED_BOARDS].reverse()
    : FIXED_BOARDS;
  const leftSlots = flipped ? [...ALL_SLOTS_LEFT].reverse() : ALL_SLOTS_LEFT;
  const rightSlots = flipped ? [...ALL_SLOTS_RIGHT].reverse() : ALL_SLOTS_RIGHT;

  const renderSlot = useCallback(
    (side: 'left' | 'right', slot: AttackBoardSlot) => {
      const boardId = getBoardAtSlot(side, slot, slots);
      const isTarget = highlightedSlots.has(slot);

      const content = boardId ? (
        (() => {
          const isSelected = selectedBoardId === boardId;
          const canMove = isActive && !isSelected && selectedKey === null;
          const info = ATTACK_BOARD_INFO[boardId];
          return (
            <BoardGrid
              boardId={boardId}
              label={info.label}
              pieces={pieces}
              squareSize={sq}
              pieceTheme={pieceTheme}
              boardTheme={boardTheme}
              selectedKey={selectedKey}
              highlightedKeys={highlightedSquares}
              inCheckColor={inCheckColor}
              onClick={onSquareClick}
              flipped={flipped}
              isAttackBoard
              isSelectedBoard={isSelected}
              canMoveBoard={canMove}
              onBoardClick={() => onAttackBoardClick(boardId)}
            />
          );
        })()
      ) : (
        <div
          style={{ width: 2 * sq + 2 }}
          className='flex flex-col items-center gap-0.5'
        >
          <span className='text-[10px] opacity-0'>—</span>
          {isTarget && selectedBoardId ? (
            <SlotDropzone
              boardId={selectedBoardId}
              slot={slot}
              isTarget={true}
              squareSize={sq}
              onDrop={onSlotClick}
            />
          ) : (
            <div style={{ width: 2 * sq + 2, height: 2 * sq + 2 }} />
          )}
        </div>
      );

      return <div key={slot}>{content}</div>;
    },
    [
      slots,
      highlightedSlots,
      selectedBoardId,
      isActive,
      pieces,
      pieceTheme,
      boardTheme,
      selectedKey,
      highlightedSquares,
      inCheckColor,
      onSquareClick,
      flipped,
      onAttackBoardClick,
      onSlotClick,
      sq
    ]
  );

  /**
   * Side column layout: top group (first 2 slots = black attack board level) is
   * anchored to the top; bottom group (last 2 slots = white attack board level)
   * is anchored to the bottom. `justify-between` + `self-stretch` ensures the
   * column fills the same height as the center column so WA boards align with WH.
   */
  const renderSideColumn = useCallback(
    (side: 'left' | 'right', allSlots: AttackBoardSlot[]) => {
      const topSlots = allSlots.slice(0, 2); // high + mid_high (black level)
      const bottomSlots = allSlots.slice(2); // mid_low + low  (white level)
      return (
        <div className='flex flex-col justify-between self-stretch'>
          <div className='flex flex-col gap-0.5'>
            {topSlots.map((slot) => renderSlot(side, slot))}
          </div>
          <div className='flex flex-col gap-0.5'>
            {bottomSlots.map((slot) => renderSlot(side, slot))}
          </div>
        </div>
      );
    },
    [renderSlot]
  );

  return (
    <div className='flex items-stretch justify-center gap-1 select-none'>
      {/* Left side: attack boards (order respects flip) */}
      {renderSideColumn('left', leftSlots)}

      {/* Center: three fixed boards (order respects flip) */}
      <div className='flex flex-col gap-2'>
        {orderedFixedBoards.map(({ id, label }) => (
          <BoardGrid
            key={id}
            boardId={id}
            label={label}
            pieces={pieces}
            squareSize={sq}
            pieceTheme={pieceTheme}
            boardTheme={boardTheme}
            selectedKey={selectedKey}
            highlightedKeys={highlightedSquares}
            inCheckColor={inCheckColor}
            onClick={onSquareClick}
            flipped={flipped}
          />
        ))}
      </div>

      {/* Right side: attack boards (order respects flip) */}
      {renderSideColumn('right', rightSlots)}
    </div>
  );
}
