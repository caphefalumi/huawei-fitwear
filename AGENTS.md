# Fitwear Monorepo Agent Guide

This repository contains two independent sibling applications for a dual-device fitness ecosystem. They do not share JS dependencies, node_modules, or build pipelines.

**Read [`docs/`](./docs/README.md) before changing product behaviour, nutrition UI, or progress rings.** Start with [`docs/rings.md`](./docs/rings.md) (what each ring measures) and [`docs/product-scope.md`](./docs/product-scope.md) (in-scope modules and stack). Full capture of the course/project Office sources: [`docs/project-a-master.md`](./docs/project-a-master.md), [`docs/tech-stack-deck.md`](./docs/tech-stack-deck.md), provenance in [`docs/sources.md`](./docs/sources.md). Visual tokens live in [`DESIGN.md`](./DESIGN.md).

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
- **Theme & colors**: All colors come from `src/theme/tokens.ts` via `useAppTheme()`. No hex/rgba literals in components or screens. The watch face mock is always dark, so it reads from the `watchFace` export instead. Light theme ("Kinetic Pure Light") is cool-grey canvas, white cards lifted with `softShadow`, blue/orange/rose macros, green for on-track. Use `onColor(bg)` for glyphs on a solid fill.
- **Tab bar**: `src/app/(tabs)/_layout.tsx` is a floating pill (in flow, side margins, `bottom inset + 24` below). Keep it detached from the screen edges.
- **Progress rings** (`src/components/ui/ProgressRing.tsx`, `RestTimerRing.tsx`, `HuaweiGlanceDial.tsx`, shared `RingIcon.tsx`):
  - Icons are MaterialCommunityIcons or Ionicons, one per ring type, never reused: calories `fire`, protein `arm-flex`, carbs `grain`, fat `water`, workout `dumbbell` (swaps to `check` at 100%), rest `timer-outline`. Colors come from `theme.ringIcon.*` (icon color == ring stroke color, >= 3:1 on white).
  - Layout by size: large (>=160) icon above number + label; medium (100-159) icon above number, no label; small (<100) icon alone, value shown under the ring.
  - Everything in the center must fit inside the innermost stroke. Do not enlarge icons or text without re-checking this (the Home hero is the tight case). Text caps at 1.1x system font scale.
  - Concentric rings (Home hero, watch face): pass `icon` on each `RingData`; it renders as a fixed bead at the ring's 12 o'clock start. It does not follow the progress arc.
  - **Huawei Watch Glance Dial** (`HuaweiGlanceDial.tsx`): 3-ring open activity dial (calories red, workout yellow with runner bead, active hours blue with standing bead). Sweep angle is capped at ~248° starting at 222° to guarantee that the outer red arc never overlaps or covers the bottom-right stacked metric numbers even when goals are exceeded.
  - Icons are decorative (hidden from screen readers). Each ring is one `progressbar` with a spoken `accessibilityLabel`; "over target" is appended automatically.
  - Animations use `react-native-reanimated` with `.get()`/`.set()` (React Compiler is on) and must respect `useReducedMotion()`.
  - Verify changes on `Settings > Developer > Ring gallery` (`src/app/ring-gallery.tsx`).
- **Web & React Native Style Standards**:
  - **Shadows**: `"shadow*"` style props (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`) are deprecated on web. ALWAYS wrap platform shadow styles with `Platform.select({ web: { boxShadow: '...' }, default: { shadowColor: ... } })` or consume `softShadow` from `src/theme/tokens.ts`.
  - **pointerEvents**: The `pointerEvents` JSX prop on `<View>` is deprecated. ALWAYS specify it within the style object: `style={{ pointerEvents: 'none' }}`.
  - **Image resizeMode**: `style.resizeMode` is deprecated on `<Image>`. ALWAYS pass `resizeMode` directly as a prop: `<Image resizeMode="cover" ... />`, never inside the `style` object.
- **Pre-commit verification**:
  ```bash
  cd apps/mobile
  bunx tsc --noEmit           # Typecheck
  bun run lint                # Lint
  ```
  Lint currently reports a few errors from older code (`snap-meal.tsx`, `SkeletonBlock.tsx`, `use-color-scheme.web.ts`); don't add new ones.
- **Visual & UI Verification with Playwright**:
  ```bash
  # When verifying UI changes on web, capture a screenshot via Playwright CLI:
  npx playwright screenshot --viewport-size="600,1000" http://localhost:8081/ ./web-screenshot.png
  ```
  Follow up by inspecting the generated screenshot using the `look_at` tool to visually confirm alignment, colors, and responsive layout without relying solely on typechecks. Delete temporary screenshot files before committing.

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
