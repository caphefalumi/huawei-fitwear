# Fitwear Mobile (`apps/mobile`)

React Native application built with **Expo** and **Expo Router**, serving as the Central Brain for the Fitwear ecosystem.

## Cloudflare API integration

The API defaults to `https://fitwear.tm-project.id.vn`. To use a local backend, create `.env.local` in this directory with `EXPO_PUBLIC_API_URL=http://<computer-LAN-IP>:8787`, then restart Metro. Use `127.0.0.1` for web and your computer's LAN IP for a physical phone. Only public configuration belongs in `EXPO_PUBLIC_*`; never put API secrets there.

App accounts are separate from Expo accounts. Sign up with a real email-format address, password and birth date. Native session tokens use SecureStore; web sessions use localStorage and are validated with the server before private routes render. Signing out clears device state even when the network is unavailable.

Meals, portions, daily nutrition, profile preferences, weights, recovery schedules and workout sessions/sets use the API. Empty accounts show empty states, not seeded personal data. Camera/library images are sent to Workers AI only after tapping **Analyze photo**; review estimates before logging. Logged images are stored privately in R2 and read through authenticated requests. Manual food/label entry works independently of inference.

Forgot-password requests return the same message whether an account exists or not. Reset links are single-use, expire after 30 minutes, and open a private Cloudflare Worker reset form. The Worker requires `RESEND_API_KEY` (secret) and `RESEND_FROM` (verified sender); see [backend deployment](../../docs/backend/README.md#password-reset-email). Body composition and wearable measurements are never fabricated from weight or manual set logs.

Testing uses the `jest-expo` preset. `flow-parser` is pinned through an override because React Native's `0.327.0` package omits `dist/utils/isReservedWord.js`; `0.338.0` includes it. Revisit the override when the SDK's parser dependency is fixed.

---

## Run on a Device

This app requires a custom development build: `react-native-ble-plx` and `react-native-keyboard-controller` use native code that Expo Go does not include. Expo Go cannot load the full app. Rebuild and reinstall the development app whenever native dependencies or plugins change.

Connect the phone and development computer to the same Wi-Fi network. If the network blocks device-to-computer connections, use Expo's tunnel mode instead.
---

## Expo Account & Authentication

Logging into the same Expo account on both CLI and the Expo Go app automatically syncs local development servers under **Development servers** without needing to scan QR codes.

### 1. Create an Account

- **Web**: Register at [expo.dev/signup](https://expo.dev/signup).
- **CLI**:
  ```bash
  bunx expo register
  ```
- **Mobile (iOS/Android)**: Open **Expo Go** and tap **Sign Up**.

### 2. Log In via CLI

```bash
# Log in to your Expo account
bunx expo login

# Check logged-in user
bunx expo whoami

# Log out (if needed)
bunx expo logout
```

### 3. Log In on Mobile App (iOS / Android)

1. Open **Expo Go** on your iOS or Android device.
2. Go to the profile/account screen:
   - **iOS**: Tap the settings/profile icon in the top header.
   - **Android**: Tap the profile icon or open settings.
3. Tap **Log In** and enter your Expo credentials.
4. Active Metro dev servers (`bun start`) will automatically show under **Projects** > **Development servers**.

---

## Quickstart

### 1. Install Dependencies

From the repository root (or inside `apps/mobile`):

```bash
bun install
```

### 2. Start the Development Server

From the repository root, start Metro for the installed custom development build:

```bash
bun start
```

Open the project from the development build, not Expo Go. If the phone cannot reach Metro over the local network, run `bun run start:tunnel` instead. Do not leave `CI=true` set for interactive development; it disables Metro's file watching and Fast Refresh.

---

## Native Builds (iOS & Android)

Compile native binaries locally without Expo Go:

```bash
# Build & launch on iOS simulator / device (macOS & Xcode required)
bun run build:ios

# Build native iOS app with Release configuration (build-only)
bunx expo run:ios --configuration Release --device generic --output ./build/ios

# Build & launch on Android emulator / device
bun run build:android
```

---

## Other Run Targets

```bash
# Android Emulator (requires Android Studio)
bun run android

# iOS Simulator (macOS & Xcode required)
bun run ios

# Web Browser
bun run web
```

---

## Project Structure

```text
apps/mobile/
├── app/                     # Expo Router route files (thin re-exports only)
│   ├── (auth)/              # Authentication routes (/ and /sign-up)
│   ├── (tabs)/              # Primary bottom tabs (home, meals, workout, profile)
│   ├── _layout.tsx          # Root layout and global providers
│   └── *.tsx                # Modal and standalone screen routes
├── src/
│   ├── components/          # Shared, feature-agnostic UI (ui/ primitives, layout)
│   ├── constants/           # Palettes and compatibility aliases
│   ├── features/            # Vertical slices (domain UI, API, store, utils)
│   │   ├── auth/            # Authentication UI, API, session store, types, utils
│   │   ├── ble/             # Watch BLE integration
│   │   ├── camera/          # Camera and library image selection
│   │   ├── health/          # Health and recovery state
│   │   ├── home/            # Home, nutrition and progress UI
│   │   ├── meals/           # Meal logging, history and detail UI
│   │   ├── profile/         # Profile UI and sheets
│   │   ├── recovery/        # Recovery UI
│   │   └── workout/         # Workout plans and sessions
│   ├── hooks/               # Custom shared hooks
│   ├── lib/                 # Shared API client and storage wrappers
│   ├── theme/               # Design tokens (colors, spacing, radii)
│   └── types/               # Shared TypeScript declarations
├── assets/                  # App icons, splash screens, and images
├── app.json                 # Expo configuration & plugins
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

---

## Verification

```bash
# TypeScript check and Expo Jest unit tests
bun run typecheck
bun run test

# Native end-to-end flow (requires an Android emulator and installed app)
bun run test:e2e

# Run linter
bun run lint
```

The single Maestro flow in `tests/e2e/fitness.yaml` runs nightly at 02:00 UTC and on manual workflow dispatch; pull-request mobile checks run Jest unit tests without the emulator build. It signs up, restarts the app, verifies the session is restored, and checks the backend-backed empty meals state. It requires Maestro CLI 2.12.0, Java 17+, an Android emulator, and a local Wrangler backend with D1 migrations applied. CI provisions the backend, native build, emulator, and Maestro CLI.

Android E2E on the Ubuntu CI runner requires KVM hardware acceleration. The workflow grants access to `/dev/kvm` before building the APK and requires `-accel on`, so unavailable acceleration fails the job instead of silently falling back to slow software emulation.

### Web development

Auth routes use `Slot` on web so inactive forms are unmounted rather than hidden with retained focus. Native auth navigation keeps its stack.

If Metro reports `Requiring unknown module` from a server-render bundle, stop the existing server and run `bun run web --clear` from `apps/mobile`, then reload the browser. When `CI=true`, Metro disables file watching; unset it for normal interactive development.

Password fields on login and sign-up have accessible Show/Hide controls; toggling visibility preserves the entered value and respects disabled fields. The nutrition ring uses an explicit SVG rotation around its center instead of the library's web `origin` attribute conversion.

Save, add, and delete actions keep their labels unchanged while pending. Pending guards still prevent duplicate submissions, and failures remain visible; initial data-loading indicators are unchanged.

### Accessibility

Shared pressables expose button semantics and disabled state, default to a 48×48 minimum target, and use opacity-only feedback. Native and web tabs expose their selected state. Text-bearing controls use minimum heights and padding so system font scaling can expand them; the frequency wheel scales its row height and offers Increase/Decrease buttons plus screen-reader adjustment actions.

Sheets expose a named Close button, a heading, modal accessibility scope, and the VoiceOver escape gesture; sheet transitions respect Reduce Motion. Meal type and profile choices announce checked state. Food and workout actions include item/set context, and charts provide spoken summaries instead of relying on shapes or colors. Muted text uses `#68625C` for at least 5:1 contrast against the app's light surfaces.

Profile editing follows the grouped field/value pattern documented by [Apple Health Details](https://support.apple.com/en-us/105002) and the field-specific edit/save flow documented by [MyFitnessPal](https://support.myfitnesspal.com/hc/en-us/articles/360032272452-How-to-change-your-original-profile-information). Height uses a decimal keyboard; sex uses choices without text entry. Shared sheets use `react-native-keyboard-controller`'s `KeyboardAvoidingView` with `padding` and automatic modal offsets, driven by keyboard animation progress rather than Android's late `keyboardDidShow` event. The root `KeyboardProvider` supplies native frame updates and preloads the keyboard. Overflowing content remains scrollable, idle keyboards are not dismissed when opening a sheet, and keyboard focus is cleared when the sheet closes.

The keyboard controller contains native code: rebuild the development app after installing dependencies (`bun run build:android`, or `bun run build:ios` on macOS); restarting Metro or applying an OTA update alone is insufficient. It is not available in Expo Go. On a device, verify the sheet follows the keyboard during both opening and closing, confirm/cancel remain reachable, and opening sex selection after a height edit leaves no keyboard visible. Check Reduce Motion and the first keyboard appearance as well as repeated edits.

Guidance used: [Expo skills](https://github.com/expo/skills), [Emil Kowalski's motion/accessibility](https://github.com/emilkowalski/skills), and [Appllama native design](https://github.com/Appllama/appllama-skills). Web-only CSS rules are not applied to native screens.

Before release, check an installed development build with TalkBack and VoiceOver: traverse each tab, change profile choices/frequency, dismiss sheets, search/select/edit/delete meal items, and edit/delete workout sets. Repeat at the largest system text size on a small phone and with Reduce Motion enabled. Component tests cannot establish native focus order, spoken output, or visual clipping.

Shared sheets use a coordinated 220 ms ease-out opening (a short 24-point rise plus fade) and a faster 160 ms closing transition. The scrim fades with the card and the modal unmounts only when the exit completes, so there is no trailing backdrop. Reduce Motion skips both transitions. Profile and recovery callers retain their draft only through the exit, then unmount so reopening starts fresh. Saving still waits for success before dismissing, so failures remain visible.
