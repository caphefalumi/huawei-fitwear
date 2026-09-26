# Fitwear

Dual-device fitness ecosystem pairing a mobile client with a HarmonyOS smartwatch companion.

---

## Architecture

- **`apps/mobile`**: React Native (Expo) application handling user UI, workout tracking, computation, and history.
- **`apps/watch`**: ArkTS (HarmonyOS NEXT) wearable application handling real-time wrist sensor sampling (IMU) and low-latency interaction.

---

## Repository Structure

```text
huawei-fitwear/
├── apps/
│   ├── mobile/              # React Native / Expo application
│   │   ├── src/             # Application source (app, components, hooks)
│   │   ├── app.json         # Expo configuration
│   │   ├── package.json     # Mobile dependencies & scripts
│   │   ├── tsconfig.json    # TypeScript configuration
│   │   └── README.md        # Mobile & Expo Go guide
│   └── watch/               # HarmonyOS NEXT ArkTS application
│       ├── AppScope/        # Global app metadata and resources
│       ├── entry/           # Wearable entry module (EntryAbility, pages)
│       ├── build-profile.json5 # HarmonyOS target & SDK settings
│       ├── code-linter.json5   # ArkTS linter rules
│       ├── hvigorfile.ts    # Hvigor build engine script
│       ├── oh-package.json5 # HarmonyOS dependencies
│       └── README.md        # Watch-specific guide
├── package.json             # Monorepo scripts
├── AGENTS.md                # Agent guidelines & project boundaries
└── README.md
```

---

## Prerequisites

| Tool | Purpose | Requirement |
| :--- | :--- | :--- |
| **Bun** | Root package manager & scripts | v1.1+ |
| **Node.js** | Mobile runtime environment | v18+ |
| **Huawei DevEco Studio** | Watch IDE & SDK manager | 5.0+ (API 11+ / `6.1.1(24)`) |

---

## Getting Started

### 1. Root Setup

Install mobile dependencies from the monorepo root:

```bash
bun install
```

---

### 2. Mobile App (`apps/mobile`)

#### Run Development Server

```bash
# Start Metro bundler
bun start

# Or target a specific platform directly:
bun android
bun ios
bun web
```

#### Native Local Builds

```bash
bun run build:ios        # Compile and run native iOS app (macOS & Xcode required)
bun run build:android    # Compile and run native Android app
```

#### Expo Account & Device Sync (CLI & iOS/Android)

Log in to sync local Metro instances directly to Expo Go without scanning QR codes:

```bash
bunx expo login
```

For full account creation and login steps on CLI and iOS/Android, see [`apps/mobile/README.md`](apps/mobile/README.md#expo-account--authentication).

#### Verification

```bash
cd apps/mobile

# Run TypeScript checks
bunx tsc --noEmit
```

---

### 3. Watch App (`apps/watch`)

1. Open **Huawei DevEco Studio**.
2. Select **Open** and choose the `apps/watch` folder.
3. Allow DevEco Studio to resolve dependencies (`oh_modules`).
4. **Run**:
   - Launch a Wearable Emulator via **Tools** > **Device Manager**, or connect a physical Huawei Watch with Developer Options enabled.
   - Click **Run** (`Shift + F10`) to build and deploy to the watch.

For watch details, see [`apps/watch/README.md`](apps/watch/README.md).

---

## Monorepo Scripts

Available from the root directory:

| Command | Action |
| :--- | :--- |
| `bun start` | Starts the Expo dev server for `apps/mobile` |
| `bun android` | Launches the mobile app on an Android device/emulator |
| `bun ios` | Launches the mobile app on an iOS simulator |
| `bun run build:ios` | Compiles and runs the native iOS build locally |
| `bun run build:android` | Compiles and runs the native Android build locally |
| `bun web` | Launches the mobile web app in your browser |
| `bun lint` | Runs mobile code linter |

---

## Troubleshooting

- **Mobile module issues**: Run `bun install` at the root. Ensure Node.js and Bun are up to date.
- **Watch SDK error**: Verify HarmonyOS SDK `6.1.1(24)` is installed in DevEco Studio under **Tools** > **SDK Manager**.
