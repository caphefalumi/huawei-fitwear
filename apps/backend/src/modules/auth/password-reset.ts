import { enqueueEmail } from "../email/queue";
import { and, eq, exists, gt } from "drizzle-orm";
import { getDb, getEmailConfig, getEmailQueue, session, user, verification } from "../../db";
import { generateId } from "../../lib/id";
import { hashPassword, isPasswordWithinBcryptLimit } from "../../lib/password";
import type { PasswordResetBody } from "./index";

const IDENTIFIER_PREFIX = "password-reset:";
const RESET_LIFETIME_MS = 30 * 60 * 1000;
const SUCCESS_MESSAGE = "If an account exists for that email, a password reset code is on its way.";

export class InvalidPasswordResetToken extends Error {
  constructor() {
    super("Password reset code is invalid or expired.");
  }
}

async function digestToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
function generateResetOtp(): string {
  const range = 0x1_0000_0000;
  const limit = Math.floor(range / 10_000) * 10_000;
  const value = new Uint32Array(1);
  do {
    crypto.getRandomValues(value);
  } while (value[0]! >= limit);
  return String(value[0]! % 10_000).padStart(4, "0");
}

export function isPasswordResetConfigured(): boolean {
  const { apiKey, from, passwordResetTemplateId } = getEmailConfig();
  return Boolean(apiKey && from && passwordResetTemplateId && getEmailQueue());
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { apiKey, from, passwordResetTemplateId } = getEmailConfig();
  if (!apiKey || !from || !passwordResetTemplateId || !getEmailQueue()) {
    throw new Error("Password reset email is not configured.");
  }

  const db = getDb();
  const account = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.email, email.trim().toLowerCase()))
    .get();
  if (!account) return;

  const identifier = `${IDENTIFIER_PREFIX}${account.id}`;
  const otp = generateResetOtp();
  const otpHash = await digestToken(otp);
  const expiresAt = new Date(Date.now() + RESET_LIFETIME_MS);
  const recordId = generateId();
  await db.delete(verification).where(eq(verification.identifier, identifier)).run();
  await db
    .insert(verification)
    .values({ id: recordId, identifier, value: otpHash, expiresAt })
    .run();

  try {
    await enqueueEmail({
      type: "password-reset",
      to: account.email,
      otp,
      expiresAt: expiresAt.getTime(),
    });
  } catch (error) {
    await db.delete(verification).where(eq(verification.id, recordId)).run();
    throw error;
  }
}

export async function resetPassword({ email, code, password }: PasswordResetBody): Promise<void> {
  const db = getDb();
  const account = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email.trim().toLowerCase()))
    .get();
  if (!account) throw new InvalidPasswordResetToken();
  const otpHash = await digestToken(code);
  const identifier = `${IDENTIFIER_PREFIX}${account.id}`;
  const record = await db
    .select({ id: verification.id, identifier: verification.identifier })
    .from(verification)
    .where(
      and(
        eq(verification.identifier, identifier),
        eq(verification.value, otpHash),
        gt(verification.expiresAt, new Date()),
      ),
    )
    .get();
  if (!record) throw new InvalidPasswordResetToken();

  if (!isPasswordWithinBcryptLimit(password)) {
    throw new RangeError("Password must not exceed 72 UTF-8 bytes.");
  }

  const hashedPassword = await hashPassword(password);
  const validCode = and(
    eq(verification.id, record.id),
    eq(verification.identifier, identifier),
    eq(verification.value, otpHash),
    gt(verification.expiresAt, new Date()),
  );
  const codeExists = exists(db.select({ id: verification.id }).from(verification).where(validCode));
  const [updated] = await db.batch([
    db
      .update(user)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(and(eq(user.id, account.id), codeExists)),
    db.delete(session).where(and(eq(session.userId, account.id), codeExists)),
    db.delete(verification).where(validCode),
  ]);
  if (!updated || updated.meta.changes !== 1) throw new InvalidPasswordResetToken();
}
export const passwordResetMessage = SUCCESS_MESSAGE;
