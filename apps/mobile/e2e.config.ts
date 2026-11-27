import { mobile } from "@e2e-dev/mobile"
import type { E2EConfig } from "e2e"

const email = process.env.E2E_TEST_EMAIL
const password = process.env.E2E_TEST_PASSWORD

export default {
  targets: [
    {
      name: "android",
      engine: mobile({ platform: "android", device: process.env.E2E_ANDROID_DEVICE }),
      // CI installs the release APK with adb before the run.
      app: { bundleId: "com.fitwear.mobile", environment: "staging" },
    },
  ],
  tests: "e2e/**/*.e2e.ts",
  // One emulator and one shared staging account: run the flows in order.
  workers: 1,
  timeout: 15 * 60 * 1000,
  // Each flow changes the shared account; a retry would rerun it on top of a
  // half-finished attempt, so a failure is reported as it happened.
  retries: 0,
  video: "on",
  reporters: ["list", "junit"],
  // Undeclared until both values exist, so a local run without them fails
  // at credentials.user() with a clear message instead of at config load.
  ...(email && password ? { credentials: { e2e: { username: email, password } } } : {}),
} satisfies E2EConfig
