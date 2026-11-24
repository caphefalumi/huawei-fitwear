import { act, renderHook } from "@testing-library/react-native"

const mockFiles = new Map<string, string>()
jest.mock("expo-file-system", () => ({
  Paths: { document: "doc" },
  File: class {
    uri: string
    constructor(parent: string, name: string) {
      this.uri = `${parent}/${name}`
    }
    get exists() {
      return mockFiles.has(this.uri)
    }
    create() {
      mockFiles.set(this.uri, "")
    }
    textSync() {
      return mockFiles.get(this.uri) ?? ""
    }
    writeSync(text: string) {
      mockFiles.set(this.uri, text)
    }
  },
}))

import { useDeviceFlag, useDeviceFlags } from "./device-flags"

beforeEach(() => {
  mockFiles.clear()
  // A fresh app session: nothing read from disk yet.
  useDeviceFlags.setState({ flags: null })
})

test("a dismissed flag is saved and read back by a fresh app session", async () => {
  const { result } = await renderHook(() => useDeviceFlag("mealSwipeTipDismissed"))
  expect(result.current[0]).toBe(false)
  await act(async () => result.current[1]())
  expect(result.current[0]).toBe(true)
  expect(JSON.parse(mockFiles.get("doc/fitwear-device-flags-v1.json")!)).toEqual({
    mealSwipeTipDismissed: true,
  })

  useDeviceFlags.setState({ flags: null })
  const reopened = await renderHook(() => useDeviceFlag("mealSwipeTipDismissed"))
  expect(reopened.result.current[0]).toBe(true)
})

test("an unreadable file shows the tip instead of failing", async () => {
  mockFiles.set("doc/fitwear-device-flags-v1.json", "{broken")
  const { result } = await renderHook(() => useDeviceFlag("mealSwipeTipDismissed"))
  expect(result.current[0]).toBe(false)
})
