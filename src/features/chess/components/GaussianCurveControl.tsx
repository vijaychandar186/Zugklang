'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';

type GaussianCurveControlProps = {
  mean: number;
  variance: number;
  onMeanChange: (mean: number) => void;
  onVarianceChange: (variance: number) => void;
};

function gaussianPDF(x: number, mean: number, variance: number): number {
  const stdDev = Math.sqrt(variance);
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * variance);
  return coefficient * Math.exp(exponent);
}

const chartConfig = {
  probability: {
    label: 'Probability',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function GaussianCurveControl({
  mean,
  variance,
  onMeanChange,
  onVarianceChange
}: GaussianCurveControlProps) {
  const chartData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const level = i + 1;
      return { level, probability: gaussianPDF(level, mean, variance) };
    });
  }, [mean, variance]);

  return (
    <div className='space-y-4'>
      {/* Gaussian Curve Visualization */}
      <div className='bg-background rounded-lg border p-4'>
        <Label className='mb-3 block text-center text-sm font-medium'>
          Difficulty Distribution
        </Label>
        <ChartContainer config={chartConfig} className='w-full'>
          <div className='h-[160px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart
                data={chartData}
                margin={{ left: -30, right: 0, top: 5, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id='gaussianGradient'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='5%'
                      stopColor='var(--color-probability)'
                      stopOpacity={0.8}
                    />
                    <stop
                      offset='95%'
                      stopColor='var(--color-probability)'
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='level'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  interval={4}
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `Level ${value}`}
                      formatter={(value) => [
                        (value as number).toFixed(4),
                        'Probability'
                      ]}
                      indicator='dot'
                    />
                  }
                />
                <ReferenceLine
                  x={mean}
                  stroke='var(--color-probability)'
                  strokeWidth={2}
                  strokeDasharray='4 2'
                  label={{ value: `μ=${mean}`, position: 'top', fontSize: 10 }}
                />
                <Area
                  type='natural'
                  dataKey='probability'
                  stroke='var(--color-probability)'
                  strokeWidth={2}
                  fill='url(#gaussianGradient)'
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
        <div className='text-muted-foreground mt-2 flex justify-between text-xs'>
          <span>Easier</span>
          <span className='text-primary font-medium'>Mean: {mean}</span>
          <span>Harder</span>
        </div>
      </div>

      {/* Mean Control */}
      <div className='space-y-3'>
        <Label className='block text-center'>
          Mean Difficulty: {mean}
          <span className='text-muted-foreground ml-2 text-xs'>
            ({mean < 7 ? 'Easier' : mean > 14 ? 'Harder' : 'Balanced'})
          </span>
        </Label>
        <Slider
          value={[mean]}
          onValueChange={(v) => onMeanChange(v[0])}
          min={1}
          max={20}
          step={1}
          className='w-full'
        />
        <div className='text-muted-foreground flex justify-between text-xs'>
          <span>Left-skewed (Easier mix)</span>
          <span>Right-skewed (Harder mix)</span>
        </div>
      </div>

      {/* Variance Control */}
      <div className='space-y-3'>
        <Label className='block text-center'>
          Variance: {variance.toFixed(1)}
          <span className='text-muted-foreground ml-2 text-xs'>
            (
            {variance < 5
              ? 'Consistent'
              : variance > 15
                ? 'Unpredictable'
                : 'Moderate'}
            )
          </span>
        </Label>
        <Slider
          value={[variance]}
          onValueChange={(v) => onVarianceChange(v[0])}
          min={1}
          max={25}
          step={0.5}
          className='w-full'
        />
        <div className='text-muted-foreground flex justify-between text-xs'>
          <span>Narrow (Predictable)</span>
          <span>Wide (Variable)</span>
        </div>
      </div>

      {/* Explanation */}
      <div className='bg-muted/50 rounded-lg p-3'>
        <p className='text-muted-foreground text-xs leading-relaxed'>
          <strong>Probabilistic Mode:</strong> The engine will sample moves from
          a Gaussian distribution. Adjust the <strong>mean</strong> to shift
          difficulty left (easier) or right (harder), and{' '}
          <strong>variance</strong> to control how unpredictable the engine
          plays.
        </p>
      </div>
    </div>
  );
}
