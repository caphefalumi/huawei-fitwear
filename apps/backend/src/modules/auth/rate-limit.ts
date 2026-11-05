import { status } from "elysia"
import { getKv } from "../../db"
import { consumeTokenBucket, type TokenBucketOptions } from "../../lib/token-bucket"

export type AuthRateLimitAction =
  | "sign-in"
  | "sign-up"
  | "password-reset"
  | "password-reset-confirm"

const AUTH_RATE_LIMITS: Record<AuthRateLimitAction, TokenBucketOptions> = {
  "sign-in": { capacity: 20, refillPerSecond: 20 / 60 },
  "sign-up": { capacity: 10, refillPerSecond: 10 / 3600 },
  "password-reset": { capacity: 5, refillPerSecond: 5 / 3600 },
  "password-reset-confirm": { capacity: 5, refillPerSecond: 5 / 3600 },
}

const SIGN_IN_ACCOUNT_LIMIT: TokenBucketOptions = { capacity: 10, refillPerSecond: 10 / 60 }
const RESET_RESEND_DELAYS_MS = [30_000, 60_000, 180_000, 300_000]
const RESET_RESEND_MAX_DELAY_MS = 600_000
const RESET_EMAILS_PER_DAY = 5
const RESET_DAY_MS = 24 * 60 * 60_000
const RESET_RESEND_TTL_SECONDS = 30 * 24 * 60 * 60

type ResetEmailState = {
  attempts?: number
  nextAllowedAt?: number
  sends?: number
  windowStartedAt?: number
  lastRequestAt?: number
}

export type ResetEmailSlot = {
  allowed: boolean
  retryAfterSeconds: number
  dailyLimitReached?: boolean
}

async function passwordResetKey(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase()
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))
  const emailHash = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")
  return `rl:auth:password-reset:email:${emailHash}`
}

export async function takePasswordResetEmailSlot(
  kv: KVNamespace,
  email: string,
  now = Date.now(),
): Promise<ResetEmailSlot> {
  const key = await passwordResetKey(email)
  const raw = await kv.get<ResetEmailState>(key, "json")
  const windowStartedAt = raw?.windowStartedAt ?? raw?.lastRequestAt ?? 0
  const idle = !raw || now - windowStartedAt >= RESET_DAY_MS
  const attempts =
    idle ||
    typeof raw?.attempts !== "number" ||
    !Number.isSafeInteger(raw.attempts) ||
    raw.attempts < 0
      ? 0
      : raw.attempts
  const sends = idle ? 0 : (raw?.sends ?? 0)
  const windowStart = idle ? now : windowStartedAt

  if (sends >= RESET_EMAILS_PER_DAY) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowStart + RESET_DAY_MS - now) / 1000)),
      dailyLimitReached: true,
    }
  }

  const nextAllowedAt = idle ? 0 : (raw?.nextAllowedAt ?? 0)
  if (now < nextAllowedAt) {
    return { allowed: false, retryAfterSeconds: Math.ceil((nextAllowedAt - now) / 1000) }
  }

  // 30s/60s/180s/300s, then a 10-minute wait for every later request.
  const delay = RESET_RESEND_DELAYS_MS[attempts] ?? RESET_RESEND_MAX_DELAY_MS
  await kv.put(
    key,
    JSON.stringify({
      attempts: attempts + 1,
      sends: sends + 1,
      windowStartedAt: windowStart,
      nextAllowedAt: now + delay,
      lastRequestAt: now,
    }),
    { expirationTtl: RESET_RESEND_TTL_SECONDS },
  )
  return { allowed: true, retryAfterSeconds: Math.ceil(delay / 1000) }
}

export async function clearPasswordResetEmailSlot(email: string): Promise<void> {
  const kv = getKv()
  if (!kv) return
  await kv.delete(await passwordResetKey(email))
}

export async function canSendPasswordResetEmail(email: string): Promise<ResetEmailSlot> {
  const kv = getKv()
  return kv
    ? takePasswordResetEmailSlot(kv, email)
    : { allowed: true, retryAfterSeconds: RESET_RESEND_DELAYS_MS[0] / 1000 }
}

export function clientIpFromRequest(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip")
  if (cf) {
    return cf
  }
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]
    if (first) {
      return first.trim()
    }
  }
  return "anonymous"
}

export type AuthRateLimitSet = {
  headers: Record<string, string | number | undefined>
}

export async function assertAuthRateLimit(
  request: Request,
  action: AuthRateLimitAction,
  set: AuthRateLimitSet,
  accountIdentifier?: string,
): Promise<void> {
  const kv = getKv()
  if (!kv) {
    return
  }

  const ip = clientIpFromRequest(request)
  const key = `rl:auth:${action}:${ip}`
  const options = AUTH_RATE_LIMITS[action]
  const result = await consumeTokenBucket(kv, key, options)
  if (accountIdentifier && (action === "sign-in" || action === "password-reset-confirm")) {
    const normalized = accountIdentifier.trim().toLowerCase()
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))
    const accountKey = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("")
    const accountResult = await consumeTokenBucket(
      kv,
      `rl:auth:${action}:account:${accountKey}`,
      action === "sign-in" ? SIGN_IN_ACCOUNT_LIMIT : AUTH_RATE_LIMITS[action],
    )
    if (!accountResult.allowed) {
      set.headers["Retry-After"] = String(accountResult.retryAfterSec)
      throw status(429, {
        success: false,
        message: "Too many requests. Try again later.",
        retryAfterSec: accountResult.retryAfterSec,
      })
    }
  }

  if (!result.allowed) {
    const retryAfterSec = result.retryAfterSec
    set.headers["Retry-After"] = String(retryAfterSec)
    throw status(429, {
      success: false,
      message: "Too many requests. Try again later.",
      retryAfterSec,
    })
  }
}
