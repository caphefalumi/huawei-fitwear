import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { like } from 'drizzle-orm';
import { app, setTestDatabaseBinding } from '../helpers/test-app';
import { createTestDatabase } from '../helpers/test-db';
import { createTestKv } from '../helpers/test-kv';
import { verification } from '../../src/db/schema';
import type { Database } from '../../src/db';
const originalFetch = globalThis.fetch;

let db: Database;
let lastEmail: { to: string[]; text: string } | undefined;

function post(path: string, body: unknown, ip = '203.0.113.70') {
  return app.handle(new Request(`http://localhost${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': ip },
    body: JSON.stringify(body),
  }));
}

async function createAccount(email = 'reset@fitwear.dev') {
  const response = await post('/auth/sign-up', { email, password: 'OriginalPassword123!', name: 'Reset User' });
  expect(response.status).toBe(200);
  return (await response.json()) as { session: { token: string } };
}

async function requestReset(email: string, ip?: string) {
  return post('/auth/password-reset', { email }, ip);
}

async function getResetToken(email: string) {
  const response = await requestReset(email);
  expect(response.status).toBe(200);
  const token = new URL(lastEmail!.text.match(/https?:\/\/[^\s]+/)![0]).searchParams.get('token');
  expect(token).toMatch(/^[a-f0-9]{64}$/);
  return token!;
}

describe('Password reset integration', () => {
  beforeEach(() => {
    const fixture = createTestDatabase();
    db = fixture.db;
    lastEmail = undefined;
    setTestDatabaseBinding({
      DB: fixture.d1,
      fitwear_kv: createTestKv(),
      RESEND_API_KEY: 'test-resend-key',
      RESEND_FROM: 'Fitwear <support@example.test>',
      RESET_PASSWORD_URL: 'https://fitwear.example.test/auth/reset-password',
    });
    globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.headers).toEqual({ Authorization: 'Bearer test-resend-key', 'Content-Type': 'application/json' });
      lastEmail = JSON.parse(String(init?.body)) as { to: string[]; text: string };
      return Response.json({ id: 'email-test-id' });
    }) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns the same response for known and unknown addresses and sends only to the account owner', async () => {
    await createAccount();
    const unknown = await requestReset('absent@fitwear.dev');
    const unknownBody = await unknown.json();
    expect(unknown.status).toBe(200);
    expect(lastEmail).toBeUndefined();

    const known = await requestReset('RESET@fitwear.dev');
    expect(known.status).toBe(200);
    expect(await known.json()).toEqual(unknownBody);
    expect(lastEmail?.to).toEqual(['reset@fitwear.dev']);
    expect(lastEmail?.text).toContain('https://fitwear.example.test/auth/reset-password?token=');
    const stored = await db.select({ value: verification.value }).from(verification)
      .where(like(verification.identifier, 'password-reset:%')).get();
    expect(stored?.value).not.toBe(new URL(lastEmail!.text.match(/https?:\/\/[^\s]+/)![0]).searchParams.get('token'));
  });

  it('replaces the password, revokes all sessions, and consumes the token once', async () => {
    const { session: signedUpSession } = await createAccount();
    const secondLogin = await post('/auth/sign-in', { email: 'reset@fitwear.dev', password: 'OriginalPassword123!' });
    const secondSessionToken = ((await secondLogin.json()) as { session: { token: string } }).session.token;
    const token = await getResetToken('reset@fitwear.dev');

    const reset = await post('/auth/reset-password', { token, password: 'ReplacementPassword123!' });
    expect(reset.status).toBe(200);
    expect((await reset.json()).message).toBe('Password updated. You can now sign in.');
    expect((await post('/auth/sign-in', { email: 'reset@fitwear.dev', password: 'OriginalPassword123!' })).status).toBe(401);
    expect((await post('/auth/sign-in', { email: 'reset@fitwear.dev', password: 'ReplacementPassword123!' })).status).toBe(200);
    const oldSession = await app.handle(new Request('http://localhost/auth/session', { headers: { Authorization: `Bearer ${signedUpSession.token}` } }));
    expect(oldSession.status).toBe(401);
    const secondOldSession = await app.handle(new Request('http://localhost/auth/session', { headers: { Authorization: `Bearer ${secondSessionToken}` } }));
    expect(secondOldSession.status).toBe(401);

    const reused = await post('/auth/reset-password', { token, password: 'ThirdPassword123!' });
    expect(reused.status).toBe(400);
  });

  it('does not persist a usable reset token when Resend rejects the message', async () => {
    await createAccount();
    globalThis.fetch = (async () => new Response('provider error', { status: 503 })) as typeof fetch;
    const response = await requestReset('reset@fitwear.dev');
    expect(response.status).toBe(200);
    expect((await response.json()).message).toContain('If an account exists');
    expect(await db.select({ id: verification.id }).from(verification).where(like(verification.identifier, 'password-reset:%')).all()).toHaveLength(0);
  });

  it('renders a private, non-cacheable reset form and rejects expired tokens', async () => {
    const page = await app.handle(new Request('http://localhost/auth/reset-password'));
    expect(page.status).toBe(200);
    expect(page.headers.get('Cache-Control')).toBe('no-store');
    expect(page.headers.get('Referrer-Policy')).toBe('no-referrer');
    expect(page.headers.get('Content-Security-Policy')).toContain("default-src 'none'");

    await createAccount();
    const token = await getResetToken('reset@fitwear.dev');
    await db.update(verification).set({ expiresAt: new Date(Date.now() - 1000) }).where(like(verification.identifier, 'password-reset:%')).run();
    const response = await post('/auth/reset-password', { token, password: 'ReplacementPassword123!' });
    expect(response.status).toBe(400);
  });

  it('requires email configuration and rate-limits reset requests', async () => {
    const limiter = createTestDatabase();
    setTestDatabaseBinding({ DB: limiter.d1, fitwear_kv: createTestKv() });
    const unavailable = await requestReset('absent@fitwear.dev');
    expect(unavailable.status).toBe(503);

    setTestDatabaseBinding({
      DB: limiter.d1,
      fitwear_kv: createTestKv(),
      RESEND_API_KEY: 'test-resend-key',
      RESEND_FROM: 'Fitwear <support@example.test>',
      RESET_PASSWORD_URL: 'https://fitwear.example.test/auth/reset-password',
    });
    for (let index = 0; index < 5; index++) await requestReset('absent@fitwear.dev', '203.0.113.71');
    const limited = await requestReset('absent@fitwear.dev', '203.0.113.71');
    expect(limited.status).toBe(429);
    expect(limited.headers.get('Retry-After')).not.toBeNull();
  });
});
