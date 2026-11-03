import { status } from "elysia";
import { getKv } from "../../db";
import { consumeTokenBucket, type TokenBucketOptions } from "../../lib/token-bucket";

export type AuthRateLimitAction =
  | "sign-in"
  | "sign-up"
  | "password-reset"
  | "password-reset-confirm";

const AUTH_RATE_LIMITS: Record<AuthRateLimitAction, TokenBucketOptions> = {
  "sign-in": { capacity: 20, refillPerSecond: 20 / 60 },
  "sign-up": { capacity: 10, refillPerSecond: 10 / 3600 },
  "password-reset": { capacity: 5, refillPerSecond: 5 / 3600 },
  "password-reset-confirm": { capacity: 5, refillPerSecond: 5 / 3600 },
};

const SIGN_IN_ACCOUNT_LIMIT: TokenBucketOptions = { capacity: 10, refillPerSecond: 10 / 60 };
const RESET_RESEND_BASE_DELAY_MS = 60_000;
const RESET_RESEND_MAX_DELAY_MS = 60 * 60_000;
const RESET_RESEND_TTL_SECONDS = 30 * 24 * 60 * 60;

export async function takePasswordResetEmailSlot(
  kv: KVNamespace,
  email: string,
  now = Date.now(),
): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  const emailHash = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  const key = `rl:auth:password-reset:email:${emailHash}`;
  const raw = await kv.get<{ attempts: number; nextAllowedAt: number }>(key, "json");
  const attempts =
    raw && Number.isSafeInteger(raw.attempts) && raw.attempts >= 0 ? raw.attempts : 0;
  const nextAllowedAt = raw && Number.isFinite(raw.nextAllowedAt) ? raw.nextAllowedAt : 0;
  if (now < nextAllowedAt) return false;

  const delay = Math.min(
    RESET_RESEND_BASE_DELAY_MS * 2 ** Math.min(attempts, 12),
    RESET_RESEND_MAX_DELAY_MS,
  );
  await kv.put(key, JSON.stringify({ attempts: attempts + 1, nextAllowedAt: now + delay }), {
    expirationTtl: RESET_RESEND_TTL_SECONDS,
  });
  return true;
}

export async function canSendPasswordResetEmail(email: string): Promise<boolean> {
  const kv = getKv();
  return kv ? takePasswordResetEmailSlot(kv, email) : true;
}

export function clientIpFromRequest(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) {
    return cf;
  }
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    if (first) {
      return first.trim();
    }
  }
  return "anonymous";
}

export type AuthRateLimitSet = {
  headers: Record<string, string | number | undefined>;
};

export async function assertAuthRateLimit(
  request: Request,
  action: AuthRateLimitAction,
  set: AuthRateLimitSet,
  accountIdentifier?: string,
): Promise<void> {
  const kv = getKv();
  if (!kv) {
    return;
  }

  const ip = clientIpFromRequest(request);
  const key = `rl:auth:${action}:${ip}`;
  const options = AUTH_RATE_LIMITS[action];
  const result = await consumeTokenBucket(kv, key, options);
  if (accountIdentifier && (action === "sign-in" || action === "password-reset-confirm")) {
    const normalized = accountIdentifier.trim().toLowerCase();
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
    const accountKey = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
    const accountResult = await consumeTokenBucket(
      kv,
      `rl:auth:${action}:account:${accountKey}`,
      action === "sign-in" ? SIGN_IN_ACCOUNT_LIMIT : AUTH_RATE_LIMITS[action],
    );
    if (!accountResult.allowed) {
      set.headers["Retry-After"] = String(accountResult.retryAfterSec);
      throw status(429, {
        success: false,
        message: "Too many requests. Try again later.",
        retryAfterSec: accountResult.retryAfterSec,
      });
    }
  }

  if (!result.allowed) {
    const retryAfterSec = result.retryAfterSec;
    set.headers["Retry-After"] = String(retryAfterSec);
    throw status(429, {
      success: false,
      message: "Too many requests. Try again later.",
      retryAfterSec,
    });
  }
}
