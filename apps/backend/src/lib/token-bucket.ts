export type TokenBucketState = {
  tokens: number;
  updatedAt: number;
};

export type TokenBucketOptions = {
  capacity: number;
  refillPerSecond: number;
};

function parseBucketState(raw: unknown, capacity: number, now: number): TokenBucketState {
  if (raw && typeof raw === 'object' && 'tokens' in raw && 'updatedAt' in raw) {
    const candidate = raw as TokenBucketState;
    if (Number.isFinite(candidate.tokens) && Number.isFinite(candidate.updatedAt)) {
      return candidate;
    }
  }
  return { tokens: capacity, updatedAt: now };
}

function bucketTtlSec(options: TokenBucketOptions): number {
  if (options.refillPerSecond <= 0) {
    return 3600;
  }
  const refillToFull = Math.ceil(options.capacity / options.refillPerSecond);
  return Math.max(60, refillToFull + 60);
}

/** KV-backed token bucket. One token consumed per call when allowed. */
export async function consumeTokenBucket(
  kv: KVNamespace,
  key: string,
  options: TokenBucketOptions
): Promise<{ allowed: boolean; retryAfterSec: number }> {
  const now = Date.now();
  const raw = await kv.get(key, 'json');
  const state = parseBucketState(raw, options.capacity, now);

  const elapsedSec = Math.max(0, (now - state.updatedAt) / 1000);
  let refilled = state.tokens + elapsedSec * options.refillPerSecond;
  if (refilled > options.capacity) {
    refilled = options.capacity;
  }

  const ttl = bucketTtlSec(options);

  if (refilled < 1) {
    const need = 1 - refilled;
    let retryAfterSec = 1;
    if (options.refillPerSecond > 0) {
      retryAfterSec = Math.ceil(need / options.refillPerSecond);
    }
    await kv.put(key, JSON.stringify({ tokens: refilled, updatedAt: now }), { expirationTtl: ttl });
    return { allowed: false, retryAfterSec };
  }

  const tokensAfter = refilled - 1;
  await kv.put(key, JSON.stringify({ tokens: tokensAfter, updatedAt: now }), { expirationTtl: ttl });
  return { allowed: true, retryAfterSec: 0 };
}
