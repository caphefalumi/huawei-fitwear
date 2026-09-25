# Fitwear Mobile (`apps/mobile`)

React Native application built with **Expo** and **Expo Router**, serving as the Central Brain for the Fitwear ecosystem.

---

## Download & Install Expo Go

Test and run the application on your physical device without installing Android Studio or Xcode:

1. **Install Expo Go on your phone**:
   - **Android**: Download [Expo Go on Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (or get the APK directly from [expo.dev/tools#client](https://expo.dev/tools#client)).
   - **iOS**: Download [Expo Go on Apple App Store](https://apps.apple.com/app/expo-go/id982107779).

2. **Network Requirement**:
   - Connect your phone and development computer to the **same Wi-Fi network**.

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
