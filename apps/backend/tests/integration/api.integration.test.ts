import { describe, expect, it } from 'bun:test';
import { app } from '../helpers/test-app';

describe('Integration Test: Root & Swagger API', () => {
  it('GET / should return online status and links', async () => {
    const res = await app.handle(new Request('http://localhost/'));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe('online');
    expect(data.framework).toBe('ElysiaJS');
    expect(data.docs).toBe('/swagger');
    expect(data.openapi).toBe('/swagger/json');
  });

  it('GET /swagger/json should return valid OpenAPI 3 specification', async () => {
    const res = await app.handle(new Request('http://localhost/swagger/json'));
    expect(res.status).toBe(200);

    const spec = await res.json();
    expect(spec.openapi.startsWith('3.')).toBeTrue();
    expect(spec.info.title).toBe('Fitwear Edge API');

    const paths = Object.keys(spec.paths);
    expect(paths).toContain('/auth/sign-up');
    expect(paths).toContain('/auth/sign-in');
    expect(paths).toContain('/auth/session');
    expect(paths).toContain('/auth/update-user');
    expect(paths).toContain('/auth/sign-out');
    expect(paths).toContain('/user/me');
  });

  it('GET /unknown-path should return 404', async () => {
    const res = await app.handle(new Request('http://localhost/does-not-exist'));
    expect(res.status).toBe(404);
  });
});
