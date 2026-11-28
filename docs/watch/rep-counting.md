# Watch rep counting

During a set of reps, the watch counts them with IMU-RepNet, a model trained on wrist
IMU data (checkpoint `repnet-seed43` of the `imu-repnet-v1` bundle). The set screen
shows `· auto` while it counts. Timed sets, rest, pauses and the form screen do not
count. Code: `apps/watch/entry/src/main/ets/features/reps/`.

## Pipeline

- `AutoReps.ets` samples the accelerometer (m/s², with gravity) and gyroscope (rad/s)
  at 100 Hz while a set is on screen. It starts from zero at each new set or after a
  pause.
- `ImuResampler.ets` puts both sensors on one 10 ms grid by their timestamps. If either
  sensor is silent for more than 0.5 s, it starts over.
- `RepCounter.ets` ports the bundle's `reference_counter.py` line by line
  (`referenceCount`). Every 0.5 s, it runs the model on the newest 12.8 s and averages
  each 0.1 s step's periodicity × rate over every window. The count is
  `floor(0.1 · Σ p·r + 0.7)`.
- `RepNet.ets` runs `resources/rawfile/repnet/imu_repnet.ms` on MindSpore Lite Kit
  (CPU, fp32). If the model cannot load or run, reps stay manual.
- Counted reps are added to the set, so −/+ and the crown still correct it. Reaching
  the target vibrates once.

## What the screen shows

The screen shows `count`, not `referenceCount`, because the reference count goes up
and down after the wrist stops. Every newer window re-scores the last seconds, and
stillness scores them lower. The model also counts any faint rhythm, such as a
0.1 m/s² sway, as reps. `count` follows four rules:

- It leaves out the newest 1 s, which is still being re-scored.
- When the bundle's end-of-set gate closes, it holds the count from 1 s before the last
  window that saw the set going on. The gate closes when the mean periodicity of a
  window's newest 2 s falls below 0.6, and reopens at 0.8.
- It never goes down.
- A 0.1 s step adds nothing unless the wrist moved in the 2 s ending with it: pooled
  std of at least 0.4 m/s² or 0.1 rad/s. Reps measure about 2 m/s².

## What Done set records

**Done set** records `finalCount()`, so a tap right after the last rep keeps it:

- If the set's gate has already closed, it records the held count.
- Otherwise it records the count without only the newest 0.5 s, never less than the
  screen shows.

## On the phone

The watch sends the set on its screen to the phone on every change, as a `reps` message:
`{ t: "reps", live: { id, pos, reps, auto } }`. `auto` is true while the wrist is being
counted. The message is separate from the session merge. It goes from the watch to the
phone only, and older apps on either side ignore it.

The phone's workout screen shows that count for the same session and set:

- A set starts at 0 on the watch. Unless the watch counts from the wrist, the phone keeps
  the target it filled in until the watch's count changes.
- Once a count is changed on the phone, the watch no longer overwrites it. The phone
  offers **Use watch count** instead.
- **Done set** on the phone records the count it shows. Done set on the watch records
  `finalCount()`, as above.
- The count is dropped when the link drops, so a stale count never stays on screen.

Code: `publishReps` in `HomePage.ets`, and `followWatch` in the phone's
`session-screen.tsx`.

## How the rules were chosen

The bundle's squat set was replayed through the reference algorithm and its ONNX model
in 92 scenarios: stopping after each rep, stopping 0.3 s late, pausing then resuming,
and standing still, each with four kinds of stillness.

| Measure (92 scenarios) | Reference count | Shown count |
|---|---|---|
| Final count wrong | 24 | 4 |
| Times the count went down | 65 | 0 |
| Reps shown then taken back | 41 | 0 |

The 4 misses are sets paused for 4 s after rep 3 and then finished, which end one
short. The set was also stopped at 61 arbitrary points: the reference count went down
28 times, and the shown count never did.

For **Done set**, taps 0–5 s after each of the 10 reps recorded the right count in 360
of 360 replays. Taps during 1–15 s of standing still recorded 0. Recording the shown
count instead missed the last rep in 36 of those 360, all for taps within 0.25 s.

## Model file

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
`imu_repnet.json`. Copy them into `RepCounter.ets`, and copy its test vectors into
`apps/watch/entry/src/ohosTest/resources/rawfile/repnet/`.

## Tests

- **Local unit tests** (`apps/watch/entry/src/test/RepCounter.test.ets`) compare
  preprocessing and counting with values from the reference algorithm. They also test
  the display rules, the Done set count and the resampler.
- **Device test** (`apps/watch/entry/src/ohosTest/ets/test/RepNet.test.ets`): runs the
  shipped model on MindSpore Lite.
  - It checks the bundle's 4 test windows, within 1e-4.
  - It checks the bundle's squat set, which must match all 34 counts after each
    0.5 s chunk and end at 10.
  - It then adds 10 s of slow sway. The shown and recorded counts must follow the
    evaluated rules hop by hop and hold at 10, and a tap right as the last rep ends
    must record 10 while the screen shows 9.
- **Emulator results** (HarmonyOS 6.1.1 wearable):
  - The largest window error is 2.5e-5.
  - A window takes about 70–150 ms. That timing is from an x86 emulator, not a watch.
  - Each model call holds the UI thread for under 6 ms, because inference runs on
    MindSpore Lite's own thread.
  - The emulator has no IMU, so live counting needs a physical watch.

## Limits

- **From the model's handout:**
  - It was trained only on MM-Fit (10 exercises, mostly 10-rep sets), so accuracy on
    other exercises is unmeasured.
  - Alternating-arm exercises count only the watch arm's reps.
- **From the display rules:**
  - Each rep shows on screen about 0.5 s after it ends, though **Done set** records
    it sooner.
  - Exercises where the watch wrist stays still (leg press, calf raises) count
    nothing.
- **Untested:** counts per exercise, counting with the screen off, and battery use at
  100 Hz all need a physical watch.
