import { redis } from '../redis';
import { RATE_LIMIT_MAX_MESSAGES, RATE_LIMIT_WINDOW_MS } from '../config';

const WINDOW_SEC = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);

export async function isRateLimited(id: string): Promise<boolean> {
  const key = `ratelimit:ws:${id}:msg`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, WINDOW_SEC);
  return count > RATE_LIMIT_MAX_MESSAGES;
}

/** No-op: Redis keys expire automatically after WINDOW_SEC. */
export function clearRateLimit(_id: string): void {}
