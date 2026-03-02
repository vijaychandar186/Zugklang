import { describe, expect, test } from 'bun:test';
import { isRateLimited } from '../utils/rateLimit';
// Rate limiting is now backed by Redis; these are integration tests.
// Each test uses a unique client ID to avoid cross-test state pollution.
describe('rate limiting', () => {
  test('allows first 30 messages and limits the 31st within the window', async () => {
    const clientId = `ratelimit-test-${crypto.randomUUID()}`;
    for (let i = 0; i < 30; i++) {
      expect(await isRateLimited(clientId)).toBe(false);
    }
    expect(await isRateLimited(clientId)).toBe(true);
  });
  test('different clients are rate limited independently', async () => {
    const client1 = `ratelimit-test-${crypto.randomUUID()}`;
    const client2 = `ratelimit-test-${crypto.randomUUID()}`;
    for (let i = 0; i < 31; i++) {
      await isRateLimited(client1);
    }
    expect(await isRateLimited(client1)).toBe(true);
    expect(await isRateLimited(client2)).toBe(false);
  });
});
