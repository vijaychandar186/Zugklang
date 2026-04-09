import Redis from 'ioredis';

const url = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
const isTestEnv = process.env['NODE_ENV'] === 'test';

type HashValue = Record<string, string>;
type ZSetValue = Map<string, number>;

function globToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replace(/\*/g, '.*')}$`);
}

class InMemoryRedis {
  private strings = new Map<string, string>();
  private hashes = new Map<string, HashValue>();
  private zsets = new Map<string, ZSetValue>();

  reset(): void {
    this.strings.clear();
    this.hashes.clear();
    this.zsets.clear();
  }

  on(_event: string, _handler: (...args: unknown[]) => void): this {
    return this;
  }

  async get(key: string): Promise<string | null> {
    return this.strings.get(key) ?? null;
  }

  async set(
    key: string,
    value: string,
    ..._args: Array<string | number>
  ): Promise<'OK'> {
    this.strings.set(key, value);
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let deleted = 0;
    for (const key of keys) {
      if (this.strings.delete(key)) deleted++;
      if (this.hashes.delete(key)) deleted++;
      if (this.zsets.delete(key)) deleted++;
    }
    return deleted;
  }

  async hset(
    key: string,
    fieldOrObject: string | Record<string, string>,
    value?: string
  ): Promise<number> {
    const hash = this.hashes.get(key) ?? {};
    if (typeof fieldOrObject === 'string') {
      hash[fieldOrObject] = value ?? '';
    } else {
      Object.assign(hash, fieldOrObject);
    }
    this.hashes.set(key, hash);
    return 1;
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return { ...(this.hashes.get(key) ?? {}) };
  }

  async expire(_key: string, _seconds: number): Promise<number> {
    return 1;
  }

  async incr(key: string): Promise<number> {
    const next = Number(this.strings.get(key) ?? '0') + 1;
    this.strings.set(key, String(next));
    return next;
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    const zset = this.zsets.get(key) ?? new Map<string, number>();
    zset.set(member, score);
    this.zsets.set(key, zset);
    return 1;
  }

  async zrangebyscore(
    key: string,
    min: number,
    max: number,
    ...args: Array<string | number>
  ): Promise<string[]> {
    const zset = this.zsets.get(key) ?? new Map<string, number>();
    const matches = [...zset.entries()]
      .filter(([, score]) => score >= min && score <= max)
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
      .map(([member]) => member);

    const limitIndex = args.findIndex((arg) => arg === 'LIMIT');
    if (limitIndex >= 0) {
      const offset = Number(args[limitIndex + 1] ?? 0);
      const count = Number(args[limitIndex + 2] ?? matches.length);
      return matches.slice(offset, offset + count);
    }
    return matches;
  }

  async zrem(key: string, member: string): Promise<number> {
    const zset = this.zsets.get(key);
    if (!zset) return 0;
    const existed = zset.delete(member);
    if (zset.size === 0) this.zsets.delete(key);
    return existed ? 1 : 0;
  }

  async zcard(key: string): Promise<number> {
    return this.zsets.get(key)?.size ?? 0;
  }

  async scan(
    _cursor: string,
    _matchKeyword: string,
    pattern: string,
    _countKeyword: string,
    _count: number
  ): Promise<[string, string[]]> {
    const matcher = globToRegExp(pattern);
    const keys = new Set<string>([
      ...this.strings.keys(),
      ...this.hashes.keys(),
      ...this.zsets.keys()
    ]);
    return ['0', [...keys].filter((key) => matcher.test(key))];
  }

  async publish(_channel: string, _message: string): Promise<number> {
    return 0;
  }

  subscribe(...args: unknown[]): void {
    const maybeCallback = args[args.length - 1];
    const callback =
      typeof maybeCallback === 'function'
        ? (maybeCallback as (err: Error | null, count: number) => void)
        : null;
    const channelCount = callback ? args.length - 1 : args.length;
    callback?.(null, channelCount);
  }
}

const redisOptions = {
  lazyConnect: false
};

/** Unique identifier for this pod/process. Set POD_ID env-var in k8s/docker. */
export const POD_ID: string = process.env['POD_ID'] ?? crypto.randomUUID();

/**
 * Public WebSocket URL of this pod (e.g. ws://ws-pod-1:8080).
 * When set, cross-pod matched messages include this URL so clients can
 * reconnect to the correct pod for their game room.
 */
export const POD_URL: string | null = process.env['POD_URL'] ?? null;

const testRedis = new InMemoryRedis();
const testRedisSub = new InMemoryRedis();

export const redis = (isTestEnv
  ? testRedis
  : new Redis(url, redisOptions)) as unknown as Redis;
// Separate connection used exclusively for pub/sub subscriptions.
export const redisSub = (isTestEnv
  ? testRedisSub
  : new Redis(url, redisOptions)) as unknown as Redis;

export function resetTestRedis(): void {
  if (!isTestEnv) return;
  testRedis.reset();
  testRedisSub.reset();
}

if (!isTestEnv) {
  redis.on('error', (err) => console.error('[redis] connection error:', err));
  redisSub.on('error', (err) =>
    console.error('[redis-sub] connection error:', err)
  );
}
