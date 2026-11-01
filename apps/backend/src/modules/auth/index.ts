import { Elysia, t, type Static } from 'elysia';
import { Auth, authGuard } from './service';
import { assertAuthRateLimit } from './rate-limit';
import { InvalidPasswordResetToken, isPasswordResetConfigured, passwordResetMessage, passwordResetPage, requestPasswordReset, resetPassword } from './password-reset';

export const AuthSchemas = {
  signUpBody: t.Object({
    email: t.String({ format: 'email', error: 'Valid email is required' }),
    password: t.String({ minLength: 8, error: 'Password must be at least 8 characters' }),
    name: t.Optional(t.String()),
    gender: t.Optional(t.Union([t.Literal('male'), t.Literal('female'), t.Literal('other')])),
    birthDate: t.Optional(t.String()),
    heightCm: t.Optional(t.Number({ minimum: 0 })),
    currentWeightKg: t.Optional(t.Number({ minimum: 0 })),
    targetWeightKg: t.Optional(t.Number({ minimum: 0 })),
    activityLevel: t.Optional(t.Union([
      t.Literal('sedentary'),
      t.Literal('lightly_active'),
      t.Literal('moderately_active'),
      t.Literal('very_active'),
      t.Literal('extra_active'),
    ])),
    fitnessGoal: t.Optional(t.Union([
      t.Literal('weight_loss'),
      t.Literal('maintenance'),
      t.Literal('muscle_gain'),
    ])),
    weeklySessions: t.Optional(t.Integer({ minimum: 1, maximum: 7 })),
  }),
  signInBody: t.Object({
    email: t.String({ format: 'email', error: 'Valid email is required' }),
    password: t.String({ minLength: 1, error: 'Password is required' }),
  }),
  passwordResetRequestBody: t.Object({
    email: t.String({ format: 'email', error: 'Valid email is required' }),
  }),
  passwordResetBody: t.Object({
    token: t.String({ minLength: 64, maxLength: 64, pattern: '^[a-f0-9]{64}$' }),
    password: t.String({ minLength: 8, error: 'Password must be at least 8 characters' }),
  }),
  updateUserBody: t.Object({
    name: t.Optional(t.String()),
    gender: t.Optional(t.Union([t.Literal('male'), t.Literal('female'), t.Literal('other')])),
    birthDate: t.Optional(t.String()),
    heightCm: t.Optional(t.Number({ minimum: 0 })),
    currentWeightKg: t.Optional(t.Number({ minimum: 0 })),
    targetWeightKg: t.Optional(t.Number({ minimum: 0 })),
    activityLevel: t.Optional(t.Union([
      t.Literal('sedentary'),
      t.Literal('lightly_active'),
      t.Literal('moderately_active'),
      t.Literal('very_active'),
      t.Literal('extra_active'),
    ])),
    fitnessGoal: t.Optional(t.Union([
      t.Literal('weight_loss'),
      t.Literal('maintenance'),
      t.Literal('muscle_gain'),
    ])),
    weeklySessions: t.Optional(t.Integer({ minimum: 1, maximum: 7 })),
  }),
} as const;

export type SignUpBody = Static<typeof AuthSchemas.signUpBody>;
export type SignInBody = Static<typeof AuthSchemas.signInBody>;
export type PasswordResetRequestBody = Static<typeof AuthSchemas.passwordResetRequestBody>;
export type PasswordResetBody = Static<typeof AuthSchemas.passwordResetBody>;
export type UpdateUserBody = Static<typeof AuthSchemas.updateUserBody>;

const authModels = new Elysia().model({
  'auth.signUpBody': AuthSchemas.signUpBody,
  'auth.signInBody': AuthSchemas.signInBody,
  'auth.passwordResetRequestBody': AuthSchemas.passwordResetRequestBody,
  'auth.passwordResetBody': AuthSchemas.passwordResetBody,
  'auth.updateUserBody': AuthSchemas.updateUserBody,
});

export const auth = new Elysia({
  prefix: '/auth',
  detail: { tags: ['Authentication'] },
})
  .use(authModels)
  .use(authGuard)
  .post(
    '/sign-up',
    async ({ body, cookie: { session_token } }) => {
      const res = await Auth.signUp(body);
      session_token.set({ value: res.session.token, httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
      return res;
    },
    {
      beforeHandle: ({ request, set }) => assertAuthRateLimit(request, 'sign-up', set),
      body: 'auth.signUpBody',
      detail: {
        summary: 'Register a new user account',
        description: 'Creates user, hashes password with bcrypt, and issues a 30-day session token.',
      },
    }
  )
  .post(
    '/sign-in',
    async ({ body, cookie: { session_token } }) => {
      const res = await Auth.signIn(body);
      session_token.set({ value: res.session.token, httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
      return res;
    },
    {
      beforeHandle: ({ request, set }) => assertAuthRateLimit(request, 'sign-in', set),
      body: 'auth.signInBody',
      detail: {
        summary: 'Sign in with credentials',
        description: 'Verifies email/password and returns a session token.',
      },
    }
  )
  .post(
    '/password-reset',
    async ({ body, request, set }) => {
      await assertAuthRateLimit(request, 'password-reset', set);
      if (!isPasswordResetConfigured()) {
        set.status = 503;
        return { success: false, message: 'Password reset email is not configured.' };
      }
      try {
        await requestPasswordReset(body.email);
      } catch {
        console.error('Password reset email request failed.');
      }
      return { success: true, message: passwordResetMessage };
    },
    {
      body: 'auth.passwordResetRequestBody',
      detail: {
        summary: 'Request a password reset email',
        description: 'Returns the same response whether the email is registered or not.',
      },
    }
  )
  .get(
    '/reset-password',
    () => new Response(passwordResetPage, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
        'Content-Security-Policy': "default-src 'none'; connect-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'",
        'X-Content-Type-Options': 'nosniff',
      },
    }),
    { detail: { summary: 'Render the password reset form' } }
  )
  .post(
    '/reset-password',
    async ({ body, set }) => {
      try {
        await resetPassword(body);
        return { success: true, message: 'Password updated. You can now sign in.' };
      } catch (error) {
        set.status = error instanceof InvalidPasswordResetToken ? 400 : 500;
        return {
          success: false,
          message: error instanceof InvalidPasswordResetToken
            ? 'This reset link is invalid or expired.'
            : 'Unable to update your password. Please try again.',
        };
      }
    },
    { body: 'auth.passwordResetBody', detail: { summary: 'Set a new password with a one-time reset token' } }
  )
  .get(
    '/session',
    ({ user, session }) => ({
      user,
      session: {
        id: session.id,
        token: session.token,
        expiresAt: new Date(session.expiresAt).toISOString(),
        userId: session.userId,
      },
    }),
    {
      auth: true,
      detail: {
        summary: 'Get active session details',
      },
    }
  )
  .put(
    '/update-user',
    async ({ user, body }) => Auth.updateUser(user.id, body),
    {
      auth: true,
      body: 'auth.updateUserBody',
      detail: {
        summary: 'Update user profile & biometrics',
      },
    }
  )
  .post(
    '/sign-out',
    async ({ token, cookie: { session_token } }) => {
      await Auth.signOut(token);
      delete session_token.value;
      return { success: true, message: 'Signed out successfully' };
    },
    {
      auth: true,
      detail: {
        summary: 'Sign out active session',
        description: 'Revokes the active session token in the database and clears the cookie.',
      },
    }
  );
