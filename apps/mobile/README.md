# Fitwear Mobile (`apps/mobile`)

React Native application built with **Expo** and **Expo Router**, serving as the Central Brain for the Fitwear ecosystem.

---

## Download & Install Expo Go

Test and run the application on your physical device without installing Android Studio or Xcode:

1. **Install Expo Go on your phone**:
   - **Android**: Download [Expo Go on Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (or get the APK directly from [expo.dev/tools#client](https://expo.dev/tools#client)).
   - **iOS**: Download [Expo Go on Apple App Store](https://apps.apple.com/app/expo-go/id982107779).

2. **Network Requirement**:
   - Connect your phone and development computer to the **same Wi-Fi network** (or log in to the same Expo account on CLI and mobile to sync automatically).

---

## Expo Account & Authentication

Logging into the same Expo account on both CLI and the Expo Go app automatically syncs local development servers under **Development servers** without needing to scan QR codes.

### 1. Create an Account

- **Web**: Register at [expo.dev/signup](https://expo.dev/signup).
- **CLI**:
  ```bash
  bunx eas-cli register
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

```bash
cd apps/mobile
bun start
```

### 3. Open in Expo Go

- **Android**: Open the **Expo Go** app, tap **Scan QR code**, and scan the QR code displayed in your terminal.
- **iOS**: Open the native **Camera** app, point it at the terminal QR code, and tap the prompt to open in **Expo Go**.

> **Note**: If your phone cannot reach your computer over local Wi-Fi, run Metro in tunnel mode:
> ```bash
> bunx expo start --tunnel
> ```

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
├── src/
│   ├── app/                 # Expo Router screens (_layout.tsx, index.tsx, explore.tsx)
│   ├── components/          # Reusable UI elements and themed components
│   ├── constants/           # Theme palettes and style tokens
│   └── hooks/               # Custom hooks (color scheme, responsive state)
├── assets/                  # App icons, splash screens, and images
├── app.json                 # Expo configuration & plugins
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

---

## Verification

```bash
# Run TypeScript type check
bunx tsc --noEmit

# Run linter
bun run lint
```
