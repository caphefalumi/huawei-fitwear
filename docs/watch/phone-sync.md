# Phone ↔ watch sync

The phone and the watch keep one workout session, the plan behind it, today's nutrition and
the watch's quick logs in step over Bluetooth LE. The watch is the GATT server and the phone
the client. Both sides use one characteristic: the phone writes and the watch notifies.

Code:

- Phone: `apps/mobile/src/features/watch/` (`protocol.ts`, `watch-link.ts`, `nutrition.ts`,
  `telemetry.ts`) and `apps/mobile/src/features/ble/`.
- Watch: `apps/watch/entry/src/main/ets/features/link/` (`SyncProtocol.ets`, `PhoneLink.ets`)
  and `features/ble/BleGattServerService.ets`.

The protocol is written twice, once in each app. Change both together. Shared fixture frames
check that each app reads what the other writes. They are in `watch-sync.test.ts` (phone) and
`WorkoutSession.test.ets` (watch): `FIXTURE_FRAME`, `COMPACT_PLAN_FRAME` and the `ROW_*_FRAME`s.
When a format changes, change the fixture in both files.

## Frames

Each message is JSON split into ASCII frames of the form `~id.index.total~payload`. A frame
is at most 180 bytes, or MTU − 3 when the MTU is smaller. The receiver rebuilds the message
from frames that arrive in order, and drops it if one is missing.

## Messages

| Message   | From  | When                                                      |
| --------- | ----- | --------------------------------------------------------- |
| `hello`   | phone | Every second after connecting, until the watch welcomes it. |
| `welcome` | watch | In reply to `hello`: accepted or waiting for the wearer.  |
| `plan`    | phone | When the routine changes. Skipped if the watch holds it.  |
| `session` | both  | On every change to the workout.                           |
| `reps`    | watch | On every counted rep during a set.                        |
| `day`     | phone | When today's meals or targets change.                     |
| `food`    | watch | Quick logs past their 5 s undo window.                    |
| `ack`     | both  | For each plan, session, day and food message.             |

`hello` and `welcome` are named JSON objects, such as
`{"t":"hello","v":1,"phone":"…","name":"Pixel 9","app":4}`. They stay that way because every
app version must read them.

From version 4, every other message is a row: a JSON array whose first element names it.
Rows are converted only when frames are built and read. The rest of each app, including
validation, works with the named form. `toRow` in `protocol.ts` and `SyncProtocol.ets` holds
the layout:

| Row                                                                                           | Notes                                                       |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `["p", key, name, minutes, exercises]`                                                        | Each exercise `[key, name, sets, reps, unit, rest, superset]`; unit 1 = seconds, 0 = reps. |
| `["s", id, rev, plan, status, at, end, pos, rest, log, skip]`                                 | Status 0 active, 1 done, 2 closed; log is flat `[exercise, set, reps, …]`. |
| `["r", id, pos, reps, auto]`                                                                  | Auto 1 when counted from the wrist.                         |
| `["d", date, owner, kcalTarget, [p, c, f], kcalEaten, [p, c, f], applied, favorites?]`        | Favorites `[ref, name, kcal, p, c, f]`, left out while unchanged. |
| `["f", logs]`                                                                                 | Each log `[id, ref, owner, at]`.                            |
| `["a", id]`                                                                                   | The frame ID of the message that arrived.                   |

## Versions

`hello.v` stays 1, because every watch build requires exactly 1. Each app says what it does
in its own field: the phone in `hello.app`, the watch in `welcome.v`. A feature is used only
when the other side supports it, and each app still reads the older formats. A newer build
on either side works with an older one, without the newer features.

| Version | Watch (`welcome.v`)                                                   | Phone (`hello.app`)                 |
| ------- | --------------------------------------------------------------------- | ----------------------------------- |
| 1       | Named-field plans and days.                                           | —                                   |
| 2       | Compact plans (`plan.x` rows); `welcome.key` names the plan it holds. | —                                   |
| 3       | Acks plan, session and day; keeps the favorites a day leaves out.     | Acks session and food.              |
| 4       | Reads and writes rows.                                                | Reads and writes rows.              |

The constants are `COMPACT_PLAN_VERSION`, `ACK_VERSION`, `ROW_VERSION` and `PHONE_VERSION` in
`protocol.ts`, and `WATCH_VERSION`, `ACK_VERSION` and `ROW_VERSION` in `SyncProtocol.ets`.

## Speed

Sizes measured for typical messages, before and after rows. The frame counts assume a
185-byte MTU:

| Message                    | Named JSON         | Row                |
| -------------------------- | ------------------ | ------------------ |
| Session at workout start   | 181 B, 2 frames    | 88 B, 1 frame      |
| Session after 15 sets      | 321 B, 2 frames    | 198 B, 2 frames    |
| Session after 30 sets      | 456 B, 3 frames    | 303 B, 2 frames    |
| Rep count                  | 94 B, 1 frame      | 50 B, 1 frame      |
| Day, totals only           | 224 B, 2 frames    | 95 B, 1 frame      |
| Day with 5 favorites       | 830 B, 5 frames    | 469 B, 3 frames    |
| Plan, 7 exercises          | 422 B, 3 frames (compact) | 379 B, 3 frames |
| Ack                        | 19 B, 1 frame      | 8 B, 1 frame       |

