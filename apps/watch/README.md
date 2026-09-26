# Fitwear Watch Application (`apps/watch`)

ArkTS (HarmonyOS NEXT) companion application running as the **Sensor Agent** on Huawei Wearable devices.

## Module Structure

```text
apps/watch/
├── docs/                      # ArkTS & HarmonyOS reference documentation
├── AppScope/
│   ├── app.json5              # Bundle name, version, and vendor details
│   └── resources/             # Application-level icons and strings
├── entry/
│   ├── build-profile.json5    # Entry module targets and build configurations
│   ├── oh-package.json5       # Module-specific third-party packages
│   └── src/
│       ├── main/
│       │   ├── ets/
│       │   │   ├── entryability/EntryAbility.ets  # Application lifecycle handlers
│       │   │   ├── entrybackupability/             # Data backup extension
│       │   │   └── pages/Index.ets                 # Main wearable UI screen
│       │   ├── module.json5   # Device types (`wearable`), permissions, and abilities
│       │   └── resources/     # Color definitions, layouts, and graphics
│       └── ohosTest/          # Automated UI and unit test suites
├── build-profile.json5        # Project SDK targets (`targetSdkVersion: 6.1.1(24)`)
├── code-linter.json5          # ArkTS static analysis rules
├── hvigorfile.ts              # Root Hvigor build script
└── oh-package.json5           # Project-level dependencies
```

## Prerequisites

- **IDE**: [Huawei DevEco Studio](https://developer.huawei.com/consumer/en/deveco-studio/) (Version 5.0+ or compatible with API 11+ / NEXT).
- **Target OS**: HarmonyOS NEXT (`wearable` profile).
- **SDK**: API 11+ (`6.1.1(24)`).

## Getting Started

1. Open DevEco Studio.
2. Select **Open** and choose `apps/watch`.
3. Wait for `oh_modules` resolution and project indexing.
4. **Run**:
   - Start a Wearable Emulator in **Tools > Device Manager**, or plug in a Huawei smartwatch with USB/Wi-Fi debugging enabled.
   - Click the green **Run** button or press `Shift + F10`.

## Wearable Design Considerations

- **Screen Constraints**: Wearable displays are typically circular or compact square formats. Ensure interactive components utilize relative or center-aligned positioning.
- **Power & Battery**: High-frequency IMU sampling (accelerometer/gyroscope) should only be active while a workout session is explicitly ongoing.
- **Haptics**: Use Huawei system vibration services to provide discrete feedback when rep milestones are reached or posture warnings trigger.

## Documentation

See [`docs/README.md`](docs/README.md) for official ArkTS syntax, state management, and Sensor Kit guidelines.
