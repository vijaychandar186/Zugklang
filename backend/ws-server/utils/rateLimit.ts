const messageLog = new Map<string, number[]>();

const LIMIT = 30;
const WINDOW_MS = 3_000;

export function isRateLimited(id: string): boolean {
  const now = Date.now();
  const timestamps = messageLog.get(id) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  messageLog.set(id, recent);
  return recent.length > LIMIT;
}

export function clearRateLimit(id: string): void {
  messageLog.delete(id);
}
