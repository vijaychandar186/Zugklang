'use client';

import { memo, useCallback } from 'react';
import { MoveHistoryBase, MoveData } from './MoveHistoryBase';

type MoveHistoryProps = {
  moves: string[];
  viewingIndex: number;
  onMoveClick: (index: number) => void;
};

export const MoveHistory = memo(function MoveHistory({
  moves,
  viewingIndex,
  onMoveClick
}: MoveHistoryProps) {
  const getWhiteMove = useCallback(
    (move: string): MoveData => ({ san: move }),
    []
  );

  const getBlackMove = useCallback(
    (items: string[], whiteIndex: number): MoveData | null => {
      const blackMove = items[whiteIndex + 1];
      return blackMove ? { san: blackMove } : null;
    },
    []
  );

  return (
    <MoveHistoryBase
      items={moves}
      viewingIndex={viewingIndex}
      onMoveClick={onMoveClick}
      getWhiteMove={getWhiteMove}
      getBlackMove={getBlackMove}
    />
  );
});
