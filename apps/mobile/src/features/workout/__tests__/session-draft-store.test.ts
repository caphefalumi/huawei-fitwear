import { DatabaseSync } from "node:sqlite"

import { writeDraftPayload } from "@/features/workout/store/database"
import {
  clearSessionDraft,
  readSessionDraft,
  writeSessionDraft,
  type SessionDraft,
} from "@/features/workout/store/session-draft.store"

jest.mock("@/lib/analytics/posthog", () => ({ captureException: jest.fn() }))

// Exercise the production SQL against SQLite, replacing only the Expo native bridge.
let mockSqlite: DatabaseSync
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: async () => {
    const { DatabaseSync } = jest.requireActual<typeof import("node:sqlite")>("node:sqlite")
    mockSqlite = new DatabaseSync(":memory:")
    return {
      execAsync: async (sql: string) => mockSqlite.exec(sql),
      getFirstAsync: async (sql: string, ...params: string[]) =>
        mockSqlite.prepare(sql).get(...params) ?? null,
      runAsync: async (sql: string, ...params: string[]) => mockSqlite.prepare(sql).run(...params),
      closeAsync: async () => mockSqlite.close(),
    }
  },
}))

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

beforeEach(() => mockSqlite?.exec("DELETE FROM session_drafts"))
afterAll(() => mockSqlite?.close())

test("round-trips every field, including the in-progress set", async () => {
  await writeSessionDraft(draft)
  expect(await readSessionDraft("user-1")).toEqual(draft)
})

test("overwrites the previous draft instead of appending", async () => {
  await writeSessionDraft(draft)
  await writeSessionDraft({ ...draft, position: 4, reps: 7 })
  expect(await readSessionDraft("user-1")).toMatchObject({ position: 4, reps: 7 })
  expect(mockSqlite.prepare("SELECT user_id FROM session_drafts").all()).toHaveLength(1)
})

test("keeps drafts separate per user", async () => {
  await writeSessionDraft(draft)
  expect(await readSessionDraft("user-2")).toBeNull()
})

test("returns null for corrupt or incomplete data", async () => {
  await writeDraftPayload("user-1", "{not json")
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

test("a discard cannot be overtaken by a previously queued autosave", async () => {
  const save = writeSessionDraft(draft)
  const discard = clearSessionDraft(draft.userId)
  const read = readSessionDraft(draft.userId)
  await Promise.all([save, discard])
  expect(await read).toBeNull()
})
