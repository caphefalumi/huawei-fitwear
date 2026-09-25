# Fitwear Monorepo Agent Guide

This repository contains two independent sibling applications for a dual-device fitness ecosystem. They do not share JS dependencies, node_modules, or build pipelines.

---

## Architecture Boundaries

1. **`apps/mobile`**: React Native (Expo SDK 57, Expo Router, React 19).
   - Package manager: **Bun** (`bun.lock` present).
   - Role: UI, workout state, data aggregation, history.
   - Code location: `apps/mobile/src/`.
   - Never create or edit `ios/` or `android/` directories directly; Expo uses Continuous Native Generation (CNG) via `app.json`.

2. **`apps/watch`**: ArkTS (HarmonyOS NEXT, API 11+ / SDK `6.1.1(24)`).
   - Toolchain: **Huawei DevEco Studio** / Hvigor.
   - Package manager: **ohpm** (`oh-package.json5`).
   - Role: Sensor sampling (IMU, heart rate), wearable UI, haptics.
   - Never run `bun`, `npm`, or node tools inside `apps/watch`.
   - Code location: `apps/watch/entry/src/main/ets/`.

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
bun lint                     # Lint mobile workspace
```

### Mobile Development Rules (`apps/mobile`)

- **Installing packages**: ALWAYS use `npx expo install <package>` or `bunx expo install <package>` instead of direct package manager add. This resolves Expo SDK-compatible versions.
- **Routing**: Use **Expo Router**. Route screens live in `apps/mobile/src/app/`. Do not put helper functions or shared components inside `src/app/`.
- **Navigation hooks**: Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- **Pre-commit verification**:
  ```bash
  cd apps/mobile
  bunx tsc --noEmit           # Typecheck
  bun run lint                # Lint
  ```

### Watch Development Rules (`apps/watch`)

- Open exclusively in **DevEco Studio**.
- Wearable pages and components reside in `apps/watch/entry/src/main/ets/pages/`.
- Application lifecycle handlers reside in `apps/watch/entry/src/main/ets/entryability/`.
- Follow strict ArkTS typing conventions defined in `apps/watch/code-linter.json5`.
- Do not add web or node libraries to `apps/watch`.

---

## Agent Ground Rules

- **Only touch what exists**: Do not scaffold speculative directories, dummy protocols, or unrequested abstractions.
- **Keep diffs minimal**: Solve root problems with the fewest lines necessary.
- **Run verification**: Always execute typecheck (`bunx tsc --noEmit`) in `apps/mobile` before completing tasks touching mobile.
