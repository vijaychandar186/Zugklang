'use client';

import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

type GaussianCurveControlProps = {
  mean: number;
  variance: number;
  onMeanChange: (mean: number) => void;
  onVarianceChange: (variance: number) => void;
};

// Calculate Gaussian probability density function
function gaussianPDF(x: number, mean: number, variance: number): number {
  const stdDev = Math.sqrt(variance);
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * variance);
  return coefficient * Math.exp(exponent);
}

export function GaussianCurveControl({
  mean,
  variance,
  onMeanChange,
  onVarianceChange
}: GaussianCurveControlProps) {
  const curvePoints = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const numPoints = 200;

    for (let i = 0; i <= numPoints; i++) {
      const x = 1 + (i / numPoints) * 19; // Range from 1 to 20
      const y = gaussianPDF(x, mean, variance);
      points.push({ x, y });
    }

    // Normalize to fit in our SVG viewBox
    const maxY = Math.max(...points.map((p) => p.y));
    return points.map((p) => ({
      x: ((p.x - 1) / 19) * 380 + 10, // Map 1-20 to 10-390 (SVG coordinates)
      y: 150 - (p.y / maxY) * 130 // Map to 20-150 (inverted for SVG, leave space at top)
    }));
  }, [mean, variance]);

  const pathD = useMemo(() => {
    if (curvePoints.length === 0) return '';

    const commands = curvePoints.map((point, i) => {
      const command = i === 0 ? 'M' : 'L';
      return `${command} ${point.x},${point.y}`;
    });

    // Close the path at the bottom
    commands.push(`L 390,150`);
    commands.push(`L 10,150`);
    commands.push('Z');

    return commands.join(' ');
  }, [curvePoints]);

  return (
    <div className='space-y-4'>
      {/* Gaussian Curve Visualization */}
      <div className='bg-background rounded-lg border p-4'>
        <Label className='mb-3 block text-center text-sm font-medium'>
          Difficulty Distribution
        </Label>
        <svg
          viewBox='0 0 400 160'
          className='h-40 w-full'
          style={{ backgroundColor: 'transparent' }}
        >
          {/* Grid lines */}
          {[1, 5, 10, 15, 20].map((level) => (
            <g key={level}>
              <line
                x1={((level - 1) / 19) * 380 + 10}
                y1={20}
                x2={((level - 1) / 19) * 380 + 10}
                y2={150}
                stroke='currentColor'
                strokeOpacity={0.1}
                strokeWidth={1}
              />
              <text
                x={((level - 1) / 19) * 380 + 10}
                y={158}
                textAnchor='middle'
                fontSize={10}
                fill='currentColor'
                opacity={0.5}
              >
                {level}
              </text>
            </g>
          ))}

          {/* Gaussian curve */}
          <path d={pathD} fill='currentColor' fillOpacity={0.2} />
          <path
            d={pathD.split('L 390,150')[0]}
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
          />

          {/* Mean indicator */}
          <line
            x1={((mean - 1) / 19) * 380 + 10}
            y1={20}
            x2={((mean - 1) / 19) * 380 + 10}
            y2={150}
            stroke='hsl(var(--primary))'
            strokeWidth={2}
            strokeDasharray='4 2'
          />
          <circle
            cx={((mean - 1) / 19) * 380 + 10}
            cy={
              curvePoints.find(
                (p) => Math.abs(p.x - (((mean - 1) / 19) * 380 + 10)) < 2
              )?.y || 85
            }
            r={4}
            fill='hsl(var(--primary))'
          />
        </svg>
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
