import { describe, expect, it, beforeEach } from 'bun:test';
import { app } from '../../src/index';
import { setDatabaseBinding } from '../../src/db';
import { createTestDatabase } from '../helpers/test-db';

describe('Integration Test: Auth API Endpoints', () => {
  let testD1: D1Database;

  beforeEach(() => {
    const { d1 } = createTestDatabase();
    testD1 = d1;
    setDatabaseBinding({ DB: d1 });
  });

  describe('POST /auth/sign-up', () => {
    it('should register a new user, hash password, and issue a session', async () => {
      const payload = {
        email: 'jordan@fitwear.dev',
        password: 'SecurePassword123!',
        name: 'Jordan Smith',
        heightCm: 180,
        currentWeightKg: 80,
        targetWeightKg: 75,
        activityLevel: 'moderately_active',
        fitnessGoal: 'weight_loss',
      };

      const res = await app.handle(
        new Request('http://localhost/auth/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      );

      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('jordan@fitwear.dev');
      expect(data.user.name).toBe('Jordan Smith');
      expect(data.user.heightCm).toBe(180);
      expect(data.session).toBeDefined();
      expect(data.session.token).toBeString();

      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toContain('session_token=');
    });

    it('should reject sign-up with duplicate email', async () => {
      const payload = {
        email: 'duplicate@fitwear.dev',
        password: 'Password123!',
      };

      const res1 = await app.handle(
        new Request('http://localhost/auth/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      );
      expect(res1.status).toBe(200);

      const res2 = await app.handle(
        new Request('http://localhost/auth/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      );
      expect(res2.status).toBe(400);

      const err = await res2.json();
      expect(err.message).toContain('already exists');
    });

    it('should reject invalid email format with 422', async () => {
      const res = await app.handle(
        new Request('http://localhost/auth/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'not-valid', password: 'Password123!' }),
        })
      );
      expect(res.status).toBe(422);
    });
  });

  describe('POST /auth/sign-in', () => {
    beforeEach(async () => {
      await app.handle(
        new Request('http://localhost/auth/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'member@fitwear.dev',
            password: 'CorrectPassword123!',
            name: 'Member User',
          }),
        })
      );
    });

    it('should authenticate user with valid credentials', async () => {
      const res = await app.handle(
        new Request('http://localhost/auth/sign-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'member@fitwear.dev',
            password: 'CorrectPassword123!',
          }),
        })
      );

      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.user.email).toBe('member@fitwear.dev');
      expect(data.session.token).toBeString();

      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toContain('session_token=');
    });

    it('should reject authentication with incorrect password (401)', async () => {
      const res = await app.handle(
        new Request('http://localhost/auth/sign-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'member@fitwear.dev',
            password: 'WrongPassword!',
          }),
        })
      );

      expect(res.status).toBe(401);

      const data = await res.json();
      expect(data.message).toContain('Invalid email or password');
    });

    it('should reject non-existent email (401)', async () => {
      const res = await app.handle(
        new Request('http://localhost/auth/sign-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'unknown@fitwear.dev',
            password: 'Password123!',
          }),
        })
      );

      expect(res.status).toBe(401);
    });
  });

  describe('Protected Routes: /auth/session, /auth/update-user, /auth/sign-out', () => {
    let sessionToken: string;

    beforeEach(async () => {
      const res = await app.handle(
        new Request('http://localhost/auth/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'active@fitwear.dev',
            password: 'ActivePassword123!',
            name: 'Active Member',
          }),
        })
      );
      const data = await res.json();
      sessionToken = data.session.token;
    });

    it('GET /auth/session should return active user when using Bearer auth', async () => {
      const res = await app.handle(
        new Request('http://localhost/auth/session', {
          headers: { Authorization: `Bearer ${sessionToken}` },
        })
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user.email).toBe('active@fitwear.dev');
      expect(data.session.token).toBe(sessionToken);
    });

    it('GET /auth/session should return active user when using session_token cookie', async () => {
      const res = await app.handle(
        new Request('http://localhost/auth/session', {
          headers: { Cookie: `session_token=${sessionToken}` },
        })
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user.email).toBe('active@fitwear.dev');
    });

    it('GET /auth/session should return 401 when no token is provided', async () => {
      const res = await app.handle(new Request('http://localhost/auth/session'));
      expect(res.status).toBe(401);
    });

    it('PUT /auth/update-user should update biometrics', async () => {
      const res = await app.handle(
        new Request('http://localhost/auth/update-user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            currentWeightKg: 78.5,
            targetWeightKg: 72.0,
            fitnessGoal: 'weight_loss',
          }),
        })
      );

      expect(res.status).toBe(200);
      const updated = await res.json();
      expect(updated.currentWeightKg).toBe(78.5);
      expect(updated.targetWeightKg).toBe(72.0);
      expect(updated.fitnessGoal).toBe('weight_loss');
    });

    it('POST /auth/sign-out should revoke session and block subsequent access', async () => {
      const signOutRes = await app.handle(
        new Request('http://localhost/auth/sign-out', {
          method: 'POST',
          headers: { Authorization: `Bearer ${sessionToken}` },
        })
      );
      expect(signOutRes.status).toBe(200);

      const checkRes = await app.handle(
        new Request('http://localhost/auth/session', {
          headers: { Authorization: `Bearer ${sessionToken}` },
        })
      );
      expect(checkRes.status).toBe(401);
    });
  });
});
