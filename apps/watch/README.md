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
│       │   │   └── features/home/HomePage.ets      # Main wearable UI screen
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

ArkTS is linted and formatted with [`oxk`](https://www.npmjs.com/package/@ohos-rs/oxk),
pinned in the root `package.json`. Run these from the repository root:

```bash
bun run lint:watch   # oxk lint with .github/arkts-lint.json
bun run fmt:watch    # oxk format, using apps/watch/.oxfmtrc.json
```

`apps/watch/.oxfmtrc.json` holds the ArkTS style (semicolons, single quotes) and
ignores every non-`.ets` file, so the root oxfmt leaves the DevEco JSON5 files
alone. Pull requests run `oxk lint` in the **Lint** check. Formatting is not checked
on pull requests: the Auto-format workflow formats `main` after each merge. Huawei's `code-linter.json5` is not used in CI.

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
start with a sample plan and sample food (`features/common/SampleData.ets`) so they
can be tried alone. Release builds show only what the phone sends. Reps are counted
from the wrist and can be corrected with −/+ or the crown.

## Unfinished workouts

If the wearer closes or leaves the app mid-workout, or ends early and comes back,
the watch asks **Continue** or **New cycle** (start over, discarding the unfinished
one). The phone asks the same.

## Phone sync

The watch advertises a private BLE GATT service when the app opens; the phone
connects from **Watch** in the mobile app, and reconnects by itself after the first
success. The screen stays on while advertising or connected. Advertising stops after
two minutes alone: reopen the app or tap **Connect** on the home screen. The first time, the watch asks
**Pair phone?** and ignores everything else from that phone until you allow it.
Starting a workout on either device opens it on the other, and finished sets,
rest, skips and the end stay in step. The phone saves finished workouts.

The phone also sends today's calories and macros, the targets, and up to five of the
most frequently logged meals. **Quick log** records one of those meals; once the 5 s
undo window passes, the watch sends its ID and the phone copies that meal into the
diary. A log stays on the watch until the phone's totals include it.

Messages are defined in `features/link/SyncProtocol.ets`, mirrored by
`apps/mobile/src/features/watch/protocol.ts`; change both together. Limits:

- Both apps must be running. While linked, the watch holds a `bluetoothInteraction`
  background task, and Android runs a `connectedDevice` foreground service (with a
  notification) once the watch has connected; iOS uses the Bluetooth background mode.
  A closed app does not sync. Android gives up 5 minutes after losing the watch in the
  background, and the watch stops advertising after 2 minutes alone.
- The link is not encrypted at the Bluetooth level; the pairing prompt only stops
  unknown phones.

## Exercise animations

The form screen plays the same GIFs as the mobile app, downloaded from
`exercise-media.tm-project.id.vn` and cached. The posters in
`resources/rawfile/exercise-loops/` are copies of
`apps/mobile/assets/exercise-loops/` and show offline. A new exercise needs an
entry in `features/media/ExerciseMedia.ets`.

Below the start screen is a **Privacy** page that clears saved data and the pairing. First launch
shows a notice, and nothing is saved until the user agrees. The workout in progress
the phone's nutrition figures and unsent quick logs survive an app restart
(`features/storage/`); system backup is off.

## Release Build

`hvigorw assembleHap -p buildMode=release` obfuscates top-level names, strips
`console` logs and hides the IMU sensor page. Before publishing:

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
How rep counting works is in [`docs/watch/rep-counting.md`](../../docs/watch/rep-counting.md).
