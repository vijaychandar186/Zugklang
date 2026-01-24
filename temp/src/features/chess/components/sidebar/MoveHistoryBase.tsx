'use client';

import { memo, useCallback, ReactNode } from 'react';

export type MoveData = {
  san: string;
  classification?: string;
};

export type MoveHistoryBaseProps<T> = {
  items: T[];
  viewingIndex: number;
  onMoveClick: (index: number) => void;
  getWhiteMove: (item: T, index: number) => MoveData | null;
  getBlackMove: (items: T[], whiteIndex: number) => MoveData | null;
  renderMoveContent?: (move: MoveData, isWhite: boolean) => ReactNode;
  emptyMessage?: string;
  skipFirst?: boolean;
};

type MoveButtonProps = {
  move: MoveData;
  index: number;
  isActive: boolean;
  isWhite: boolean;
  onClick: (index: number) => void;
  renderContent?: (move: MoveData, isWhite: boolean) => ReactNode;
};

const MoveButton = memo(function MoveButton({
  move,
  index,
  isActive,
  isWhite,
  onClick,
  renderContent
}: MoveButtonProps) {
  const handleClick = useCallback(() => onClick(index), [onClick, index]);

  return (
    <button
      onClick={handleClick}
      className={`hover:bg-muted flex cursor-pointer items-center gap-1 rounded px-1 text-left font-mono ${isWhite ? '-ml-1 w-auto min-w-16' : ''}`}
      style={{
        color: isWhite ? 'var(--move-white)' : 'var(--move-black)',
        backgroundColor: isActive
          ? isWhite
            ? 'var(--move-white-active)'
            : 'var(--move-black-active)'
          : undefined
      }}
    >
      {renderContent ? renderContent(move, isWhite) : <span>{move.san}</span>}
    </button>
  );
});

type MoveRowProps = {
  moveNumber: number;
  whiteMove: MoveData | null;
  blackMove: MoveData | null;
  whiteMoveIndex: number;
  viewingIndex: number;
  onMoveClick: (index: number) => void;
  renderContent?: (move: MoveData, isWhite: boolean) => ReactNode;
};

const MoveRow = memo(function MoveRow({
  moveNumber,
  whiteMove,
  blackMove,
  whiteMoveIndex,
  viewingIndex,
  onMoveClick,
  renderContent
}: MoveRowProps) {
  return (
    <li className='flex items-center text-sm'>
      <span className='text-muted-foreground w-6'>{moveNumber}.</span>
      {whiteMove && (
        <MoveButton
          move={whiteMove}
          index={whiteMoveIndex}
          isActive={viewingIndex === whiteMoveIndex + 1}
          isWhite={true}
          onClick={onMoveClick}
          renderContent={renderContent}
        />
      )}
      {blackMove && (
        <MoveButton
          move={blackMove}
          index={whiteMoveIndex + 1}
          isActive={viewingIndex === whiteMoveIndex + 2}
          isWhite={false}
          onClick={onMoveClick}
          renderContent={renderContent}
        />
      )}
    </li>
  );
});

function MoveHistoryBaseComponent<T>({
  items,
  viewingIndex,
  onMoveClick,
  getWhiteMove,
  getBlackMove,
  renderMoveContent,
  emptyMessage = 'No moves yet',
  skipFirst = false
}: MoveHistoryBaseProps<T>) {
  const processedItems = skipFirst ? items.slice(1) : items;

  if (processedItems.length === 0) {
    return (
      <p className='text-muted-foreground py-4 text-center text-sm'>
        {emptyMessage}
      </p>
    );
  }

  const movePairs: { moveNumber: number; whiteMoveIndex: number }[] = [];
  for (let i = 0; i < processedItems.length; i += 2) {
    movePairs.push({ moveNumber: i / 2 + 1, whiteMoveIndex: i });
  }

  return (
    <ol className='space-y-1'>
      {movePairs.map(({ moveNumber, whiteMoveIndex }) => {
        const whiteMove = getWhiteMove(
          processedItems[whiteMoveIndex],
          whiteMoveIndex
        );
        const blackMove = getBlackMove(processedItems, whiteMoveIndex);

        return (
          <MoveRow
            key={moveNumber}
            moveNumber={moveNumber}
            whiteMove={whiteMove}
            blackMove={blackMove}
            whiteMoveIndex={whiteMoveIndex}
            viewingIndex={viewingIndex}
            onMoveClick={onMoveClick}
            renderContent={renderMoveContent}
          />
        );
      })}
    </ol>
  );
}

export const MoveHistoryBase = memo(
  MoveHistoryBaseComponent
) as typeof MoveHistoryBaseComponent;
