---
name: maestro-android-debugging
description: Diagnoses VoocHealth Android Maestro E2E failures using CI screenshots, command traces, logcat, and real mutation behavior. Use for failing fitness or error-messages flows, splash-screen hangs after clearState, offline auth forms stuck pending, reset-field clearing failures, and emulator-versus-CI discrepancies.
---

# Android Maestro debugging

Fix the evidenced cause, not the last assertion. A valid YAML file or mocked screen test does not prove an Android flow works.

## Project entry points

- `.github/workflows/mobile-e2e.yml`: build, emulator configuration, selected flows, artifact upload.
- `apps/mobile/tests/e2e/fitness.yaml`: authenticated lifecycle and session restoration.
- `apps/mobile/tests/e2e/error-messages.yaml`: validation, incorrect credentials, offline sign-in and password reset.
- `apps/mobile/src/features/auth/auth-hooks.tsx`: real auth mutations and provider state.
- `apps/mobile/src/features/auth/password-reset-panel.tsx`: reset-field focus behavior.
- `apps/mobile/src/lib/query-client.ts` and `apps/mobile/src/lib/api.ts`: connectivity gating, request timeout, error mapping.
- `apps/mobile/tests/auth-store.test.tsx`: provider-level regression tests.

Read the current files before editing; these locations are not permission to assume their implementation is unchanged. Follow repository branching, verification, and PR rules. Preserve unrelated changes and local artifacts.

## 1. Identify the exact failing run

From the repository root:

```bash
gh run list --workflow mobile-e2e.yml --limit 5 --json databaseId,headBranch,headSha,status,conclusion,url
```

Set `RUN_ID` to the relevant run ID. Record its commit SHA, selected flows, run attempt, and failing step:

```bash
gh run view "$RUN_ID" --json headSha,jobs
```

Treat the supplied failure as evidence; do not rerun merely to confirm it. Do not change product code until a mechanism explains the failure.

## 2. Read the correct artifacts

Inspect JUnit `report.xml`, the screenshot and screen hierarchy for the failed command, the nearby Maestro log, and the matching logcat time window. Distinguish a missing element, an offscreen element, an untapped control, and a request that never settles.

**Reruns can leave multiple artifacts with the same name.** A name-only download can retrieve the previous failed attempt even when the rerun passed. List artifact metadata first:

```bash
gh api "repos/{owner}/{repo}/actions/runs/$RUN_ID/artifacts" \
  --jq '.artifacts[] | {id,name,created_at,expired}'
```

Match `created_at` to the intended attempt; numeric artifact IDs need not sort chronologically. Download the chosen artifact via its ID using the GitHub API. Verify its report timestamp and commit/attempt context before claiming success.

**Artifact privacy:** Maestro `commands.json`, command traces, screenshots, and recordings can contain real account emails, passwords, and tokens. Inspect only necessary portions. Redact values from replies and PRs; never commit raw artifacts or extract credentials into reusable examples.

## 3. Diagnose by mechanism

| Symptom                                                                     | Evidence to seek                                                                                                        | Narrow fix                                                                                                                                                                                    |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Welcome assertion times out on the system splash                            | Logcat shows `Destroy timeout`, then `Killing ... remove task` for the newly launched PID                               | Stop the previous app before clearing its data and launching. Longer waits cannot revive a killed process.                                                                                    |
| Splash remains but the process is alive                                     | JS/native initialization, auth hydration, errors, and the splash-hide boundary                                          | Investigate that startup path; do not assume every splash failure is the task-removal race.                                                                                                   |
| Offline banner appears but submit stays busy                                | Real TanStack mutation is paused; request adapter was never reached                                                     | For interactive auth that must report failures, use mutation-local `networkMode: "always"`. Preserve request timeouts and no-retry behavior. Do not change all queries or mutations globally. |
| Expected empty-email validation instead shows a network error               | Screenshot shows a leftover suffix such as `@example.com`                                                               | Maestro backspaces only before the cursor. On this reset form, preserve its autofocus-at-end position and erase without first tapping the middle of the prefilled value.                      |
| `hideKeyboard` navigates back, fails, or obscures a field                   | Compare screenshots, IME state, handwriting/floating keyboard, hardware-keyboard configuration, API level, and viewport | Match CI's input configuration. Do not patch app navigation to compensate for a different local keyboard mode.                                                                                |
| Emulator shutdown logs contain `stop: Not implemented` or snapshot warnings | They occur after Maestro already reported an assertion failure                                                          | Investigate the earlier failure, not teardown noise.                                                                                                                                          |
| CI fails before tests run                                                   | Setup/download logs show HTTP 504 or another infrastructure error                                                       | Retry the failed infrastructure job when justified; retain the original failure in the verification record. No product workaround.                                                            |

