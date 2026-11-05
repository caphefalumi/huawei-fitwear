import { and, eq, exists, gt, like, or } from "drizzle-orm"

import { getDb, getEmailConfig, getEmailQueue, session, user, verification } from "../../db"
import { generateId, generateToken } from "../../lib/id"
import { hashPassword, isPasswordWithinLimit } from "../../lib/password"
import { enqueueEmail } from "../email/queue"
import type { PasswordResetBody, PasswordResetVerifyBody } from "./index"
import { clearPasswordResetEmailSlot } from "./rate-limit"

const OTP_IDENTIFIER_PREFIX = "password-reset:"
const TOKEN_IDENTIFIER_PREFIX = "password-reset-token:"
const OTP_LIFETIME_MS = 10 * 60 * 1000
const RESET_TOKEN_LIFETIME_MS = 10 * 60 * 1000
const SUCCESS_MESSAGE = "If an account exists for that email, a password reset code is on its way."

export class InvalidPasswordResetToken extends Error {
  constructor() {
    super("Password reset credentials are invalid or expired.")
  }
}

async function digestToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}
function constantTimeEqual(left: string, right: string): boolean {
  let difference = left.length ^ right.length
  const length = Math.max(left.length, right.length)
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0)
  }
  return difference === 0
}
function generateResetOtp(): string {
  const range = 0x1_0000_0000
  const limit = Math.floor(range / 10_000) * 10_000
  const value = new Uint32Array(1)
  do {
    crypto.getRandomValues(value)
  } while (value[0]! >= limit)
  return String(value[0]! % 10_000).padStart(4, "0")
}

export function isPasswordResetConfigured(): boolean {
  const { apiKey, from, passwordResetTemplateId } = getEmailConfig()
  return Boolean(apiKey && from && passwordResetTemplateId && getEmailQueue())
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { apiKey, from, passwordResetTemplateId } = getEmailConfig()
  if (!apiKey || !from || !passwordResetTemplateId || !getEmailQueue()) {
    throw new Error("Password reset email is not configured.")
  }

  const db = getDb()
  const account = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.email, email.trim().toLowerCase()))
    .get()
  if (!account) return

  const identifier = `${OTP_IDENTIFIER_PREFIX}${account.id}`
  const otp = generateResetOtp()
  const otpHash = await digestToken(otp)
  const expiresAt = new Date(Date.now() + OTP_LIFETIME_MS)
  const recordId = generateId()
  await db.batch([
    db
      .delete(verification)
      .where(
        or(
          eq(verification.identifier, identifier),
          eq(verification.identifier, `${TOKEN_IDENTIFIER_PREFIX}${account.id}`),
        ),
      ),
    db.insert(verification).values({ id: recordId, identifier, value: otpHash, expiresAt }),
  ])

  try {
    await enqueueEmail({
      type: "password-reset",
      to: account.email,
      otp,
      expiresAt: expiresAt.getTime(),
    })
  } catch (error) {
    await db.delete(verification).where(eq(verification.id, recordId)).run()
    throw error
  }
}

export async function verifyPasswordResetCode({
  email,
  code,
}: PasswordResetVerifyBody): Promise<{ success: true; resetToken: string }> {
  const db = getDb()
  const account = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email.trim().toLowerCase()))
    .get()
  if (!account) throw new InvalidPasswordResetToken()

  const identifier = `${OTP_IDENTIFIER_PREFIX}${account.id}`
  const otpHash = await digestToken(code)
  const record = await db
    .select({ id: verification.id, value: verification.value })
    .from(verification)
    .where(and(eq(verification.identifier, identifier), gt(verification.expiresAt, new Date())))
    .get()
  if (!record || !constantTimeEqual(record.value, otpHash)) {
    throw new InvalidPasswordResetToken()
  }

  const resetToken = generateToken()
  const tokenHash = await digestToken(resetToken)
  const updated = await db
    .update(verification)
    .set({
      identifier: `${TOKEN_IDENTIFIER_PREFIX}${account.id}`,
      value: tokenHash,
      expiresAt: new Date(Date.now() + RESET_TOKEN_LIFETIME_MS),
    })
    .where(
      and(
        eq(verification.id, record.id),
        eq(verification.identifier, identifier),
        eq(verification.value, record.value),
        gt(verification.expiresAt, new Date()),
      ),
    )
    .run()
  if (updated.meta.changes !== 1) throw new InvalidPasswordResetToken()
  return { success: true, resetToken }
}

export async function resetPassword({ resetToken, password }: PasswordResetBody): Promise<void> {
  const db = getDb()
  const tokenHash = await digestToken(resetToken)
  const record = await db
    .select({ id: verification.id, identifier: verification.identifier })
    .from(verification)
    .where(
      and(
        like(verification.identifier, `${TOKEN_IDENTIFIER_PREFIX}%`),
        eq(verification.value, tokenHash),
        gt(verification.expiresAt, new Date()),
      ),
    )
    .get()
  if (!record) throw new InvalidPasswordResetToken()
  const userId = record.identifier.slice(TOKEN_IDENTIFIER_PREFIX.length)
  if (!userId) throw new InvalidPasswordResetToken()

  if (!isPasswordWithinLimit(password)) {
    throw new RangeError("Password must not exceed 72 UTF-8 bytes.")
  }

  const hashedPassword = await hashPassword(password)
  const validToken = and(
    eq(verification.id, record.id),
    eq(verification.identifier, `${TOKEN_IDENTIFIER_PREFIX}${userId}`),
    eq(verification.value, tokenHash),
    gt(verification.expiresAt, new Date()),
  )
  const tokenExists = exists(
    db.select({ id: verification.id }).from(verification).where(validToken),
  )
  const [updated] = await db.batch([
    db
      .update(user)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(and(eq(user.id, userId), tokenExists)),
    db.delete(session).where(and(eq(session.userId, userId), tokenExists)),
    db.delete(verification).where(validToken),
  ])
  if (!updated || updated.meta.changes !== 1) throw new InvalidPasswordResetToken()

  const account = await db.select({ email: user.email }).from(user).where(eq(user.id, userId)).get()
  if (account) {
    await clearPasswordResetEmailSlot(account.email).catch(() => undefined)
  }
}
export const passwordResetMessage = SUCCESS_MESSAGE
