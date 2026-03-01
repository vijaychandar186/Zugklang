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
import { type CardRank } from '../stores/useCardChessStore';
type CardDrawChartProps = {
  cardDraws: CardRank[];
  className?: string;
};
const RANK_ORDER: CardRank[] = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A'
];
const chartConfig = {
  count: {
    label: 'Draws',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;
export function CardDrawChart({ cardDraws, className }: CardDrawChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<CardRank, number> = {
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      J: 0,
      Q: 0,
      K: 0,
      A: 0
    };
    for (const rank of cardDraws) {
      counts[rank]++;
    }
    return RANK_ORDER.map((rank) => ({
      rank,
      count: counts[rank]
    }));
  }, [cardDraws]);
  const total = cardDraws.length;
  if (total === 0) return null;
  return (
    <Card className={className}>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Card Draw Distribution</CardTitle>
        <div className='text-muted-foreground flex flex-wrap gap-4 text-xs'>
          <span>
            Total: <strong>{total}</strong> draws
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
                  dataKey='rank'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
                  label={{
                    value: 'Card Rank',
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
                    value: 'Draws',
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
