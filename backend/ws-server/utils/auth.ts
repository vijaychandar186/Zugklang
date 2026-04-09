import { redis } from '../redis';

const NEXT_APP_URL = (
  process.env['NEXT_APP_URL'] ?? 'http://localhost:3000'
).replace(/\/$/, '');
const INTROSPECT_URL = `${NEXT_APP_URL}/api/ws-token`;
const TOKEN_CACHE_TTL_SEC = 300; // 5 minutes

export async function verifyWsToken(token: string): Promise<string | null> {
  const cacheKey = `ws:token:${token}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return cached;
  } catch {
    // Redis-backed token caching is a best-effort optimization.
  }

  try {
    const res = await fetch(INTROSPECT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { userId?: string };
    const userId = typeof data.userId === 'string' ? data.userId : null;
    if (userId) {
      try {
        await redis.set(cacheKey, userId, 'EX', TOKEN_CACHE_TTL_SEC);
      } catch {
        // Ignore cache write failures and return the verified user ID.
      }
    }
    return userId;
  } catch {
    return null;
  }
}
