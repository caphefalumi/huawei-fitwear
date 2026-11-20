import { usePlanPreferences } from "../store/plan-preferences.store"
import type { Routine } from "../utils/routines"

const mockFiles = new Map<string, string>()

jest.mock("expo-file-system", () => ({
  Paths: { document: "documents" },
  File: class {
    uri: string
    constructor(_directory: string, name: string) {
      this.uri = name
    }
    get exists() {
      return mockFiles.has(this.uri)
    }
    textSync() {
      return mockFiles.get(this.uri)!
    }
    create() {
      mockFiles.set(this.uri, "")
    }
    writeSync(value: string) {
      mockFiles.set(this.uri, value)
    }
    moveSync(destination: { uri: string }) {
      mockFiles.set(destination.uri, mockFiles.get(this.uri)!)
      mockFiles.delete(this.uri)
      this.uri = destination.uri
    }
    delete() {
      mockFiles.delete(this.uri)
    }
  },
}))

const routine: Routine = {
  name: "Full Body A",
  sets: 2,
  minutes: 5,
  exercises: [
    {
      key: "plank",
      name: "Plank",
      sets: 2,
      reps: 30,
      unit: "seconds",
      rest: 30,
      prescription: "2x30s",
      warmUp: true,
    },
  ],
}

test("routine edits survive account switches without leaking across users", () => {
  mockFiles.clear()
  usePlanPreferences.getState().loadRoutines(null)
  usePlanPreferences.getState().loadRoutines("member-a")
  usePlanPreferences.getState().saveRoutine("member-a", routine)
  usePlanPreferences.getState().loadRoutines("member-b")
  expect(usePlanPreferences.getState().customRoutines).toEqual({})
  expect(() => usePlanPreferences.getState().saveRoutine("member-a", routine)).toThrow()
  usePlanPreferences.getState().loadRoutines("member-a")
  expect(usePlanPreferences.getState().customRoutines[routine.name]).toEqual(routine)
  usePlanPreferences.getState().loadRoutines(null)
  expect(usePlanPreferences.getState().customRoutines).toEqual({})
})

test("unreadable routine data is not overwritten", () => {
  mockFiles.clear()
  mockFiles.set("workout-routines-member-a.json", "not json")
  usePlanPreferences.getState().loadRoutines(null)
  usePlanPreferences.getState().loadRoutines("member-a")
  expect(usePlanPreferences.getState().routineStorageError).not.toBeNull()
  expect(() => usePlanPreferences.getState().saveRoutine("member-a", routine)).toThrow()
  expect(mockFiles.get("workout-routines-member-a.json")).toBe("not json")
})
