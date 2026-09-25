# Fitwear Monorepo

Fitwear is a dual-device fitness ecosystem comprising a mobile application and a smartwatch companion application:

- **`apps/mobile`**: React Native (Expo) app serving as the **Central Brain** (computation, LLM vision, cloud sync, analytics, user UI).
- **`apps/watch`**: ArkTS (HarmonyOS NEXT) app serving as the **Sensor Agent** (real-time IMU sampling, rep detection, haptics, BLE streaming).

These sub-projects represent two independent ecosystems living as sibling directories. They do not share build tools or JS dependencies.

## Project Structure

```text
fitwear/
├── apps/
│   ├── mobile/         # React Native (Expo Router) — Central Brain
│   └── watch/          # ArkTS (HarmonyOS) — Sensor Agent (scaffold / DevEco Studio project)
├── shared/
│   ├── sync-schema/    # Canonical cross-device event schemas and protocol documentation
│   └── docs/           # Cross-platform architecture and API contracts
├── docs/               # Monorepo and milestone documentation
├── .gitignore
├── package.json        # Root workspace configuration (scoped to apps/mobile)
└── README.md
```

## Getting Started

### 1. Mobile App (`apps/mobile`)
- **IDE**: VS Code (or Cursor)
- **Prerequisites**: Bun (or Node.js), Expo CLI
- **Quickstart**:
  ```bash
  # From monorepo root
  bun install
  bun start
  ```
  Or change directory directly:
  ```bash
  cd apps/mobile
  bun start
  ```

### 2. Watch App (`apps/watch`)
- **IDE**: [Huawei DevEco Studio](https://developer.huawei.com/consumer/en/deveco-studio/) (API 11+ / HarmonyOS NEXT)
- **Prerequisites**: HarmonyOS SDK and DevEco Studio toolchain
- **How to Open**:
  1. Launch DevEco Studio.
  2. Select **Open** and point to `apps/watch`.
  3. Let DevEco Studio resolve `oh_modules` and configure your local toolchain / signing certificates.
  4. See [`apps/watch/README.md`](apps/watch/README.md) for details on expected pages, abilities, and modules.

## Cross-Device Communication Protocol

Data exchange across Bluetooth Low Energy (BLE) / Huawei Health Kit bridges follows the single source of truth defined in:

👉 [`shared/sync-schema/`](shared/sync-schema/)

- JSON Schema: [`shared/sync-schema/sync-schema.json`](shared/sync-schema/sync-schema.json)
- Synchronization Guide: [`shared/sync-schema/sync-schema.md`](shared/sync-schema/sync-schema.md)
- Mobile Interfaces: `apps/mobile/src/types/sync.ts`
- Watch Models: `apps/watch/entry/src/main/ets/sync/SyncModels.ets`
