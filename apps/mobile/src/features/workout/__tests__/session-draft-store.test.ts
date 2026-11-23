import { database } from "@/features/workout/store/database"
import { SessionDraftModel } from "@/features/workout/store/session-draft.model"
import {
  clearSessionDraft,
  readSessionDraft,
  writeSessionDraft,
  type SessionDraft,
} from "@/features/workout/store/session-draft.store"

// The native adapter needs a dev build, so the same database runs on the in-memory Loki adapter.
jest.mock("@nozbe/watermelondb/adapters/sqlite", () => {
  const LokiJSAdapter = jest.requireActual("@nozbe/watermelondb/adapters/lokijs").default
  return {
    __esModule: true,
    default: class extends LokiJSAdapter {
      constructor(options: object) {
        // The Loki adapter autosaves on an interval; stop it so Jest can exit.
        super({
          ...options,
          useWebWorker: false,
          useIncrementalIndexedDB: true,
          extraLokiOptions: { autosave: false, verbose: false },
        })
      }
    },
  }
})

const draft: SessionDraft = {
  userId: "user-1",
  date: "2026-11-20",
  routineName: "Full Body A",
  position: 3,
  weights: [40, 0],
  logged: [[{ reps: 8, weightKg: 40 }], [undefined, undefined]],
  reps: 10,
  skipped: [1],
  exercises: [
    {
      key: "squat",
      name: "Squat",
      prescription: "3x8–12",
      sets: 3,
      reps: 10,
      unit: "reps",
      rest: 105,
    },
  ],
  startedAt: 1_700_000_000_000,
}

const storeRaw = (payload: string) =>
  database.write(() =>
    database.get<SessionDraftModel>("session_drafts").create((record) => {
      record.userId = "user-1"
      record.payload = payload
    }),
  )

beforeEach(async () => {
  await database.write(() => database.unsafeResetDatabase())
})

test("round-trips every field, including the in-progress set", async () => {
  await writeSessionDraft(draft)
  expect(await readSessionDraft("user-1")).toEqual(draft)
})

test("overwrites the previous draft instead of appending", async () => {
  await writeSessionDraft(draft)
  await writeSessionDraft({ ...draft, position: 4, reps: 7 })
  expect(await readSessionDraft("user-1")).toMatchObject({ position: 4, reps: 7 })
  expect(await database.get("session_drafts").query().fetchCount()).toBe(1)
})

test("keeps drafts separate per user", async () => {
  await writeSessionDraft(draft)
  expect(await readSessionDraft("user-2")).toBeNull()
})

test("returns null for corrupt or incomplete data", async () => {
  await storeRaw("{not json")
  expect(await readSessionDraft("user-1")).toBeNull()
})

test("rejects a draft with the wrong field types", async () => {
  await writeSessionDraft({ ...draft, position: "3" } as never)
  expect(await readSessionDraft("user-1")).toBeNull()

  await writeSessionDraft({ ...draft, skipped: "1" } as never)
  expect(await readSessionDraft("user-1")).toBeNull()
})

test("reads drafts written before the set progress fields existed", async () => {
  const { reps: _reps, skipped: _skipped, exercises: _exercises, ...legacy } = draft
  await writeSessionDraft(legacy)
  expect(await readSessionDraft("user-1")).toEqual(legacy)
})

test("clear removes the draft", async () => {
  await writeSessionDraft(draft)
  await clearSessionDraft("user-1")
  expect(await readSessionDraft("user-1")).toBeNull()
})