### Safe clean launch

Keep flow startup explicit, including recovery from a previous failed offline test:

```yaml
- setAirplaneMode: disabled
- stopApp
- launchApp:
    clearState: true
- extendedWaitUntil:
    visible: "Explore the app"
    timeout: 30000
```

`launchApp` already stops the app by default, but its `clearState` happens first. That is not equivalent to stopping the old activity before clearing its data. Confirm ordering with logcat, not just command names.

### Reset-field clearing

This example depends on `PasswordResetPanel` still mounting an autofocused email field with the cursor at the end:

```yaml
- extendedWaitUntil:
    visible: "Reset your password."
    timeout: 10000
- eraseText: 100
- hideKeyboard
- tapOn: "Send reset code"
- assertVisible: "Enter your email address."
```

Maestro's documented maximum erase count is 100. Check the fixture length. Do not generalize this to arbitrarily long text or non-autofocused fields. A middle-of-field tap changes the cursor; an Android selection menu may hide Select all behind overflow and is not a simpler replacement here.

## 4. Prove offline behavior below the screen mock

A screen test that mocks `signIn` to reject cannot catch a paused real mutation. Reuse the real `AuthProvider`, QueryClient wrapper, and Axios adapter test pattern:

1. Hydrate the provider with no saved session.
2. Set `onlineManager.setOnline(false)`.
3. Reject only network I/O; retain real mutation scheduling, Axios transforms, and interceptors.
4. Verify the action rejects with the classified network error, releases pending state, and does not save a session.
5. Restore connectivity; verify the completed action does not replay.
6. Restore the global online state after each test.

Cover the shared sign-in/sign-up mutation and the reset request, verification, and completion mutations when changing their network policy. Run the regression before and after the fix. Do not suppress the offline banner, skip assertions, increase timeouts, or add retries merely to make the suite green.

## 5. Verify the actual Android scenario

Use the workflow's pinned Maestro version and Android configuration. Inspect those settings rather than copying a stale version from an earlier run. Reuse/download the real release APK; never manually edit generated `android/` or `ios/` files.

A local setup can differ materially from CI: an API 36 emulator's handwriting keyboard is not evidence for API 34 keyboard behavior. On a disposable test emulator, inspect and adjust IME settings when needed; preserve settings on a reused device. Use synthetic email input for invalid-credential/offline-only checks, but use the configured dedicated account for successful fitness sign-in. Never create accounts or send reset emails unnecessarily.

Run focused tests and required gates from their documented working directories:

```bash
# Repository root
actionlint .github/workflows/mobile-e2e.yml

# apps/mobile
bunx tsc --noEmit
bun run lint
bun run test -- --runInBand tests/auth-store.test.tsx tests/login-reset.test.tsx tests/use-password-reset.test.tsx
```

Then execute the complete changed flow, not only its startup commands. For cross-flow startup changes, run **fitness followed by error-messages in the same emulator session**, with the existing assertions intact.

For CI proof, dispatch the task branch with both selections enabled:

```bash
gh workflow run mobile-e2e.yml --ref "$TASK_BRANCH" -f run_fitness=true -f run_error_messages=true
```

Identify the newly dispatched run and watch it to completion. Compare its SHA with the pushed source. A prior nightly run is not evidence for new code.

## Completion gate

- The intended run attempt's JUnit report shows both flows succeeded with zero failures.
- Required mobile typecheck, lint, relevant regression tests, and PR checks pass.
- Documentation reflects any application behavior change; temporary scripts are removed and artifacts stay untracked.
- Only task files are committed and pushed; the PR is conflict-free and contains accurate evidence.
- Report local versus CI platforms, source SHA, run/attempt link, and any infrastructure reruns. Do not claim flake-free behavior from one eventual green run. Live backend/network availability remains a dependency.

## Command references

- [Maestro launchApp](https://github.com/mobile-dev-inc/maestro-docs/blob/main/api-reference/commands-available/launchapp.md)
- [Maestro eraseText](https://github.com/mobile-dev-inc/maestro-docs/blob/main/api-reference/commands-available/erasetext.md)
- [TanStack Query network modes](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode)
