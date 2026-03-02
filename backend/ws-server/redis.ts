import Redis from 'ioredis';

const url = process.env['REDIS_URL'] ?? 'redis://localhost:6379';

/** Unique identifier for this pod/process. Set POD_ID env-var in k8s/docker. */
export const POD_ID: string = process.env['POD_ID'] ?? crypto.randomUUID();

/**
 * Public WebSocket URL of this pod (e.g. ws://ws-pod-1:8080).
 * When set, cross-pod matched messages include this URL so clients can
 * reconnect to the correct pod for their game room.
 */
export const POD_URL: string | null = process.env['POD_URL'] ?? null;

export const redis = new Redis(url, { lazyConnect: false });
// Separate connection used exclusively for pub/sub subscriptions.
export const redisSub = new Redis(url, { lazyConnect: false });

redis.on('error', (err) => console.error('[redis] connection error:', err));
redisSub.on('error', (err) =>
  console.error('[redis-sub] connection error:', err)
);
