import { and, eq, exists, gt, like } from 'drizzle-orm';
import { getDb, getPasswordResetConfig, session, user, verification } from '../../db';
import { generateId, generateToken } from '../../lib/id';
import { hashPassword } from '../../lib/password';
import type { PasswordResetBody } from './index';

const IDENTIFIER_PREFIX = 'password-reset:';
const RESET_LIFETIME_MS = 30 * 60 * 1000;
const SUCCESS_MESSAGE = 'If an account exists for that email, a password reset link is on its way.';

export class InvalidPasswordResetToken extends Error {
  constructor() {
    super('Password reset token is invalid or expired.');
  }
}

async function digestToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function isPasswordResetConfigured(): boolean {
  const { apiKey, from, resetUrl } = getPasswordResetConfig();
  return Boolean(apiKey && from && resetUrl);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { apiKey, from, resetUrl } = getPasswordResetConfig();
  if (!apiKey || !from || !resetUrl) throw new Error('Password reset email is not configured.');

  const db = getDb();
  const account = await db.select({ id: user.id, email: user.email }).from(user).where(eq(user.email, email.trim().toLowerCase())).get();
  if (!account) return;

  const identifier = `${IDENTIFIER_PREFIX}${account.id}`;
  const token = generateToken();
  const tokenHash = await digestToken(token);
  const expiresAt = new Date(Date.now() + RESET_LIFETIME_MS);
  const recordId = generateId();
  await db.delete(verification).where(eq(verification.identifier, identifier)).run();
  await db.insert(verification).values({ id: recordId, identifier, value: tokenHash, expiresAt }).run();

  const link = new URL(resetUrl);
  link.searchParams.set('token', token);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [account.email],
        subject: 'Reset your Fitwear password',
        text: `Use this one-time link within 30 minutes to reset your Fitwear password: ${link.toString()}\n\nIf you did not request a reset, you can ignore this email.`,
        html: `<p>Use this one-time link within 30 minutes to reset your Fitwear password:</p><p><a href="${link.toString()}">Reset password</a></p><p>If you did not request a reset, you can ignore this email.</p>`,
      }),
    });
    if (!response.ok) throw new Error(`Resend returned HTTP ${response.status}.`);
  } catch (error) {
    await db.delete(verification).where(eq(verification.id, recordId)).run();
    throw error;
  }
}

export async function resetPassword({ token, password }: PasswordResetBody): Promise<void> {
  const db = getDb();
  const tokenHash = await digestToken(token);
  const record = await db.select({ id: verification.id, identifier: verification.identifier })
    .from(verification)
    .where(and(
      like(verification.identifier, `${IDENTIFIER_PREFIX}%`),
      eq(verification.value, tokenHash),
      gt(verification.expiresAt, new Date()),
    ))
    .get();
  if (!record || !record.identifier.startsWith(IDENTIFIER_PREFIX)) throw new InvalidPasswordResetToken();

  const userId = record.identifier.slice(IDENTIFIER_PREFIX.length);
  const hashedPassword = await hashPassword(password);
  const validToken = and(
    eq(verification.id, record.id),
    eq(verification.identifier, record.identifier),
    eq(verification.value, tokenHash),
    gt(verification.expiresAt, new Date()),
  );
  const tokenExists = exists(db.select({ id: verification.id }).from(verification).where(validToken));
  const [updated] = await db.batch([
    db.update(user).set({ password: hashedPassword, updatedAt: new Date() })
      .where(and(eq(user.id, userId), tokenExists)),
    db.delete(session).where(and(eq(session.userId, userId), tokenExists)),
    db.delete(verification).where(validToken),
  ]);
  if (!updated || updated.meta.changes !== 1) throw new InvalidPasswordResetToken();
}
export const passwordResetMessage = SUCCESS_MESSAGE;
export const passwordResetPage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Reset your Fitwear password</title>
  <style>
    body { font: 16px system-ui, sans-serif; max-width: 30rem; margin: 12vh auto; padding: 1.5rem; color: #201d1b; background: #faf8f5; }
    form { display: grid; gap: 1rem; }
    input, button { font: inherit; padding: .8rem; border: 1px solid #cfc8c3; border-radius: .6rem; }
    button { background: #a52439; color: white; border: 0; cursor: pointer; }
    p { line-height: 1.5; }
  </style>
</head>
<body>
  <h1>Reset your password</h1>
  <p>Choose a new password with at least 8 characters. Reset links expire after 30 minutes and can only be used once.</p>
  <form id="reset">
    <label>New password<input name="password" type="password" minlength="8" autocomplete="new-password" required></label>
    <button type="submit">Save new password</button>
  </form>
  <p id="message" role="status" aria-live="polite"></p>
  <script>
    const form = document.querySelector('#reset');
    const message = document.querySelector('#message');
    const token = new URLSearchParams(location.search).get('token');
    history.replaceState(null, '', location.pathname);
    if (!token) {
      form.hidden = true;
      message.textContent = 'This reset link is invalid or expired.';
    }
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button');
      button.disabled = true;
      message.textContent = 'Updating password…';
      try {
        const response = await fetch('/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password: new FormData(form).get('password') }),
        });
        const result = await response.json();
        if (response.ok) {
          message.textContent = result.message;
          form.hidden = true;
        } else {
          message.textContent = response.status === 400 || response.status === 422
            ? 'This reset link is invalid or expired.'
            : result.message || 'Unable to update your password. Please try again.';
          button.disabled = false;
        }
      } catch {
        message.textContent = 'Unable to reach Fitwear. Check your connection and try again.';
        button.disabled = false;
      }
    });
  </script>
</body>
</html>`;
