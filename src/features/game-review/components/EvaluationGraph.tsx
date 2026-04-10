'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import type { Position, LiveEvaluation } from '@/features/game-review/types';
import {
  CLASSIFICATION_COLORS,
  CLASSIFICATION_ICONS
} from '@/features/game-review/types';

const clamp = (v: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, v));

const getControlPoint = (
  current: number[],
  prev: number[] | undefined,
  next: number[] | undefined,
  reverse = false
) => {
  const smoothing = 0.15;
  const p = prev ?? current;
  const n = next ?? current;

  return [
    current[0] + (n[0] - p[0]) * smoothing * (reverse ? -1 : 1),
    current[1] + (n[1] - p[1]) * smoothing * (reverse ? -1 : 1)
  ];
};

const getSmoothPath = (points: number[][]) => {
  if (!points.length) return '';

  let d = `M ${points[0][0]},${points[0][1]}`;

  for (let i = 0; i < points.length - 1; i++) {
    const cp1 = getControlPoint(points[i], points[i - 1], points[i + 1]);
    const cp2 = getControlPoint(points[i + 1], points[i], points[i + 2], true);

    d += ` C ${cp1[0]},${cp1[1]} ${cp2[0]},${cp2[1]} ${points[i + 1][0]},${points[i + 1][1]}`;
  }

  return d;
};

export function EvaluationGraph({
  positions,
  liveEvaluations,
  currentMoveIndex,
  onMoveClick
}: {
  positions?: Position[];
  liveEvaluations?: (LiveEvaluation | null)[];
  currentMoveIndex: number;
  onMoveClick?: (index: number) => void;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const totalMoves = positions?.length || liveEvaluations?.length || 0;

  const graph = useMemo(() => {
    const source = positions || liveEvaluations || [];
    if (!source.length) return { points: [], d: '', fill: '' };

    const points: number[][] = [];

    source.forEach((item, i) => {
      const evaluation = positions
        ? (item as Position).topLines?.[0]?.evaluation
        : (item as LiveEvaluation | null);

      const x = (i / Math.max(source.length - 1, 1)) * 100;
      let y = 50;

      if (evaluation?.type === 'cp') {
        const val = Math.max(-600, Math.min(600, evaluation.value));
        y = 50 - (val / 600) * 50;
      } else if (evaluation?.type === 'mate') {
        y = evaluation.value > 0 ? 0 : 100;
      }

      points.push([x, clamp(y)]);
    });

    const d = getSmoothPath(points);
    const fill = `${d} L 100 100 L 0 100 Z`;

    return { points, d, fill };
  }, [positions, liveEvaluations]);

  if (!totalMoves) return null;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const index = Math.floor((x / rect.width) * totalMoves);
    setHoverIndex(Math.max(0, Math.min(index, totalMoves - 1)));
  };

  const hovered = hoverIndex !== null && positions?.[hoverIndex];

  return (
    <Card
      ref={ref}
      className='relative h-24 w-full cursor-crosshair overflow-hidden'
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIndex(null)}
      onClick={() => hoverIndex !== null && onMoveClick?.(hoverIndex)}
    >
      <div className='absolute inset-0 grid grid-rows-2'>
        <div className='bg-muted' />
        <div className='bg-background' />
      </div>

      <svg
        className='absolute inset-0 h-full w-full'
        viewBox='-2 -2 104 104'
        preserveAspectRatio='none'
      >
        <line
          x1='0'
          y1='50'
          x2='100'
          y2='50'
          className='stroke-muted-foreground'
          strokeDasharray='2 2'
          vectorEffect='non-scaling-stroke'
        />

        <path
          d={graph.fill}
          className='fill-background/70'
          vectorEffect='non-scaling-stroke'
        />

        <path
          d={graph.d}
          fill='none'
          className='stroke-foreground'
          strokeWidth='1'
          vectorEffect='non-scaling-stroke'
        />

        <line
          x1={(currentMoveIndex / Math.max(totalMoves - 1, 1)) * 100}
          y1='0'
          x2={(currentMoveIndex / Math.max(totalMoves - 1, 1)) * 100}
          y2='100'
          className='stroke-primary'
          strokeWidth='2'
          vectorEffect='non-scaling-stroke'
        />

        {hoverIndex !== null && graph.points[hoverIndex] && (
          <>
            <line
              x1={(hoverIndex / Math.max(totalMoves - 1, 1)) * 100}
              y1='0'
              x2={(hoverIndex / Math.max(totalMoves - 1, 1)) * 100}
              y2='100'
              className='stroke-ring'
              strokeDasharray='4 4'
              vectorEffect='non-scaling-stroke'
            />
            <circle
              cx={graph.points[hoverIndex][0]}
              cy={graph.points[hoverIndex][1]}
              r='3'
              className='fill-card stroke-border'
              vectorEffect='non-scaling-stroke'
            />
          </>
        )}
      </svg>

      {hovered && (
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger asChild>
              <div className='absolute inset-0' />
            </TooltipTrigger>

            <TooltipContent
              className='flex items-center gap-2 border text-xs'
              style={{
                borderColor: CLASSIFICATION_COLORS[hovered.classification!]
              }}
            >
              {hovered.classification && (
                <Image
                  src={CLASSIFICATION_ICONS[hovered.classification]}
                  alt=''
                  width={16}
                  height={16}
                />
              )}
              <div>
                <div className='font-medium'>
                  {hovered.topLines?.[0]?.evaluation?.type === 'mate'
                    ? `M${Math.abs(hovered.topLines[0].evaluation.value)}`
                    : (
                        (hovered.topLines?.[0]?.evaluation?.value ?? 0) / 100
                      ).toFixed(2)}
                </div>
                <div className='font-bold'>{hovered.move?.san}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Card>
  );
}
