import { Elysia } from 'elysia';
import { Auth, authGuard } from './service';
import { AuthModel } from './model';

export const auth = new Elysia({
  prefix: '/auth',
  detail: { tags: ['Authentication'] },
})
  .use(authGuard)
  .post(
    '/sign-up',
    async ({ body, cookie: { session_token } }) => {
      const res = await Auth.signUp(body);
      session_token.value = res.session.token;
      return res;
    },
    {
      body: AuthModel.signUpBody,
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
      session_token.value = res.session.token;
      return res;
    },
    {
      body: AuthModel.signInBody,
      detail: {
        summary: 'Sign in with credentials',
        description: 'Verifies email/password and returns a session token.',
      },
    }
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
      body: AuthModel.updateUserBody,
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
