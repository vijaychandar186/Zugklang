'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';

type DepthDistributionChartProps = {
  moveDepths: (number | null)[];
  className?: string;
};

const chartConfig = {
  count: {
    label: 'Moves',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function DepthDistributionChart({
  moveDepths,
  className
}: DepthDistributionChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 20; i++) {
      counts[i] = 0;
    }

    moveDepths.forEach((depth) => {
      if (depth !== null && depth >= 1 && depth <= 20) {
        counts[depth]++;
      }
    });

    return Object.entries(counts).map(([depth, count]) => ({
      depth: Number(depth),
      count
    }));
  }, [moveDepths]);

  const engineMoves = useMemo(
    () => moveDepths.filter((d): d is number => d !== null),
    [moveDepths]
  );

  const totalMoves = engineMoves.length;

  const stats = useMemo(() => {
    if (totalMoves === 0) return { mean: '0.0', min: 0, max: 0 };

    const mean =
      engineMoves.reduce((sum, depth) => sum + depth, 0) / totalMoves;
    const min = Math.min(...engineMoves);
    const max = Math.max(...engineMoves);

    return { mean: mean.toFixed(1), min, max };
  }, [engineMoves, totalMoves]);

  if (totalMoves === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>
          Probabilistic Engine Distribution
        </CardTitle>
        <div className='text-muted-foreground flex flex-wrap gap-4 text-xs'>
          <span>
            Mean: <strong>{stats.mean}</strong>
          </span>
          <span>
            Range:{' '}
            <strong>
              {stats.min}-{stats.max}
            </strong>
          </span>
          <span>
            Total: <strong>{totalMoves}</strong> moves
          </span>
        </div>
      </CardHeader>

      <CardContent className='px-2 sm:px-6'>
        <ChartContainer config={chartConfig} className='w-full'>
          <div className='h-[180px] w-full sm:h-[200px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                margin={{ left: 10, right: 0, top: 5, bottom: 30 }}
              >
                <CartesianGrid vertical={false} strokeDasharray='3 3' />

                <XAxis
                  dataKey='depth'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval='preserveStartEnd'
                  minTickGap={12}
                  label={{
                    value: 'Stockfish Level',
                    position: 'insideBottom',
                    offset: -10,
                    style: { fontSize: 12 }
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  width={40}
                  label={{
                    value: 'Moves',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    style: { fontSize: 12, textAnchor: 'middle' }
                  }}
                />

                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `Level ${value}`}
                    />
                  }
                />

                <Bar
                  dataKey='count'
                  fill='var(--color-count)'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
