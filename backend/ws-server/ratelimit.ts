import { redis } from './redis';

/**
 * Sliding-window rate limiter backed by Redis.
 * Returns true if the action is within the allowed rate, false if it is over.
 */
export async function checkRateLimit(
  userId: string,
  action: string,
  max: number,
  windowSec: number
): Promise<boolean> {
  const key = `ratelimit:ws:${userId}:${action}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec);
  return count <= max;
}
