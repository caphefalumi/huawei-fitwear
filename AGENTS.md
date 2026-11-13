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
- **Open a pull request automatically**: After pushing a task branch, check for an existing PR for that branch; otherwise, read the repository PR template, fill every section with accurate change and verification details, and create a PR targeting `main` with `gh pr create`. Do not leave template placeholders or unchecked items unexplained. If GitHub CLI or authentication fails, report the blocker and provide the pushed branch URL. After required checks pass and the PR is mergeable, merge it automatically and monitor the resulting workflows.
- **Resolve CI blockers before reporting**: Inspect completed test logs for `console.error`, React `act(...)` warnings, and other unexpected errors even when checks pass. Investigate the stack, fix actionable causes, rerun affected checks, push, and inspect fresh logs; then merge and monitor workflows. Never merely refuse a requested merge when the cause is actionable, suppress warnings, or merge before investigation is complete.
- **Use conventional PR titles**: Write pull request titles in Conventional Commits format, for example `fix(mobile): resolve animation test warning`.
- **Monitor merge conflicts**: After every push, check the task PR's mergeability against the latest `origin/main`. If GitHub reports a conflict or the branch is behind `origin/main`, fetch the latest main and rebase the task branch, preserving both sides' intended changes. Verify the rebase, then push the updated branch. Never force-push without explicit user approval; if a rebase requires rewriting published history, ask before pushing.
- **Preserve unrelated work**: Stage only changes belonging to the current task. Never discard or include unrelated user changes in a commit.
- **Report blockers honestly**: If verification, authentication, or pushing fails, resolve what is actionable and report the remaining blocker; never claim a commit or push succeeded without confirmation.
- **No destructive Git operations**: Do not force-push unless explicitly requested; merge through a pull request only after required checks pass.

### Mobile Development Rules (`apps/mobile`)

- **Installing packages**: ALWAYS use `npx expo install <package>` or `bunx expo install <package>` instead of direct package manager add. This resolves Expo SDK-compatible versions.
- **Routing**: Use **Expo Router**. Route screens live in `apps/mobile/app/` as thin route files. Keep feature logic in `src/features/<feature>/`, not in route files.
- **Navigation hooks**: Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- **Pre-commit verification**:
  ```bash
  cd apps/mobile
  bunx tsc --noEmit           # Typecheck
  bun run lint                # Lint
  ```

### Watch Development Rules (`apps/watch`)

- Open exclusively in **DevEco Studio**.
- Feature UI + domain code live together in `apps/watch/entry/src/main/ets/features/<feature>/`.
- Hub / entry pages reside in `apps/watch/entry/src/main/ets/pages/` and are registered in `main_pages.json`.
- Application lifecycle handlers reside in `apps/watch/entry/src/main/ets/entryability/`.
- Follow strict ArkTS typing conventions defined in `apps/watch/code-linter.json5`.
- Do not add web or node libraries to `apps/watch`.

---

## Agent Ground Rules

- **Only touch what exists**: Do not scaffold speculative directories, dummy protocols, or unrequested abstractions.
- **Keep diffs minimal**: Solve root problems with the fewest lines necessary.
- **Run verification**: Always execute typecheck (`bunx tsc --noEmit`) in `apps/mobile` before completing tasks touching mobile.
- **No local Docker without permission**: Use existing tools or GitHub-hosted CI for verification; do not start local Docker builds or containers unless the user explicitly requests or approves them.
