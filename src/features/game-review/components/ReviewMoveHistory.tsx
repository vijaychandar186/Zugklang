'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';
import type { Position } from '@/features/game-review/types';
import { CLASSIFICATION_ICONS } from '@/features/game-review/types';
import {
  MoveHistoryBase,
  MoveData
} from '@/features/chess/components/sidebar/MoveHistoryBase';

type ReviewMoveHistoryProps = {
  positions: Position[];
  viewingIndex: number;
  onMoveClick: (index: number) => void;
};

export const ReviewMoveHistory = memo(function ReviewMoveHistory({
  positions,
  viewingIndex,
  onMoveClick
}: ReviewMoveHistoryProps) {
  const getWhiteMove = useCallback((position: Position): MoveData | null => {
    if (!position.move) return null;
    return {
      san: position.move.san,
      classification: position.classification
    };
  }, []);

  const getBlackMove = useCallback(
    (items: Position[], whiteIndex: number): MoveData | null => {
      const blackPosition = items[whiteIndex + 1];
      if (!blackPosition?.move) return null;
      return {
        san: blackPosition.move.san,
        classification: blackPosition.classification
      };
    },
    []
  );

  const renderMoveContent = useCallback(
    (move: MoveData) => (
      <>
        <span>{move.san}</span>
        {move.classification && CLASSIFICATION_ICONS[move.classification] && (
          <Image
            src={CLASSIFICATION_ICONS[move.classification]}
            alt={move.classification}
            width={14}
            height={14}
            className='inline-block flex-shrink-0'
          />
        )}
      </>
    ),
    []
  );

  return (
    <MoveHistoryBase
      items={positions}
      viewingIndex={viewingIndex}
      onMoveClick={onMoveClick}
      getWhiteMove={getWhiteMove}
      getBlackMove={getBlackMove}
      renderMoveContent={renderMoveContent}
      skipFirst={true}
    />
  );
});
