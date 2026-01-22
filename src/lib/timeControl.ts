import { TimeControl } from '@/features/game/types/rules';

export interface InitialTimers {
  whiteTime: number | null;
  blackTime: number | null;
}

export function initializeTimers(timeControl: TimeControl): InitialTimers {
  if (timeControl.mode === 'unlimited') {
    return { whiteTime: null, blackTime: null };
  }

  if (timeControl.mode === 'timed') {
    const time = timeControl.minutes * 60;
    return { whiteTime: time, blackTime: time };
  }

  if (timeControl.mode === 'custom') {
    return {
      whiteTime: (timeControl.whiteMinutes ?? 10) * 60,
      blackTime: (timeControl.blackMinutes ?? 10) * 60
    };
  }

  return { whiteTime: null, blackTime: null };
}

export function hasTimer(timeControl: TimeControl): boolean {
  return timeControl.mode !== 'unlimited';
}

export function getIncrement(
  timeControl: TimeControl,
  color: 'white' | 'black'
): number {
  if (timeControl.mode === 'custom') {
    return color === 'white'
      ? (timeControl.whiteIncrement ?? 0)
      : (timeControl.blackIncrement ?? 0);
  }
  return timeControl.increment;
}
