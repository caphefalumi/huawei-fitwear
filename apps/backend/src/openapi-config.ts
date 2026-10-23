import { openapi } from '@elysia/openapi';

export const fitwearOpenapi = openapi({
  path: '/swagger',
  specPath: '/swagger/json',
  provider: 'scalar',
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
});
