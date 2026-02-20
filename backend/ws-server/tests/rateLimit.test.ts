import { beforeEach, describe, expect, test } from 'bun:test';
import { clearRateLimit, isRateLimited } from '../utils/rateLimit';

describe('rate limiting', () => {
  const clientId = 'client-1';

  beforeEach(() => {
    clearRateLimit(clientId);
  });

  test('allows first 30 messages and limits the 31st within the window', () => {
    for (let i = 0; i < 30; i++) {
      expect(isRateLimited(clientId)).toBe(false);
    }
    expect(isRateLimited(clientId)).toBe(true);
  });

  test('clearRateLimit resets message history', () => {
    for (let i = 0; i < 31; i++) {
      isRateLimited(clientId);
    }
    expect(isRateLimited(clientId)).toBe(true);

    clearRateLimit(clientId);
    expect(isRateLimited(clientId)).toBe(false);
  });
});
