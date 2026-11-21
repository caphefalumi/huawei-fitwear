import {
  clearSessionDraft,
  readSessionDraft,
  writeSessionDraft,
  type SessionDraft,
} from "@/features/workout/store/session-draft.store"

// In-memory stand-in for the native file API, so the store's real read/write path runs under Jest.
const mockFiles = new Map<string, string>()

jest.mock("expo-file-system", () => {
  class File {
    uri: string
    constructor(directory: { uri: string } | string, name?: string) {
      this.uri = `${typeof directory === "string" ? directory : directory.uri}/${name ?? ""}`
    }
    get exists() {
      return mockFiles.has(this.uri)
    }
    textSync() {
      return mockFiles.get(this.uri)!
    }
    create() {}
    writeSync(data: string) {
      mockFiles.set(this.uri, data)
    }
    moveSync(target: File) {
      mockFiles.set(target.uri, mockFiles.get(this.uri)!)
      mockFiles.delete(this.uri)
    }
    delete() {
      mockFiles.delete(this.uri)
    }
  }
  return { Paths: { document: { uri: "/docs" } }, File }
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

beforeEach(() => mockFiles.clear())

test("round-trips every field, including the in-progress set", () => {
  writeSessionDraft(draft)
  expect(readSessionDraft("user-1")).toEqual(draft)
})

test("overwrites the previous draft instead of appending", () => {
  writeSessionDraft(draft)
  writeSessionDraft({ ...draft, position: 4, reps: 7 })
  expect(readSessionDraft("user-1")).toMatchObject({ position: 4, reps: 7 })
})

test("keeps drafts separate per user", () => {
  writeSessionDraft(draft)
  expect(readSessionDraft("user-2")).toBeNull()
})

test("returns null for corrupt or incomplete data", () => {
  mockFiles.set("/docs/session-draft-user-1.json", "{not json")
  expect(readSessionDraft("user-1")).toBeNull()

  writeSessionDraft({ ...draft, position: "3" } as never)
  expect(readSessionDraft("user-1")).toBeNull()

  writeSessionDraft({ ...draft, skipped: "1" } as never)
  expect(readSessionDraft("user-1")).toBeNull()
})

test("reads drafts written before the set progress fields existed", () => {
  const { reps: _reps, skipped: _skipped, exercises: _exercises, ...legacy } = draft
  writeSessionDraft(legacy)
  expect(readSessionDraft("user-1")).toEqual(legacy)
})

test("clear removes the draft", () => {
  writeSessionDraft(draft)
  clearSessionDraft("user-1")
  expect(readSessionDraft("user-1")).toBeNull()
})
