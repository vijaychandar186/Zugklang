'use client';
import { useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
  GameReport,
  Position,
  Classification
} from '@/features/game-review/types';
import {
  CLASSIFICATION_COLORS,
  CLASSIFICATION_ICONS
} from '@/features/game-review/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
type ReviewReportProps = {
  report: GameReport;
  currentPosition?: Position;
  currentMoveIndex: number;
};
const CLASSIFICATION_LABELS: {
  key: Classification;
  label: string;
}[] = [
  { key: 'brilliant', label: 'Brilliant' },
  { key: 'great', label: 'Great' },
  { key: 'best', label: 'Best' },
  { key: 'excellent', label: 'Excellent' },
  { key: 'good', label: 'Good' },
  { key: 'inaccuracy', label: 'Inaccuracy' },
  { key: 'mistake', label: 'Mistake' },
  { key: 'miss', label: 'Miss' },
  { key: 'blunder', label: 'Blunder' },
  { key: 'book', label: 'Book' }
];
export function ReviewReport({
  report,
  currentPosition,
  currentMoveIndex
}: ReviewReportProps) {
  const classification = currentPosition?.classification;
  const previousPosition =
    currentMoveIndex > 0 ? report.positions[currentMoveIndex - 1] : undefined;
  const bestMoveLine = previousPosition?.topLines?.find((l) => l.id === 1);
  const classificationCounts = useMemo(() => {
    const counts: Record<
      Classification,
      {
        white: number;
        black: number;
      }
    > = {
      brilliant: { white: 0, black: 0 },
      great: { white: 0, black: 0 },
      best: { white: 0, black: 0 },
      excellent: { white: 0, black: 0 },
      good: { white: 0, black: 0 },
      inaccuracy: { white: 0, black: 0 },
      mistake: { white: 0, black: 0 },
      miss: { white: 0, black: 0 },
      blunder: { white: 0, black: 0 },
      book: { white: 0, black: 0 },
      forced: { white: 0, black: 0 }
    };
    for (let i = 1; i < report.positions.length; i++) {
      const key = report.positions[i].classification;
      if (!key || !counts[key]) continue;
      if (i % 2 === 1) {
        counts[key].white += 1;
      } else {
        counts[key].black += 1;
      }
    }
    return counts;
  }, [report.positions]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accuracies</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-around'>
          <div className='text-center'>
            <div className='text-3xl font-bold'>
              {report.accuracies.white != null
                ? `${report.accuracies.white.toFixed(1)}%`
                : '-'}
            </div>
            <div className='text-muted-foreground text-sm'>White</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold'>
              {report.accuracies.black != null
                ? `${report.accuracies.black.toFixed(1)}%`
                : '-'}
            </div>
            <div className='text-muted-foreground text-sm'>Black</div>
          </div>
        </div>

        {report.estimatedElo && (
          <div className='border-t pt-3'>
            <div className='text-muted-foreground mb-2 text-center text-xs uppercase'>
              Game Rating
            </div>
            <div className='flex justify-around'>
              <div className='text-center'>
                <div className='text-2xl font-bold'>
                  {report.estimatedElo.white}
                </div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold'>
                  {report.estimatedElo.black}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='border-t pt-3'>
          <Table>
            <TableHeader>
              <TableRow className='text-muted-foreground'>
                <TableHead className='py-1 font-normal'></TableHead>
                <TableHead className='py-1 text-center font-normal'>
                  White
                </TableHead>
                <TableHead className='w-8 py-1 text-center font-normal'></TableHead>
                <TableHead className='py-1 text-center font-normal'>
                  Black
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CLASSIFICATION_LABELS.map(({ key, label }) => {
                const whiteCount = classificationCounts[key].white;
                const blackCount = classificationCounts[key].black;
                return (
                  <TableRow key={key}>
                    <TableCell
                      className='py-1 font-medium'
                      style={{ color: CLASSIFICATION_COLORS[key] }}
                    >
                      {label}
                    </TableCell>
                    <TableCell className='py-1 text-center'>
                      {whiteCount}
                    </TableCell>
                    <TableCell className='py-1 text-center'>
                      {CLASSIFICATION_ICONS[key] && (
                        <Image
                          src={CLASSIFICATION_ICONS[key]}
                          alt={key}
                          width={18}
                          height={18}
                          className='inline-block'
                        />
                      )}
                    </TableCell>
                    <TableCell className='py-1 text-center'>
                      {blackCount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {currentPosition && (
          <div className='space-y-3 border-t pt-3'>
            <div className='flex items-center gap-2'>
              {classification && CLASSIFICATION_ICONS[classification] && (
                <Image
                  src={CLASSIFICATION_ICONS[classification]}
                  alt={classification}
                  width={24}
                  height={24}
                />
              )}
              <span
                className='font-bold uppercase'
                style={{
                  color: classification
                    ? CLASSIFICATION_COLORS[classification]
                    : undefined
                }}
              >
                {classification || 'Base Position'}
              </span>
              {currentPosition.move?.san && (
                <span className='text-muted-foreground'>
                  {currentPosition.move.san}
                </span>
              )}
            </div>

            {bestMoveLine &&
              currentMoveIndex > 0 &&
              classification !== 'best' &&
              classification !== 'book' &&
              classification !== 'forced' &&
              classification !== 'brilliant' &&
              classification !== 'great' &&
              (bestMoveLine.moveSAN ||
                (bestMoveLine.moveUCI && bestMoveLine.moveUCI.length >= 4)) && (
                <div className='flex items-center gap-2 text-sm'>
                  <Image
                    src={CLASSIFICATION_ICONS.best}
                    alt='best'
                    width={18}
                    height={18}
                  />
                  <span className='font-mono font-semibold'>
                    {bestMoveLine.moveSAN || bestMoveLine.moveUCI}
                  </span>
                  <span className='text-muted-foreground'>
                    was the best move
                  </span>
                </div>
              )}

            {currentPosition.topLines &&
              currentPosition.topLines.length > 0 && (
                <div className='space-y-1'>
                  <div className='text-sm font-medium'>Engine Lines</div>
                  {currentPosition.topLines.map((line, i) => {
                    const moveText =
                      line.moveSAN ||
                      (line.moveUCI && line.moveUCI.length >= 4
                        ? line.moveUCI
                        : null);
                    return (
                      <div
                        key={i}
                        className='bg-muted/50 flex justify-between rounded px-2 py-1 font-mono text-sm'
                      >
                        <span>{moveText || `Line ${line.id}`}</span>
                        <span
                          className={
                            line.evaluation.value >= 0
                              ? '[color:var(--success)]'
                              : 'text-destructive'
                          }
                        >
                          {line.evaluation.type === 'mate'
                            ? `M${line.evaluation.value}`
                            : (line.evaluation.value / 100).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

            {currentPosition.opening && (
              <div className='text-muted-foreground text-sm italic'>
                {currentPosition.opening}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
