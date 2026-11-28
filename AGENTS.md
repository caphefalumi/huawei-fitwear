# VoocHealth Monorepo Agent Guide

This repository contains two Bun workspaces for a dual-device fitness ecosystem plus an independent HarmonyOS watch app. Mobile and backend share the root dependency installation and lint/format tooling; each keeps its own application dependencies, tests, and build pipeline. The watch app remains independent.

---

## Architecture Boundaries

1. **`apps/mobile`**: React Native (Expo SDK 57, Expo Router, React 19).
   - Package manager: **Bun** (`bun.lock` present).
   - Role: UI, workout state, data aggregation, history.
   - Code location: `apps/mobile/src/` (feature-based: `src/features/<feature>/`).
   - Never create or edit `ios/` or `android/` directories directly; Expo uses Continuous Native Generation (CNG) via `app.json`.

2. **`apps/watch`**: ArkTS (HarmonyOS NEXT, API 11+ / SDK `6.1.1(24)`).
   - Toolchain: **Huawei DevEco Studio** / Hvigor.
   - Package manager: **ohpm** (`oh-package.json5`).
   - Role: Sensor sampling (IMU, heart rate), wearable UI, haptics.
   - Never run `bun`, `npm`, or node tools inside `apps/watch`.
   - Code location: `apps/watch/entry/src/main/ets/` (feature-based: `ets/features/<feature>/`, hub in `ets/pages/`).

3. **`apps/backend`**: ElysiaJS on Cloudflare Workers (Bun runtime, custom auth, Drizzle ORM, D1 SQLite).
   - Package manager: **Bun**.
   - Role: Edge API gateway with application-managed email/password authentication and Cloudflare D1 data layer via Drizzle ORM.
   - Code location: `apps/backend/src/` (Drizzle schema in `apps/backend/src/db/schema.ts`).

---

## Commands & Workflows

### Root Workspace Commands

Run from repository root:

```bash
bun install                  # Install root & workspace dependencies
bun start                    # Start Expo dev server (apps/mobile)
bun android                  # Run mobile on Android emulator/device
bun ios                      # Run mobile on iOS simulator (macOS)
bun web                      # Run mobile in browser
bun lint                     # Lint mobile and backend workspaces
```

### Git Workflow (Required)

- **Branch automatically**: Before implementation, create a descriptive task branch such as `fix/profile-keyboard-motion`, `feat/<feature>`, or `chore/<task>`. Reuse an existing branch only when it belongs to the same task. Never implement directly on `main` or `master`.
- **Commit and push frequently**: At each small, coherent milestone, run the relevant checks, commit the verified changes, and push immediately. Do not wait until the entire task is finished or batch all work into one final commit/push.
- **No routine confirmation**: Creating task branches, making task-scoped commits, and pushing them are authorized by default. Use `git push -u origin HEAD` for the first push and `git push` afterward.
- **Open a pull request automatically**: After pushing a task branch, check for an existing PR for that branch; otherwise, read the repository PR template, fill every section with accurate change and verification details, and create a PR targeting `main` with `gh pr create`. Do not leave template placeholders or unchecked items unexplained. If GitHub CLI or authentication fails, report the blocker and provide the pushed branch URL.
- **PR monitoring is optional**: Checking CI, reviewing completed logs, and monitoring post-merge workflows are recommended when useful, not prerequisites for handing off a task. Report the PR link and any known pending or failed checks without waiting for them. Stop monitoring when asked.
- **Before merging**: Confirm required checks have passed and the PR is mergeable. Inspect available test logs for unexpected errors, including `console.error` and React `act(...)` warnings. Fix actionable failures rather than suppressing them. Do not merge automatically if doing so would require waiting for checks or continuing monitoring after a handoff.
- **Always use Conventional Commits**: Every commit message and every pull request title, without exception, follows Conventional Commits: `<type>(<optional scope>): <summary>`, for example `fix(mobile): resolve animation test warning`. Use the standard types (`feat`, `fix`, `test`, `docs`, `chore`, `ci`, `refactor`, `perf`, `style`, `build`). A plain-English title such as `Replace X with Y` is not acceptable; write `test(e2e): replace X with Y`. Check the title before running `gh pr create`, and fix an existing PR's title with `gh pr edit --title` if it does not comply.
- **Resolve known merge conflicts**: If GitHub reports a conflict or that the branch is behind `origin/main`, fetch the latest main and rebase the task branch, preserving both sides' intended changes. Verify the rebase, then push the updated branch. Never force-push without explicit user approval; if a rebase requires rewriting published history, ask before pushing.
- **Preserve unrelated work**: Stage only changes belonging to the current task. Never discard or include unrelated user changes in a commit.
- **Report blockers honestly**: If verification, authentication, or pushing fails, resolve what is actionable and report the remaining blocker; never claim a commit or push succeeded without confirmation.
- **No destructive Git operations**: Do not force-push unless explicitly requested; merge through a pull request only after required checks pass.

