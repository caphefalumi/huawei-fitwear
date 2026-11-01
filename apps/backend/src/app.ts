import { Elysia } from 'elysia';
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';
import { cors } from '@elysiajs/cors';
import { fitwearOpenapi } from './openapi-config';
import { auth } from './modules/auth';
import { user } from './modules/user';
import { foods } from './modules/foods';
import { targets } from './modules/targets';
import { meals } from './modules/meals';
import { exercises } from './modules/exercises';
import { workouts } from './modules/workouts';
import { health } from './modules/health';
import { mealAnalysis } from './modules/meals/analysis';

export function buildFitwearApp() {
  return new Elysia({ adapter: CloudflareAdapter })
    .use(
      cors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
        credentials: false,
      })
    )
    .use(fitwearOpenapi)
    .use(auth)
    .use(user)
    .use(foods)
    .use(targets)
    .use(meals)
    .use(mealAnalysis)
    .use(exercises)
    .use(workouts)
    .use(health)
    .get('/', () => ({
      name: 'Fitwear Backend API',
      status: 'online',
      framework: 'ElysiaJS',
      docs: '/swagger',
      openapi: '/swagger/json',
    }));
}

export const app = buildFitwearApp().compile();
