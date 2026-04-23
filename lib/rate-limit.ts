import { Redis } from "@upstash/redis";

import { env } from "@/lib/env";

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfter: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __itappensRateLimitStore: Map<string, Bucket> | undefined;
}

const memoryStore = global.__itappensRateLimitStore || new Map<string, Bucket>();

if (process.env.NODE_ENV !== "production") {
  global.__itappensRateLimitStore = memoryStore;
}

const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function assertRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  if (redis) {
    const bucketKey = `rate:${key}`;
    const current = await redis.incr(bucketKey);

    if (current === 1) {
      await redis.pexpire(bucketKey, windowMs);
    }

    const ttl = await redis.pttl(bucketKey);
    return {
      ok: current <= limit,
      remaining: Math.max(limit - current, 0),
      retryAfter: Math.max(ttl, 0),
    };
  }

  const now = Date.now();
  const bucket = memoryStore.get(key);
  if (!bucket || bucket.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: windowMs };
  }

  bucket.count += 1;
  memoryStore.set(key, bucket);

  return {
    ok: bucket.count <= limit,
    remaining: Math.max(limit - bucket.count, 0),
    retryAfter: bucket.resetAt - now,
  };
}
