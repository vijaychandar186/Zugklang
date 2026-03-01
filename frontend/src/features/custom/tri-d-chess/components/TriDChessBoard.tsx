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
import { getPieceAssetPath } from '@/features/chess/config/media-themes';
const DEFAULT_SQ = 36;
function isDark(row: number, col: number): boolean {
  return (row + col) % 2 === 1;
}
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
      src={getPieceAssetPath(pieceTheme, fileName)}
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
  const displayRow = flipped ? BOARD_SIZES[boardId].rows - 1 - row : row;
  const displayCol = flipped ? BOARD_SIZES[boardId].cols - 1 - col : col;
  const dark = isDark(displayRow, displayCol);
  let highlightStyle: React.CSSProperties | undefined;
  if (isSelected) highlightStyle = { backgroundColor: 'var(--trid-selected)' };
  else if (isHighlighted && piece)
    highlightStyle = { backgroundColor: 'var(--trid-legal-piece)' };
  else if (isHighlighted)
    highlightStyle = {
      backgroundColor: dark
        ? 'var(--trid-legal-dark)'
        : 'var(--trid-legal-light)'
    };
  else if (isInCheck && piece?.type === 'k')
    highlightStyle = { backgroundColor: 'var(--trid-check)' };
  return (
    <div
      key={key}
      className='relative flex cursor-pointer items-center justify-center'
      style={{
        width: squareSize,
        height: squareSize,
        ...(highlightStyle
          ? {}
          : dark
            ? boardTheme.darkSquareStyle
            : boardTheme.lightSquareStyle),
        ...highlightStyle
      }}
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
  const ringStyle: React.CSSProperties = isSelectedBoard
    ? {
        outline: '2px solid var(--trid-board-selected-ring)',
        outlineOffset: '0px'
      }
    : canMoveBoard
      ? {
          outline: '2px solid var(--trid-board-movable-ring)',
          outlineOffset: '0px',
          cursor: 'pointer'
        }
      : {};
  return (
    <div className='flex flex-col items-center gap-0.5'>
      <span
        className={`text-[10px] font-semibold tracking-widest uppercase ${isAttackBoard ? 'text-muted-foreground' : 'text-foreground'}`}
      >
        {label}
      </span>
      <div
        className='border-border/40 relative inline-block border'
        style={ringStyle}
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
      className='flex cursor-pointer items-center justify-center rounded border-2 border-dashed text-[9px] font-bold transition-colors'
      style={{
        width: 2 * squareSize,
        height: 2 * squareSize,
        borderColor: 'var(--trid-slot-target)',
        backgroundColor:
          'color-mix(in oklch, var(--trid-slot-target) 20%, transparent)',
        color: 'var(--trid-slot-target)'
      }}
      onClick={() => onDrop(boardId, slot)}
    >
      ↓
    </div>
  );
}
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
const FIXED_BOARDS: Array<{
  id: BoardId;
  label: string;
}> = [
  { id: 'bh', label: 'Black Home' },
  { id: 'n', label: 'Neutral Zone' },
  { id: 'wh', label: 'White Home' }
];
const ATTACK_BOARD_INFO: Record<
  AttackBoardId,
  {
    label: string;
  }
> = {
  wa1: { label: 'WA1' },
  wa2: { label: 'WA2' },
  ba1: { label: 'BA1' },
  ba2: { label: 'BA2' }
};
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
  const renderSideColumn = useCallback(
    (side: 'left' | 'right', allSlots: AttackBoardSlot[]) => {
      const topSlots = allSlots.slice(0, 2);
      const bottomSlots = allSlots.slice(2);
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
      {renderSideColumn('left', leftSlots)}

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

      {renderSideColumn('right', rightSlots)}
    </div>
  );
}
