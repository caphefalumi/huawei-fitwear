import { Elysia } from 'elysia';
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';
import { cors } from '@elysiajs/cors';
import { setDatabaseBinding } from './db';
import { fitwearOpenapi } from './openapi-config';
import { auth } from './modules/auth';
import { user } from './modules/user';

export function buildFitwearApp() {
  return new Elysia({ adapter: CloudflareAdapter })
    .use(
      cors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
        credentials: true,
      })
    )
    .use(fitwearOpenapi)
    .use(auth)
    .use(user)
    .get('/', () => ({
      name: 'Fitwear Backend API',
      status: 'online',
      framework: 'ElysiaJS',
      docs: '/swagger',
      openapi: '/swagger/json',
    }));
}

export const app = buildFitwearApp().compile();

export default {
  async fetch(request: Request, env: import('./db').WorkerBindings) {
    setDatabaseBinding(env);
    return app.fetch(request);
  },
};
