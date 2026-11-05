# Meal Live Camera Report

## What changed

- `src/features/camera/image-picker.ts`: extracted base64 sniff (jpeg/png) + 7MB guard into exported `validatePickedImage(uri, base64)`. `pickImage` reuses it, no duplicate logic.
- `src/features/camera/index.ts`: re-exports `validatePickedImage`.
- `src/features/meals/capture-screen.tsx`: replaced `ScrollView` + system-camera `pickImage(true)` with flex no-scroll layout:
  - `CameraView` (expo-camera, `facing="back"`) live in `flex:1` preview area via `useCameraPermissions`.
  - Permission loading: blank preview. Not granted: empty state + `Allow camera access` button + library chip below (`pickImage(false)`).
  - Shutter (`Take meal photo` kept) calls `takePictureAsync({base64:true, quality:0.7})`, validates via `validatePickedImage`. Captured image shows static preview + `Retake` overlay back to live.
  - Bottom cluster: error (alert, max 2 lines) + shutter/library row + single-line description (`Optional meal description` kept, `maxLength={120}`) + privacy footnote (same copy, 2 lines) + `Analyze photo` primary + `Enter meal manually` secondary (compact 46px).
  - Untouched: tutorial Sheet, analyze/manual flow, privacy copy, a11y labels.
- `tests/capture-tutorial.test.tsx`: mocked `expo-camera` (`CameraView` forwardRef exposing `takePictureAsync`, `useCameraPermissions` per-test). Rewrote photo tests to shutter-capture flow; added retake-to-live, capture-failure + library fallback, denied-permission tests. Old tutorial/order tests kept.

## Verification

- `bunx tsc --noEmit`: pass.
- `bun run lint` (oxlint): pass.
- `bunx jest tests/capture-tutorial.test.tsx --no-coverage`: 8/8 pass.

## Files

- apps/mobile/src/features/camera/image-picker.ts
- apps/mobile/src/features/camera/index.ts
- apps/mobile/src/features/meals/capture-screen.tsx
- apps/mobile/tests/capture-tutorial.test.tsx

## Concerns

- Real-device camera untested (jest mock only); verify on dev build: permission grant/deny, shutter capture, retake.
- `CameraView` mounts only when granted and no photo selected; rapid retake taps guarded by `busy` only for analyze, double-shutter could overlap — `takePictureAsync` concurrent calls untested on device.
- Single-line description truncates long ingredient notes at 120 chars; acceptable per spec, revisit if users complain.
- Old `allowsEditing` crop step from system camera gone; captured photos go unedited to Analyze.
