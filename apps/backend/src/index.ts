import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { setDatabaseBinding } from './db';
import { auth } from './modules/auth';
import { user } from './modules/user';

export const app = new Elysia()
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
  .use(
    swagger({
      path: '/swagger',
      documentation: {
        info: {
          title: 'Fitwear Edge API',
          version: '1.0.0',
          description: 'High-performance fitness backend powered by Elysia on Cloudflare Workers and D1.',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'Token',
              description: 'Provide session token as Bearer token.',
            },
          },
        },
      },
    })
  )
  .use(auth)
  .use(user)
  .get('/', () => ({
    name: 'Fitwear Backend API',
    status: 'online',
    framework: 'ElysiaJS',
    docs: '/swagger',
    openapi: '/swagger/json',
  }));

export default {
  async fetch(request: Request, env: { DB?: D1Database }, ctx?: any) {
    if (env) {
      setDatabaseBinding(env);
    }
    return app.fetch(request);
  },
};
