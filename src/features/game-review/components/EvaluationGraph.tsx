'use client';

import { useMemo } from 'react';
import type { Position, LiveEvaluation } from '@/features/game-review/types';

type EvaluationGraphProps = {
  positions?: Position[];
  liveEvaluations?: (LiveEvaluation | null)[];
  currentMoveIndex: number;
  onMoveClick?: (index: number) => void;
};

export function EvaluationGraph({
  positions,
  liveEvaluations,
  currentMoveIndex,
  onMoveClick
}: EvaluationGraphProps) {
  const graphData = useMemo(() => {
    const sourceData = positions || liveEvaluations || [];
    if (!sourceData.length) return { points: '', fillPoints: '' };

    const total = sourceData.length;
    const pointsArr: string[] = [];

    sourceData.forEach((item, i) => {
      let evalItem: { value: number; type: 'cp' | 'mate' } | null | undefined;

      if (positions) {
        const pos = item as Position;
        evalItem = pos.topLines?.find((l) => l.id === 1)?.evaluation;
      } else {
        evalItem = item as LiveEvaluation | null;
      }

      if (!evalItem) return;

      const x = (i / Math.max(total - 1, 1)) * 100;
      let y = 50;

      if (evalItem.type === 'cp') {
        y = 50 - Math.max(-45, Math.min(45, evalItem.value / 10));
      } else {
        y = evalItem.value > 0 ? 5 : evalItem.value < 0 ? 95 : 50;
      }

      pointsArr.push(`${x},${y}`);
    });

    if (pointsArr.length === 0) return { points: '', fillPoints: '' };

    const firstX = pointsArr[0].split(',')[0];
    const lastX = pointsArr[pointsArr.length - 1].split(',')[0];

    return {
      points: pointsArr.join(' '),
      fillPoints: `${firstX},100 ${pointsArr.join(' ')} ${lastX},100`
    };
  }, [positions, liveEvaluations]);

  const totalMoves = positions?.length || liveEvaluations?.length || 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onMoveClick || totalMoves === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.floor((x / rect.width) * totalMoves);
    const clampedIdx = Math.max(0, Math.min(idx, totalMoves - 1));
    onMoveClick(clampedIdx);
  };

  if (totalMoves === 0) return null;

  return (
    <div
      className='relative h-20 cursor-pointer overflow-hidden rounded-md border'
      onClick={handleClick}
    >
      {/* Background split */}
      <div className='absolute inset-0 flex flex-col'>
        <div
          className='flex-1'
          style={{ backgroundColor: 'var(--eval-black)' }}
        />
        <div
          className='flex-1'
          style={{ backgroundColor: 'var(--eval-white)' }}
        />
      </div>

      {/* SVG graph */}
      <svg
        className='absolute inset-0 h-full w-full'
        viewBox='0 0 100 100'
        preserveAspectRatio='none'
      >
        {/* Center equality line */}
        <line
          x1='0'
          y1='50'
          x2='100'
          y2='50'
          stroke='currentColor'
          strokeOpacity='0.1'
          strokeWidth='0.5'
          strokeDasharray='2 2'
          vectorEffect='non-scaling-stroke'
        />

        {/* Filled area */}
        {graphData.fillPoints && (
          <polygon
            fill='var(--eval-white)'
            fillOpacity='1'
            points={graphData.fillPoints}
          />
        )}

        {/* Line on top */}
        {graphData.points && (
          <polyline
            fill='none'
            stroke='hsl(var(--primary))'
            strokeWidth='1.5'
            vectorEffect='non-scaling-stroke'
            points={graphData.points}
          />
        )}
      </svg>

      {/* Current position indicator */}
      {positions && (
        <div
          className='pointer-events-none absolute top-0 bottom-0 w-0.5 bg-yellow-400 transition-all'
          style={{
            left: `${(currentMoveIndex / Math.max(totalMoves - 1, 1)) * 100}%`
          }}
        />
      )}
    </div>
  );
}