Protobuf would make these about three times smaller than named JSON. It was not adopted. The
watch would need a protobuf library for ArkTS, the frames would become binary, and the logs
would no longer be readable. That saves at most one connection event per message, because
only the first frame waits for an answer.

Other speed measures:

- Only the first frame of a message waits for the watch's answer. It is always full size,
  so the answer also shows that the watch takes frames that big. The other frames go out
  without waiting.
- The watch learns the MTU from the size of the writes it receives. It no longer depends on
  the `BLEMtuChange` event, which HarmonyOS raises only when the phone starts the MTU
  negotiation. Before this, the phone fell back to 20-byte frames, which made a workout
  start 2–5 s.
- A day message leaves the favorites out while they are unchanged, and lists at most 20
  quick-log IDs.
- The phone requests the fast connection interval while in the foreground and during a
  workout.
- A nutrition update reads today's totals through the app's query cache. Right after a meal
  change, it joins the refetch that change started instead of fetching again.

## Reliability

- **Acks.** The receiver acks each plan, session, day and food message by its frame ID. With
  no ack, the sender sends its current state of that kind again after 2 s, then 4, 8, 16 and
  at most 30 s. It sends the current state, never the old message.
- **Failed writes.** On the phone, a message that fails even in small frames resends
  everything 2 s later. On the watch, a session or rep count that fails goes again on the
  next tick, every 0.5 s.
- **Reconnects.** A new connection resends the plan (unless the watch holds it), the
  session and the day. A drop is retried after 1 s, other failures after 6 s. In the
  background, Android pauses JavaScript timers, so the native service's 6 s tick runs these
  checks instead.
- **Advertising.** The watch advertises every 20 ms for 2 minutes. After that it advertises
  about once a second instead of stopping, so a phone that comes back finds it.
- **Untrusted input.** Each app validates every message it reads, named or row, and ignores
  any that is malformed.
- **Merges.** Sessions merge by revision, and finished sets from both sides are kept.
  Duplicate messages are harmless.
- **Quick logs.** The phone saves a log at most once (by its ID). It lists the IDs its
  totals include, so the watch never counts a meal twice. The meals cache is invalidated
  after each saved meal and before its ID is stored, so totals read later include it.

## Telemetry

The phone sends two PostHog events. They contain counts and timings only, never workout or
food content.

- `watch_sync_connected`: `watch_version`, `handshake_ms` (from connecting to welcome).
- `watch_sync_link_ended`: `reason` (`dropped` or `stopped`), `watch_version`,
  `connected_s`, `sent`, `failed`, `resent`, `small_frames`, `acked`, `ack_p50_ms`,
  `ack_max_ms`.

Look for `resent` or `failed` above 0, `small_frames` above 0, and a slow `ack_max_ms`.

## Device tests

Install both apps from the same commit. Keep both logs open:

- Watch: `hdc hilog | Select-String "PhoneLink|FitwearBleWatch"` (PowerShell).
- Phone: the Metro terminal shows `[watch] <message> sent in X ms after Y ms queued` in
  development builds. You can also use `adb logcat -s ReactNativeJS`.

On the watch, `got <message>` marks each arrival, and `no ack for <kind>` or
`send failed: <kind>` marks a problem. A line `MTU raised by a write` means the watch never
got the MTU event.

| #  | Do                                                                 | Expect                                                              |
| -- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| 1  | Start a workout on the phone.                                      | The watch shows it within 1 s.                                      |
| 2  | Start one on the watch, with the phone app open.                   | The phone opens the session screen within 1 s.                      |
| 3  | Finish sets on each device in turn.                                | Both show the same sets and position; no set is lost.               |
| 4  | Count reps on the watch during a set.                              | The phone's count follows within about 1 s.                         |
| 5  | Add, edit and delete a meal on the phone.                          | The watch's calories and macro bars match within 2 s (a delete waits for its 5 s undo). |
| 6  | Quick log a favorite on the watch, then wait 10 s.                 | It appears on the phone once, and the watch's total counts it once. |
| 7  | Walk out of range for more than 2 minutes, then come back.         | It reconnects by itself within about 10 s, and changes made meanwhile sync. |
| 8  | Turn Bluetooth off and on on the phone.                            | It reconnects, with no duplicate sets or meals.                     |
| 9  | Lock the phone during a workout and train 5 minutes on the watch.  | Sets reach the phone while it is locked.                            |
| 10 | Kill the phone app mid-workout and reopen it.                      | The session resumes with the watch's sets.                          |
| 11 | Leave the watch app after a set, then return.                      | It is paused and asks whether to continue; the phone stays in step. |
| 12 | Run an old watch build with the new phone, and the other way round. | They connect and sync, without the newer features.                 |

After the tests, check that the `watch_sync_link_ended` events show `failed: 0` and
`small_frames: 0`.
