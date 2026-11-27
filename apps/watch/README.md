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
from the wrist (see [Rep counting](#rep-counting)) and can be corrected with −/+ or
the crown.

## Rep counting

During a set of reps, the watch counts them with IMU-RepNet, a model trained on
wrist IMU data (checkpoint `repnet-seed43` of the `imu-repnet-v1` bundle). The set
screen shows `· auto` while it counts. Timed sets, rest, pauses and the form screen
do not count.

- `features/reps/AutoReps.ets` samples the accelerometer (m/s², with gravity) and
  gyroscope (rad/s) at 100 Hz while a set is on screen, and starts from zero at each
  new set or after a pause.
- `ImuResampler.ets` puts both sensors on one 10 ms grid by their timestamps. If
  either sensor is silent for more than 0.5 s, it starts over.
- `RepCounter.ets` ports the bundle's `reference_counter.py` line by line
  (`referenceCount`). Every 0.5 s, it runs the model on the newest 12.8 s and averages
  each 0.1 s step's periodicity × rate over every window. The count is
  `floor(0.1 · Σ p·r + 0.7)`.
- The screen shows `count`, not `referenceCount`, because the reference count goes up
  and down after the wrist stops. Every newer window re-scores the last seconds, and
  stillness scores them lower. The model also counts any faint rhythm, such as a
  0.1 m/s² sway, as reps. `count` follows four rules:
  - It leaves out the newest 1 s, which is still being re-scored.
  - When the bundle's end-of-set gate closes, it holds the count from 1 s before the
    last window that saw the set going on. The gate closes when the mean periodicity
    of a window's newest 2 s falls below 0.6, and reopens at 0.8.
  - It never goes down.
  - A 0.1 s step adds nothing unless the wrist moved in the 2 s ending with it: pooled
    std of at least 0.4 m/s² or 0.1 rad/s. Reps measure about 2 m/s².
- Counted reps are added to the set, so −/+ and the crown still correct it. Reaching
  the target vibrates once.
- `RepNet.ets` runs `resources/rawfile/repnet/imu_repnet.ms` on MindSpore Lite Kit
  (CPU, fp32). If the model cannot load or run, reps stay manual.

The `.ms` file (SHA-256 `5cdb429c…83dc`) is the bundle's `imu_repnet.onnx` (SHA-256
`fe8f1f09…f35b`) converted as the
[OpenHarmony conversion guide](https://gitcode.com/openharmony/docs/blob/master/en/application-dev/ai/mindspore/mindspore-lite-converter-guidelines.md)
describes. Use the converter that matches the watch's inference engine, which is
MindSpore Lite 2.7.0 on HarmonyOS 6.1.1. A newer converter's model still runs, but the
engine logs a version warning. The converter runs on Linux x86-64 (WSL works):

```bash
curl -LO https://ms-release.obs.cn-north-4.myhuaweicloud.com/2.7.0/MindSporeLite/lite/release/linux/x86_64/mindspore-lite-2.7.0-linux-x64.tar.gz
echo "8bb1097100c9fec12675670ba2d4264a2cd6da3a9be093eb56631d00fc0c455b  mindspore-lite-2.7.0-linux-x64.tar.gz" | sha256sum -c
tar -xzf mindspore-lite-2.7.0-linux-x64.tar.gz
export LD_LIBRARY_PATH=$PWD/mindspore-lite-2.7.0-linux-x64/tools/converter/lib:$LD_LIBRARY_PATH
./mindspore-lite-2.7.0-linux-x64/tools/converter/converter/converter_lite \
  --fmk=ONNX --modelFile=imu_repnet.onnx --outputFile=imu_repnet
chmod u+w imu_repnet.ms   # written read-only; hvigor cannot replace a read-only copy
cp imu_repnet.ms <repo>/apps/watch/entry/src/main/resources/rawfile/repnet/
```

A retrained model brings new constants (`theta`, `offset`, floors) in its
`imu_repnet.json`. Copy them into `RepCounter.ets` and copy its test vectors into
`src/ohosTest/resources/rawfile/repnet/`.

Checks:

- Local unit tests (`src/test/RepCounter.test.ets`) compare preprocessing and counting
  with values from the reference algorithm. They also test the four display rules and
  the resampler.
- The device test (`src/ohosTest/ets/test/RepNet.test.ets`) runs the shipped model on
  MindSpore Lite. It checks the bundle's 4 test windows (within 1e-4) and its squat
  set, which must match all 34 counts after each 0.5 s chunk and end at 10. It then
  adds 10 s of slow sway, and the shown count must follow the evaluated rules hop by
  hop and hold at 10. On the
  HarmonyOS 6.1.1 wearable emulator the largest window error is 2.5e-5, and a window
  takes about 70–150 ms. That timing is from an x86 emulator, not a watch.
  The emulator has no IMU, so live counting needs a physical watch.

The display rules were chosen by replaying the bundle's squat set in 92 scenarios:
stopping after each rep, pausing, and standing still, each with four kinds of
stillness. Results over those 92 scenarios:

| Measure (92 scenarios) | Reference count | Shown count |
|---|---|---|
| Final count wrong | 24 | 4 |
| Times the count went down | 65 | 0 |
| Reps shown then taken back | 41 | 0 |

The 4 misses are sets paused for 4 s after rep 3 and then finished, which end one short.
The set was also stopped at 61 arbitrary points: the reference count went down 28
times, and the shown count never did.

Limits:

- From the model's handout: it was trained only on MM-Fit (10 exercises, mostly
  10-rep sets), so accuracy on other exercises is unmeasured. Alternating-arm
  exercises count only the watch arm's reps.
- From the display rules: each rep shows about 0.5 s after it ends, so tapping
  **Done set** sooner after the last rep records one fewer. Exercises where the
  watch wrist stays still (leg press, calf raises) count nothing.
- Untested: counting with the screen off, and battery use at 100 Hz, need a physical
  watch.

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
- Test rep counting on a physical watch: counts per exercise, screen off, and battery.

## Wearable Design Considerations

- **Screen Constraints**: Wearable displays are typically circular or compact square formats. Ensure interactive components utilize relative or center-aligned positioning.
- **Power & Battery**: High-frequency IMU sampling (accelerometer/gyroscope) should only be active while a workout session is explicitly ongoing.
- **Haptics**: Use Huawei system vibration services to provide discrete feedback when rep milestones are reached or posture warnings trigger.

## Documentation

See [`docs/README.md`](docs/README.md) for official ArkTS syntax, state management, and Sensor Kit guidelines.
