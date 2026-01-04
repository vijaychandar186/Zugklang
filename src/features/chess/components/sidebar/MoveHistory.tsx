'use client';

import { memo, useCallback } from 'react';

type MoveHistoryProps = {
  moves: string[];
  viewingIndex: number;
  onMoveClick: (index: number) => void;
};

type MoveButtonProps = {
  move: string;
  index: number;
  isActive: boolean;
  isWhite: boolean;
  onClick: (index: number) => void;
};

const MoveButton = memo(function MoveButton({
  move,
  index,
  isActive,
  isWhite,
  onClick
}: MoveButtonProps) {
  const handleClick = useCallback(() => onClick(index), [onClick, index]);

  return (
    <button
      onClick={handleClick}
      className={`hover:bg-muted cursor-pointer rounded px-1 text-left font-mono ${isWhite ? '-ml-1 w-16' : ''}`}
      style={{
        color: isWhite ? 'var(--move-white)' : 'var(--move-black)',
        backgroundColor: isActive
          ? isWhite
            ? 'var(--move-white-active)'
            : 'var(--move-black-active)'
          : undefined
      }}
    >
      {move}
    </button>
  );
});

type MoveRowProps = {
  moveNumber: number;
  whiteMove: string;
  blackMove?: string;
  whiteMoveIndex: number;
  viewingIndex: number;
  onMoveClick: (index: number) => void;
};

const MoveRow = memo(function MoveRow({
  moveNumber,
  whiteMove,
  blackMove,
  whiteMoveIndex,
  viewingIndex,
  onMoveClick
}: MoveRowProps) {
  return (
    <li className='flex items-center text-sm'>
      <span className='text-muted-foreground w-6'>{moveNumber}.</span>
      <MoveButton
        move={whiteMove}
        index={whiteMoveIndex}
        isActive={viewingIndex === whiteMoveIndex + 1}
        isWhite={true}
        onClick={onMoveClick}
      />
      {blackMove && (
        <MoveButton
          move={blackMove}
          index={whiteMoveIndex + 1}
          isActive={viewingIndex === whiteMoveIndex + 2}
          isWhite={false}
          onClick={onMoveClick}
        />
      )}
    </li>
  );
});

export const MoveHistory = memo(function MoveHistory({
  moves,
  viewingIndex,
  onMoveClick
}: MoveHistoryProps) {
  if (moves.length === 0) {
    return (
      <p className='text-muted-foreground py-4 text-center text-sm'>
        No moves yet
      </p>
    );
  }

  const movePairs: { moveNumber: number; whiteMoveIndex: number }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({ moveNumber: i / 2 + 1, whiteMoveIndex: i });
  }

  return (
    <ol className='space-y-1'>
      {movePairs.map(({ moveNumber, whiteMoveIndex }) => (
        <MoveRow
          key={moveNumber}
          moveNumber={moveNumber}
          whiteMove={moves[whiteMoveIndex]}
          blackMove={moves[whiteMoveIndex + 1]}
          whiteMoveIndex={whiteMoveIndex}
          viewingIndex={viewingIndex}
          onMoveClick={onMoveClick}
        />
      ))}
    </ol>
  );
});
