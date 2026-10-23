import { Elysia } from 'elysia';
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';
import { getAuth } from './lib/auth';

const app = new Elysia({
  adapter: CloudflareAdapter,
})
  .get('/', ({ request }) => {
    return "value"
  })
  // Mount Better Auth handler
  .all('/api/auth/*', ({ request }) => {
    const auth = getAuth();
    return auth.handler(request);
  })
  // Compile for Cloudflare Worker
  .compile();

export default app;
