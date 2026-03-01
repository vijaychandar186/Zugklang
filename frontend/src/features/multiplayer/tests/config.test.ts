import { describe, it, expect } from 'vitest';
import {
  ABORT_TIMEOUT_MS,
  ABANDON_TIMEOUT_MS,
  ABORT_COUNTDOWN_VISIBILITY_DELAY_MS
} from '@/features/multiplayer/config';

describe('multiplayer config constants', () => {
  it('ABORT_TIMEOUT_MS is a positive number', () => {
    expect(typeof ABORT_TIMEOUT_MS).toBe('number');
    expect(ABORT_TIMEOUT_MS).toBeGreaterThan(0);
  });

  it('ABANDON_TIMEOUT_MS is a positive number', () => {
    expect(typeof ABANDON_TIMEOUT_MS).toBe('number');
    expect(ABANDON_TIMEOUT_MS).toBeGreaterThan(0);
  });

  it('ABORT_COUNTDOWN_VISIBILITY_DELAY_MS is a positive number', () => {
    expect(typeof ABORT_COUNTDOWN_VISIBILITY_DELAY_MS).toBe('number');
    expect(ABORT_COUNTDOWN_VISIBILITY_DELAY_MS).toBeGreaterThan(0);
  });

  it('abort timeout is longer than abandon timeout', () => {
    expect(ABORT_TIMEOUT_MS).toBeGreaterThan(ABANDON_TIMEOUT_MS);
  });

  it('visibility delay is less than the abort timeout', () => {
    expect(ABORT_COUNTDOWN_VISIBILITY_DELAY_MS).toBeLessThan(ABORT_TIMEOUT_MS);
  });
});
