import { test, expect } from '@playwright/test';

test.describe('E2E: Authentication & User API Lifecycle', () => {
  const timestamp = Date.now();
  const testEmail = `e2e_user_${timestamp}@fitwear.dev`;
  const testPassword = 'E2E_SecurePassword123!';
  let sessionToken: string;

  test('sign up a new user via POST /auth/sign-up', async ({ request }) => {
    const response = await request.post('/auth/sign-up', {
      data: {
        email: testEmail,
        password: testPassword,
        name: 'Playwright E2E User',
        gender: 'male',
        heightCm: 182,
        currentWeightKg: 81.5,
        targetWeightKg: 78.0,
        activityLevel: 'very_active',
        fitnessGoal: 'muscle_gain',
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.user.email).toBe(testEmail);
    expect(body.user.name).toBe('Playwright E2E User');
    expect(body.user.heightCm).toBe(182);
    expect(body.session.token).toBeTruthy();

    sessionToken = body.session.token;
  });

  test('authenticate via POST /auth/sign-in', async ({ request }) => {
    const response = await request.post('/auth/sign-in', {
      data: {
        email: testEmail,
        password: testPassword,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.user.email).toBe(testEmail);
    expect(body.session.token).toBeTruthy();

    sessionToken = body.session.token;
  });

  test('retrieve current session via GET /auth/session', async ({ request }) => {
    const response = await request.get('/auth/session', {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.user.email).toBe(testEmail);
    expect(body.session.token).toBe(sessionToken);
  });

  test('update biometrics via PUT /auth/update-user', async ({ request }) => {
    const response = await request.put('/auth/update-user', {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      data: {
        currentWeightKg: 80.2,
        fitnessGoal: 'maintenance',
      },
    });

    expect(response.status()).toBe(200);

    const updatedUser = await response.json();
    expect(updatedUser.currentWeightKg).toBe(80.2);
    expect(updatedUser.fitnessGoal).toBe('maintenance');
  });

  test('fetch profile via GET /user/me', async ({ request }) => {
    const response = await request.get('/user/me', {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const user = await response.json();
    expect(user.email).toBe(testEmail);
    expect(user.currentWeightKg).toBe(80.2);
  });

  test('sign out via POST /auth/sign-out and verify revocation', async ({ request }) => {
    const signOutRes = await request.post('/auth/sign-out', {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    expect(signOutRes.status()).toBe(200);

    const checkRes = await request.get('/auth/session', {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    expect(checkRes.status()).toBe(401);
  });
});
