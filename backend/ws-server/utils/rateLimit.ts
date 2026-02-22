import { RATE_LIMIT_MAX_MESSAGES, RATE_LIMIT_WINDOW_MS } from '../config';
const messageLog = new Map<string, number[]>();
export function isRateLimited(id: string): boolean {
  const now = Date.now();
  const timestamps = messageLog.get(id) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  messageLog.set(id, recent);
  return recent.length > RATE_LIMIT_MAX_MESSAGES;
}
export function clearRateLimit(id: string): void {
  messageLog.delete(id);
}
