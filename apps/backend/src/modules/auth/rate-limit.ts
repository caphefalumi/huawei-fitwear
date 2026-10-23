import { status } from 'elysia';
import { getKv } from '../../db';
import { consumeTokenBucket, type TokenBucketOptions } from '../../lib/token-bucket';

export type AuthRateLimitAction = 'sign-in' | 'sign-up';

const AUTH_RATE_LIMITS: Record<AuthRateLimitAction, TokenBucketOptions> = {
  'sign-in': { capacity: 20, refillPerSecond: 20 / 60 },
  'sign-up': { capacity: 10, refillPerSecond: 10 / 3600 },
};

export function clientIpFromRequest(request: Request): string {
  const cf = request.headers.get('cf-connecting-ip');
  if (cf) {
    return cf;
  }
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0];
    if (first) {
      return first.trim();
    }
  }
  return 'anonymous';
}

export type AuthRateLimitSet = {
  headers: Record<string, string | number | undefined>;
};

export async function assertAuthRateLimit(
  request: Request,
  action: AuthRateLimitAction,
  set: AuthRateLimitSet
): Promise<void> {
  const kv = getKv();
  if (!kv) {
    return;
  }

  const ip = clientIpFromRequest(request);
  const key = `rl:auth:${action}:${ip}`;
  const options = AUTH_RATE_LIMITS[action];
  const result = await consumeTokenBucket(kv, key, options);

  if (!result.allowed) {
    const retryAfterSec = result.retryAfterSec;
    set.headers['Retry-After'] = String(retryAfterSec);
    throw status(429, {
      success: false,
      message: 'Too many requests. Try again later.',
      retryAfterSec,
    });
  }
}
