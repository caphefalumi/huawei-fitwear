import { describe, expect, it, beforeEach } from 'bun:test';
import { app } from '../../src/index';
import { setDatabaseBinding } from '../../src/db';
import { createTestDatabase } from '../helpers/test-db';

describe('Integration Test: User API Endpoints', () => {
  beforeEach(() => {
    const { d1 } = createTestDatabase();
    setDatabaseBinding({ DB: d1 });
  });

  it('GET /user/me should return current user when authenticated', async () => {
    const signUpRes = await app.handle(
      new Request('http://localhost/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'profile@fitwear.dev',
          password: 'Password123!',
          name: 'Profile Tester',
        }),
      })
    );
    const { session } = await signUpRes.json();

    const meRes = await app.handle(
      new Request('http://localhost/user/me', {
        headers: { Authorization: `Bearer ${session.token}` },
      })
    );

    expect(meRes.status).toBe(200);
    const user = await meRes.json();
    expect(user.email).toBe('profile@fitwear.dev');
    expect(user.name).toBe('Profile Tester');
  });

  it('GET /user/me should return 401 when unauthenticated', async () => {
    const res = await app.handle(new Request('http://localhost/user/me'));
    expect(res.status).toBe(401);
  });
});
