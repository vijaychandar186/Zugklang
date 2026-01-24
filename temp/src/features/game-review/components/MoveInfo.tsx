'use client';

import Image from 'next/image';
import { useGameReviewStore } from '../stores/useGameReviewStore';
import { CLASSIFICATION_ICONS, CLASSIFICATION_LABELS } from '../types';

export function MoveInfo() {
  const { report, currentMoveIndex } = useGameReviewStore();

  if (!report || currentMoveIndex === 0) {
    return null;
  }

  const position = report.positions[currentMoveIndex];
  const lastPosition = report.positions[currentMoveIndex - 1];

  if (!position || !lastPosition) {
    return null;
  }

  const classification = position.classification;
  const playedMove = position.move?.san;
  const bestMoveLine = lastPosition.topLines?.[0];
  const bestMove =
    bestMoveLine?.moveSAN ||
    (bestMoveLine?.moveUCI && bestMoveLine.moveUCI.length >= 4
      ? bestMoveLine.moveUCI
      : null);

  if (!classification || !playedMove) {
    return null;
  }

  const showBestMove =
    classification !== 'best' &&
    classification !== 'book' &&
    classification !== 'forced' &&
    classification !== 'brilliant' &&
    classification !== 'great' &&
    bestMove;

  const classificationIcon = CLASSIFICATION_ICONS[classification];
  const classificationLabel = CLASSIFICATION_LABELS[classification];

  return (
    <div className='flex flex-col gap-2 py-2'>
      {/* Played move classification */}
      <div className='flex items-center gap-2'>
        {classificationIcon && (
          <Image
            src={classificationIcon}
            alt={classification}
            width={18}
            height={18}
            className='shrink-0'
          />
        )}
        <span className='text-sm'>
          <span className='font-semibold'>{playedMove}</span>
          <span className='text-muted-foreground'>
            {' '}
            is {classificationLabel}
          </span>
        </span>
      </div>

      {/* Best move suggestion */}
      {showBestMove && (
        <div className='flex items-center gap-2'>
          <Image
            src={CLASSIFICATION_ICONS.best}
            alt='best'
            width={18}
            height={18}
            className='shrink-0'
          />
          <span className='text-sm'>
            <span className='font-semibold'>{bestMove}</span>
            <span className='text-muted-foreground'> was the best move</span>
          </span>
        </div>
      )}
    </div>
  );
}
