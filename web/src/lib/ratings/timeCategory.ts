export type TimeCategory = 'bullet' | 'blitz' | 'rapid' | 'classical';

/**
 * Determines the time control category based on the per-player minutes and increment.
 * Follows FIDE-aligned definitions:
 *   Bullet:    < 3 min, or 3+0 / 3+1
 *   Blitz:     3–10 min estimated (minutes*60 + increment*40 < 600s)
 *   Rapid:     10–60 min estimated
 *   Classical: > 60 min estimated
 */
export function getTimeCategory(
  minutes: number,
  increment: number
): TimeCategory {
  if (minutes < 3 || (minutes === 3 && increment <= 1)) return 'bullet';
  const estimatedSeconds = minutes * 60 + increment * 40;
  if (estimatedSeconds < 600) return 'blitz';
  if (estimatedSeconds < 3600) return 'rapid';
  return 'classical';
}

export const TIME_CATEGORY_LABELS: Record<TimeCategory, string> = {
  bullet: 'Bullet',
  blitz: 'Blitz',
  rapid: 'Rapid',
  classical: 'Classical'
};
