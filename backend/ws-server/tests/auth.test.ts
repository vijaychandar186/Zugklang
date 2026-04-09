import { afterEach, describe, expect, test } from 'bun:test';
import { verifyWsToken } from '../utils/auth';
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
describe('verifyWsToken', () => {
  test('returns user id when introspection succeeds', async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ userId: 'user-123' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })) as unknown as typeof fetch;
    await expect(verifyWsToken('token-1')).resolves.toBe('user-123');
  });
  test('returns null when introspection returns non-2xx', async () => {
    globalThis.fetch = (async () =>
      new Response('Unauthorized', { status: 401 })) as unknown as typeof fetch;
    await expect(verifyWsToken('token-non2xx')).resolves.toBeNull();
  });
  test('returns null when response has no userId', async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })) as unknown as typeof fetch;
    await expect(verifyWsToken('token-no-userid')).resolves.toBeNull();
  });
  test('returns null when fetch throws', async () => {
    globalThis.fetch = (async () => {
      throw new Error('network down');
    }) as unknown as typeof fetch;
    await expect(verifyWsToken('token-throws')).resolves.toBeNull();
  });
});
