import { enqueueEmail } from '../email/queue';
import { and, eq, exists, gt, like } from 'drizzle-orm';
import { getDb, getEmailConfig, getEmailQueue, session, user, verification } from '../../db';
import { generateId } from '../../lib/id';
import { hashPassword, isPasswordWithinBcryptLimit } from '../../lib/password';
import type { PasswordResetBody } from './index';

const IDENTIFIER_PREFIX = 'password-reset:';
const RESET_LIFETIME_MS = 30 * 60 * 1000;
const SUCCESS_MESSAGE = 'If an account exists for that email, a password reset code is on its way.';

export class InvalidPasswordResetToken extends Error {
  constructor() {
    super('Password reset code is invalid or expired.');
  }
}

async function digestToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
function generateResetOtp(): string {
  const range = 0x1_0000_0000;
  const limit = Math.floor(range / 100_000_000) * 100_000_000;
  const value = new Uint32Array(1);
  do {
    crypto.getRandomValues(value);
  } while (value[0]! >= limit);
  return String(value[0]! % 100_000_000).padStart(8, '0');
}

export function isPasswordResetConfigured(): boolean {
  const { apiKey, from, resetUrl, passwordResetTemplateId } = getEmailConfig();
  return Boolean(apiKey && from && resetUrl && passwordResetTemplateId && getEmailQueue());
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { apiKey, from, resetUrl, passwordResetTemplateId } = getEmailConfig();
  if (!apiKey || !from || !resetUrl || !passwordResetTemplateId || !getEmailQueue()) {
    throw new Error('Password reset email is not configured.');
  }

  const db = getDb();
  const account = await db.select({ id: user.id, email: user.email }).from(user).where(eq(user.email, email.trim().toLowerCase())).get();
  if (!account) return;

  const identifier = `${IDENTIFIER_PREFIX}${account.id}`;
  const otp = generateResetOtp();
  const otpHash = await digestToken(otp);
  const expiresAt = new Date(Date.now() + RESET_LIFETIME_MS);
  const recordId = generateId();
  await db.delete(verification).where(eq(verification.identifier, identifier)).run();
  await db.insert(verification).values({ id: recordId, identifier, value: otpHash, expiresAt }).run();

  try {
    await enqueueEmail({ type: 'password-reset', to: account.email, otp, expiresAt: expiresAt.getTime() });
  } catch (error) {
    await db.delete(verification).where(eq(verification.id, recordId)).run();
    throw error;
  }
}

export async function resetPassword({ email, code, password }: PasswordResetBody): Promise<void> {
  const db = getDb();
  const account = await db.select({ id: user.id }).from(user)
    .where(eq(user.email, email.trim().toLowerCase())).get();
  if (!account) throw new InvalidPasswordResetToken();
  const otpHash = await digestToken(code);
  const identifier = `${IDENTIFIER_PREFIX}${account.id}`;
  const record = await db.select({ id: verification.id, identifier: verification.identifier })
    .from(verification)
    .where(and(
      eq(verification.identifier, identifier),
      eq(verification.value, otpHash),
      gt(verification.expiresAt, new Date()),
    ))
    .get();
  if (!record) throw new InvalidPasswordResetToken();

  if (!isPasswordWithinBcryptLimit(password)) {
    throw new RangeError('Password must not exceed 72 UTF-8 bytes.');
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
    db.update(user).set({ password: hashedPassword, updatedAt: new Date() })
      .where(and(eq(user.id, account.id), codeExists)),
    db.delete(session).where(and(eq(session.userId, account.id), codeExists)),
    db.delete(verification).where(validCode),
  ]);
  if (!updated || updated.meta.changes !== 1) throw new InvalidPasswordResetToken();
}
export const passwordResetMessage = SUCCESS_MESSAGE;
export const passwordResetPage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Reset your VoocHealth password</title>
  <style>
    body { font: 16px system-ui, sans-serif; max-width: 30rem; margin: 12vh auto; padding: 1.5rem; color: #201d1b; background: #faf8f5; }
    form { display: grid; gap: 1rem; }
    input, button { font: inherit; padding: .8rem; border: 1px solid #cfc8c3; border-radius: .6rem; }
    button { background: #ff6363; color: white; border: 0; cursor: pointer; }
    p { line-height: 1.5; }
  </style>
</head>
<body>
  <h1>Reset your password</h1>
  <p>Enter the 8-digit code from your email and choose a new password. Codes expire after 30 minutes and can only be used once.</p>
  <form id="reset">
    <label>Email<input name="email" type="email" autocomplete="email" required></label>
    <label>Reset code<input name="code" type="text" inputmode="numeric" pattern="[0-9]{8}" maxlength="8" autocomplete="one-time-code" required></label>
    <label>New password<input name="password" type="password" minlength="8" maxlength="72" autocomplete="new-password" required></label>
    <button type="submit">Save new password</button>
  </form>
  <p id="message" role="status" aria-live="polite"></p>
  <script>
    const form = document.querySelector('#reset');
    const message = document.querySelector('#message');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button');
      button.disabled = true;
      message.textContent = 'Updating password…';
      try {
        const response = await fetch('/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const result = await response.json();
        if (response.ok) {
          message.textContent = result.message;
          form.hidden = true;
        } else {
          message.textContent = response.status === 400 || response.status === 422
            ? 'This reset code is invalid or expired.'
            : result.message || 'Unable to update your password. Please try again.';
          button.disabled = false;
        }
      } catch {
        message.textContent = 'Unable to reach VoocHealth. Check your connection and try again.';
        button.disabled = false;
      }
    });
  </script>
</body>
</html>`;
