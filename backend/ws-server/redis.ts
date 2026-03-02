import Redis from 'ioredis';

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const redis = new Redis(url, { lazyConnect: false });
// Separate connection used exclusively for pub/sub subscriptions.
export const redisSub = new Redis(url, { lazyConnect: false });

redis.on('error', (err) => console.error('[redis] connection error:', err));
redisSub.on('error', (err) =>
  console.error('[redis-sub] connection error:', err)
);
