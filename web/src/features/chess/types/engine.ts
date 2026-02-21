export type EngineMode = 'fixed' | 'probabilistic';

export type EngineConfig =
  | {
      mode: 'fixed';
      level: number;
    }
  | {
      mode: 'probabilistic';
      mean: number;
      variance: number;
    };

export function sampleFromGaussian(mean: number, variance: number): number {
  // Box-Muller transform to generate normal distribution
  const u1 = Math.random();
  const u2 = Math.random();

  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const stdDev = Math.sqrt(variance);

  // Sample from normal distribution and clamp to valid range [1, 20]
  const sample = mean + z0 * stdDev;
  return Math.max(1, Math.min(20, Math.round(sample)));
}
