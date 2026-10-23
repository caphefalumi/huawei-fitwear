import { test, expect } from '@playwright/test';

test.describe('E2E: Interactive Swagger / Scalar API Specification', () => {
  test('OpenAPI JSON endpoint should return valid schema with all required endpoints', async ({ request }) => {
    const res = await request.get('/swagger/json');
    expect(res.status()).toBe(200);

    const spec = await res.json();
    expect(spec.openapi).toMatch(/^3\./);
    expect(spec.info.title).toBe('Fitwear Edge API');

    const paths = Object.keys(spec.paths);
    expect(paths).toContain('/auth/sign-up');
    expect(paths).toContain('/auth/sign-in');
    expect(paths).toContain('/auth/session');
    expect(paths).toContain('/auth/update-user');
    expect(paths).toContain('/auth/sign-out');
    expect(paths).toContain('/user/me');
  });

  test('Documentation page should load with correct title and API configuration', async ({ page }) => {
    await page.goto('/swagger');

    await expect(page).toHaveTitle(/Fitwear Edge API/i);

    const apiRef = page.locator('#api-reference');
    await expect(apiRef).toBeAttached();
    await expect(apiRef).toHaveAttribute('data-url', 'swagger/json');
  });
});
