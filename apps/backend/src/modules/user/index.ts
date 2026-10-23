import { Elysia } from 'elysia';
import { authGuard } from '../auth/service';

export const user = new Elysia({
  prefix: '/user',
  detail: { tags: ['User'] },
})
  .use(authGuard)
  .get('/me', ({ user }) => user, {
    auth: true,
    detail: {
      summary: 'Get current authenticated user profile',
    },
  });
