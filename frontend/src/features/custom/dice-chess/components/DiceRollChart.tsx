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
import { type DicePiece, PIECE_NAMES } from '../stores/useDiceChessStore';

type DiceRollChartProps = {
  diceRolls: DicePiece[];
  className?: string;
};

const PIECE_ORDER: DicePiece[] = ['k', 'q', 'b', 'n', 'r', 'p'];

const chartConfig = {
  count: {
    label: 'Rolls',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function DiceRollChart({ diceRolls, className }: DiceRollChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<DicePiece, number> = {
      k: 0,
      q: 0,
      b: 0,
      n: 0,
      r: 0,
      p: 0
    };
    for (const piece of diceRolls) {
      counts[piece]++;
    }
    return PIECE_ORDER.map((piece) => ({
      piece: PIECE_NAMES[piece],
      count: counts[piece]
    }));
  }, [diceRolls]);

  const total = diceRolls.length;

  if (total === 0) return null;

  return (
    <Card className={className}>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Dice Roll Distribution</CardTitle>
        <div className='text-muted-foreground flex flex-wrap gap-4 text-xs'>
          <span>
            Total: <strong>{total}</strong> rolls
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
                  dataKey='piece'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
                  label={{
                    value: 'Piece',
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
                    value: 'Rolls',
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
                      labelFormatter={(value) => `${value}`}
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