### Mobile Development Rules (`apps/mobile`)

- **Installing packages**: ALWAYS use `npx expo install <package>` or `bunx expo install <package>` instead of direct package manager add. This resolves Expo SDK-compatible versions.
- **Routing**: Use **Expo Router**. Route screens live in `apps/mobile/app/` as thin route files. Keep feature logic in `src/features/<feature>/`, not in route files.
- **Navigation hooks**: Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- **Async React tests**: Await each state-changing async action and its rejection inside `await act(async () => { ... })`; never fire-and-forget an action inside `act` and wait for its result afterward. Await scheduled updates before leaving the boundary when necessary, assert the resulting state, and inspect test output for `act(...)` warnings rather than suppressing them.
- **Store state in tests**: Never call a store's `setState` (Zustand or similar) while a component that subscribes to it is still mounted, including "cleanup" lines at the end of a test; the update re-renders outside `act(...)` and warns. Reset shared store state in `beforeEach` instead, before anything renders, so it also runs when a test fails early. If a test must change a store mid-test to drive the UI, wrap that call in `act(() => { ... })`.
- **Pre-commit verification**:
  ```bash
  cd apps/mobile
  bunx tsc --noEmit           # Typecheck
  bun run lint                # Lint
  ```

### Watch Development Rules (`apps/watch`)

- Open in **DevEco Studio**, or use its bundled Hvigor from the command line (PowerShell, in `apps/watch`):
  ```powershell
  $env:DEVECO_SDK_HOME = "C:\Program Files\Huawei\DevEco Studio\sdk"
  $env:PATH = "C:\Program Files\Huawei\DevEco Studio\tools\node;$env:PATH"
  $hv = "C:\Program Files\Huawei\DevEco Studio\tools\hvigor\bin\hvigorw.bat"
  & $hv --mode module -p module=entry@default -p product=default assembleHap --no-daemon  # Build
  & $hv --mode module -p module=entry@default -p product=default test --no-daemon         # Unit tests (src/test)
  ```
  Test results land in `entry/.test/default/intermediates/test/coverage_data/test_result.txt`.
- Feature UI + domain code live together in `apps/watch/entry/src/main/ets/features/<feature>/`.
- Hub / entry pages reside in `apps/watch/entry/src/main/ets/pages/` and are registered in `main_pages.json`.
- Application lifecycle handlers reside in `apps/watch/entry/src/main/ets/entryability/`.
- Follow strict ArkTS typing conventions defined in `apps/watch/code-linter.json5`.
- Do not add web or node libraries to `apps/watch`. Use ohpm packages made for HarmonyOS, such as `@ohos/protobufjs` for the sync.
- **`@Builder` arguments do not refresh**: ArkUI reads plain values passed to a `@Builder` once, so UI that shows changing state must read `this.*` inside the builder or be a `@ComponentV2` with `@Param` fields. A `ForEach` that renders a builder needs a key that includes the values shown.

### Phone ↔ Watch Sync Rules

Read `docs/watch/phone-sync.md` before changing the Bluetooth sync.

- **One protocol, two files**: `apps/mobile/src/features/watch/protocol.ts` and `apps/watch/entry/src/main/ets/features/link/SyncProtocol.ets` mirror each other. Change both in the same commit, along with the shared fixture frames in `watch-sync.test.ts` and `WorkoutSession.test.ets`.
- **Protobuf comes from `proto/sync.proto`**: after changing it, run `bun run proto:sync` and commit the generated `sync-proto.js` / `.d.ts` (phone) and `SyncProto.js` / `.d.ets` (watch). Never edit them by hand, and never renumber or reuse a field.
- **Never break an older build**: `hello.v` stays 1 and `hello` / `welcome` stay named JSON. Put a new wire format behind a new version, announced by the watch in `welcome.v` and by the phone in `hello.app`. Send it only to a peer that announces it, and keep reading the older formats.
- **Protobuf on the wire, named in code**: from version 5, every other message is protobuf; version 4 apps get JSON rows (`toRow` / `fromRow`). A new message needs a protobuf message and a row layout on both sides. Validation runs on the named form.
- **Radio input is untrusted**: validate every message read, and ignore malformed ones rather than throwing.
- **Verify both apps**: run the mobile tests and typecheck, then build the watch and run its unit tests. Tests are not evidence that the radio link works; ask for the device tests in `docs/watch/phone-sync.md` when behavior on the link changes.

---

## Agent Ground Rules

- **Only touch what exists**: Do not scaffold speculative directories, dummy protocols, or unrequested abstractions.
- **Keep diffs minimal**: Solve root problems with the fewest lines necessary.
- **Run verification**: Always execute typecheck (`bunx tsc --noEmit`) in `apps/mobile` before completing tasks touching mobile.
- **No local Docker without permission**: Use existing tools or GitHub-hosted CI for verification; do not start local Docker builds or containers unless the user explicitly requests or approves them.
