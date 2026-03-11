import Redis from 'ioredis';

// Reuse the connection across Next.js hot-reloads in development.
const globalForRedis = global as typeof global & { redis?: Redis };

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    lazyConnect: false,
    maxRetriesPerRequest: 3
  });

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

/**
 * Wrap an expensive async operation with a Redis cache.
 * Returns the cached value if present, otherwise calls `fn`, caches the
 * result for `ttlSeconds`, and returns it.
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached !== null) return JSON.parse(cached) as T;
  const data = await fn();
  await redis.setex(key, ttlSeconds, JSON.stringify(data));
  return data;
}

/**
 * Redis-backed rate limiter using the INCR + EXPIRE pattern.
 * Returns true if the caller is within the allowed rate, false if over limit.
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowSec: number
): Promise<boolean> {
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec);
  return count <= max;
}
