'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';
import type { Position } from '@/features/game-review/types';
import { CLASSIFICATION_ICONS } from '@/features/game-review/types';

type ReviewMoveHistoryProps = {
  positions: Position[];
  viewingIndex: number;
  onMoveClick: (index: number) => void;
};

type MoveButtonProps = {
  move: string;
  classification?: string;
  index: number;
  isActive: boolean;
  isWhite: boolean;
  onClick: (index: number) => void;
};

const MoveButton = memo(function MoveButton({
  move,
  classification,
  index,
  isActive,
  isWhite,
  onClick
}: MoveButtonProps) {
  const handleClick = useCallback(() => onClick(index), [onClick, index]);

  return (
    <button
      onClick={handleClick}
      className={`hover:bg-muted flex cursor-pointer items-center gap-1 rounded px-1 text-left font-mono ${isWhite ? '-ml-1 w-auto' : ''}`}
      style={{
        color: isWhite ? 'var(--move-white)' : 'var(--move-black)',
        backgroundColor: isActive
          ? isWhite
            ? 'var(--move-white-active)'
            : 'var(--move-black-active)'
          : undefined
      }}
    >
      <span>{move}</span>
      {classification && CLASSIFICATION_ICONS[classification] && (
        <Image
          src={CLASSIFICATION_ICONS[classification]}
          alt={classification}
          width={14}
          height={14}
          className='inline-block flex-shrink-0'
        />
      )}
    </button>
  );
});

type MoveRowProps = {
  moveNumber: number;
  whitePosition?: Position;
  blackPosition?: Position;
  whiteMoveIndex: number;
  viewingIndex: number;
  onMoveClick: (index: number) => void;
};

const MoveRow = memo(function MoveRow({
  moveNumber,
  whitePosition,
  blackPosition,
  whiteMoveIndex,
  viewingIndex,
  onMoveClick
}: MoveRowProps) {
  return (
    <li className='flex items-center text-sm'>
      <span className='text-muted-foreground w-6'>{moveNumber}.</span>
      {whitePosition?.move && (
        <MoveButton
          move={whitePosition.move.san}
          classification={whitePosition.classification}
          index={whiteMoveIndex}
          isActive={viewingIndex === whiteMoveIndex + 1}
          isWhite={true}
          onClick={onMoveClick}
        />
      )}
      {blackPosition?.move && (
        <MoveButton
          move={blackPosition.move.san}
          classification={blackPosition.classification}
          index={whiteMoveIndex + 1}
          isActive={viewingIndex === whiteMoveIndex + 2}
          isWhite={false}
          onClick={onMoveClick}
        />
      )}
    </li>
  );
});

export const ReviewMoveHistory = memo(function ReviewMoveHistory({
  positions,
  viewingIndex,
  onMoveClick
}: ReviewMoveHistoryProps) {
  // Skip the first position (starting position has no move)
  const movePositions = positions.slice(1);

  if (movePositions.length === 0) {
    return (
      <p className='text-muted-foreground py-4 text-center text-sm'>
        No moves yet
      </p>
    );
  }

  const movePairs: { moveNumber: number; whiteMoveIndex: number }[] = [];
  for (let i = 0; i < movePositions.length; i += 2) {
    movePairs.push({ moveNumber: i / 2 + 1, whiteMoveIndex: i });
  }

  return (
    <ol className='space-y-1'>
      {movePairs.map(({ moveNumber, whiteMoveIndex }) => (
        <MoveRow
          key={moveNumber}
          moveNumber={moveNumber}
          whitePosition={movePositions[whiteMoveIndex]}
          blackPosition={movePositions[whiteMoveIndex + 1]}
          whiteMoveIndex={whiteMoveIndex}
          viewingIndex={viewingIndex}
          onMoveClick={onMoveClick}
        />
      ))}
    </ol>
  );
});
