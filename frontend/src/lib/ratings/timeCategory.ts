export type TimeCategory = 'bullet' | 'blitz' | 'rapid' | 'classical';
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
