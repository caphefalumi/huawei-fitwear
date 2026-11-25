# VoocHealth Watch Application (`apps/watch`)

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

ArkTS files under `entry/src` are formatted on pushes to `main` with the pinned
`oxk` formatter and `.github/arkts-format.json`. The formatter runs outside the
watch workspace. Pull requests lint production ArkTS with the open-source `oxk`
linter and `.github/arkts-lint.json`; Huawei's `code-linter.json5` is not used in CI.

## Getting Started

1. Open DevEco Studio.
2. Select **Open** and choose `apps/watch`.
3. Wait for `oh_modules` resolution and project indexing.
4. **Run**:
   - Start a Wearable Emulator in **Tools > Device Manager**, or plug in a Huawei smartwatch with USB/Wi-Fi debugging enabled.
   - Click the green **Run** button or press `Shift + F10`.

## Watch UI

The app opens on `features/home/HomePage.ets`, which covers wireframe screens
W1a–W1e and W2–W4. The workout plan comes from the paired phone; debug builds
start with a sample plan so they can be tried alone. Food and favorite values are
still samples (`features/common/SampleData.ets`). Reps are entered with −/+ or the
crown (no IMU counting yet).

## Phone sync

The watch advertises a private BLE GATT service while the app is open; the phone
connects from **Watch** in the mobile app. The first time, the watch asks
**Pair phone?** and ignores everything else from that phone until you allow it.
Starting a workout on either device opens it on the other, and finished sets,
rest, skips and the end stay in step. The phone saves finished workouts.

Messages are defined in `features/link/SyncProtocol.ets`, mirrored by
`apps/mobile/src/features/watch/protocol.ts`; change both together. Limits:

- Both apps must be open. There is no background task or background BLE yet.
- The link is not encrypted at the Bluetooth level; the pairing prompt only stops
  unknown phones.
- "New cycle" from the wireframe was removed: the phone has no such concept.

## Exercise animations

The form screen plays the same GIFs as the mobile app, downloaded from
`exercise-media.tm-project.id.vn` and cached. The posters in
`resources/rawfile/exercise-loops/` are copies of
`apps/mobile/assets/exercise-loops/` and show offline. A new exercise needs an
entry in `features/media/ExerciseMedia.ets`.

Below the start screen is a **Privacy** page that clears saved data and the pairing. First launch
shows a notice, and nothing is saved until the user agrees. The workout in progress
and today's food logs survive an app restart (`features/storage/`); system backup
is off.

### Bluetooth demo

In a **debug** build, long-press the time to open the demo list, open **BLE Sync Demo**, grant Bluetooth access, and tap **Start Stream**.
In a mobile development build with Bluetooth enabled, open **BLE Sync** and connect
to the watch. The phone requests a 185-byte ATT MTU; smaller negotiated MTUs can
prevent IMU packets from fitting in a notification. The watch stops advertising
after two minutes without a connection; restart the stream to advertise again.

## Release Build

`hvigorw assembleHap -p buildMode=release` obfuscates top-level names, strips
`console` logs and hides the demo pages. Before publishing:

- Replace the debug signing config with an AppGallery Connect release profile.
- Replace the sample food data with data synced from the phone.
- Test phone sync with a physical watch and phone.
- Test crown, vibration, back gesture and battery use on a physical watch.

## Wearable Design Considerations

- **Screen Constraints**: Wearable displays are typically circular or compact square formats. Ensure interactive components utilize relative or center-aligned positioning.
- **Power & Battery**: High-frequency IMU sampling (accelerometer/gyroscope) should only be active while a workout session is explicitly ongoing.
- **Haptics**: Use Huawei system vibration services to provide discrete feedback when rep milestones are reached or posture warnings trigger.

## Documentation

See [`docs/README.md`](docs/README.md) for official ArkTS syntax, state management, and Sensor Kit guidelines.
