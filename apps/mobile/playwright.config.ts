import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: 'http://127.0.0.1:8085',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'bun run db:migrate:local && bunx wrangler dev --local --port 8787 --var RESEND_API_KEY:test-key --var RESEND_FROM:support@example.test --var RESET_PASSWORD_URL:https://fitwear.example.test/auth/reset-password',
      cwd: '../backend',
      url: 'http://127.0.0.1:8787',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'bunx expo start --web --port 8085',
      url: 'http://127.0.0.1:8085',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: { EXPO_PUBLIC_API_URL: 'http://127.0.0.1:8787', CI: '1', EXPO_NO_TELEMETRY: '1' },
    },
  ],
});
