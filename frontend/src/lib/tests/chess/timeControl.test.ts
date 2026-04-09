import { describe, it, expect } from 'vitest';
import {
  initializeTimers,
  hasTimer,
  getIncrement
} from '@/lib/chess/timeControl';
import type { TimeControl } from '@/features/game/types/rules';

const unlimited: TimeControl = { mode: 'unlimited', minutes: 0, increment: 0 };
const blitz5: TimeControl = { mode: 'timed', minutes: 5, increment: 3 };
const rapid15: TimeControl = { mode: 'timed', minutes: 15, increment: 10 };
const custom: TimeControl = {
  mode: 'custom',
  minutes: 0,
  increment: 0,
  whiteMinutes: 3,
  blackMinutes: 5,
  whiteIncrement: 2,
  blackIncrement: 4
};

describe('initializeTimers', () => {
  it('returns null times for unlimited mode', () => {
    expect(initializeTimers(unlimited)).toEqual({
      whiteTime: null,
      blackTime: null
    });
  });

  it('converts minutes to seconds for timed mode', () => {
    expect(initializeTimers(blitz5)).toEqual({
      whiteTime: 300,
      blackTime: 300
    });
  });

  it('both players get the same time in timed mode', () => {
    const result = initializeTimers(rapid15);
    expect(result.whiteTime).toBe(result.blackTime);
    expect(result.whiteTime).toBe(900);
  });

  it('uses per-color times in custom mode', () => {
    expect(initializeTimers(custom)).toEqual({
      whiteTime: 180,
      blackTime: 300
    });
  });

  it('defaults to 10 minutes per side when whiteMinutes/blackMinutes are absent in custom', () => {
    const tc: TimeControl = { mode: 'custom', minutes: 0, increment: 0 };
    expect(initializeTimers(tc)).toEqual({ whiteTime: 600, blackTime: 600 });
  });
});

describe('hasTimer', () => {
  it('returns false for unlimited', () => {
    expect(hasTimer(unlimited)).toBe(false);
  });

  it('returns true for timed', () => {
    expect(hasTimer(blitz5)).toBe(true);
  });

  it('returns true for custom', () => {
    expect(hasTimer(custom)).toBe(true);
  });
});

describe('getIncrement', () => {
  it('returns the shared increment for timed mode', () => {
    expect(getIncrement(blitz5, 'white')).toBe(3);
    expect(getIncrement(blitz5, 'black')).toBe(3);
  });

  it('returns per-color increments for custom mode', () => {
    expect(getIncrement(custom, 'white')).toBe(2);
    expect(getIncrement(custom, 'black')).toBe(4);
  });

  it('defaults to 0 when custom increments are absent', () => {
    const tc: TimeControl = { mode: 'custom', minutes: 0, increment: 0 };
    expect(getIncrement(tc, 'white')).toBe(0);
    expect(getIncrement(tc, 'black')).toBe(0);
  });
});
