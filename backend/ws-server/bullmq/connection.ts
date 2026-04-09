import type { ConnectionOptions } from 'bullmq';

export function getConnectionOptions(): ConnectionOptions {
  const url = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
  const parsed = new URL(url);

  return {
    host: parsed.hostname || 'localhost',
    port: Number(parsed.port || 6379),
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    db: parsed.pathname.length > 1 ? Number(parsed.pathname.slice(1)) : 0,
    tls: parsed.protocol === 'rediss:' ? {} : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times: number) => Math.min(times * 200, 10_000)
  } as unknown as ConnectionOptions;
}
