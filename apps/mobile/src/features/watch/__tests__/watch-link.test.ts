import * as SecureStore from "expo-secure-store"

import type { WatchBleListener } from "@/features/ble"

import { usePairing } from "../pairing.store"
import { encodeFrames } from "../protocol"
import { resetWatchSession, useWatchStore } from "../store"
import { WatchLink } from "../watch-link"

const mockClient = {
  listener: undefined as unknown as WatchBleListener,
  connect: jest.fn(async () => {}),
  disconnect: jest.fn(async () => {}),
  destroy: jest.fn(),
  maxPayload: jest.fn(() => 180),
  sendFrame: jest.fn(async () => true),
}
jest.mock("@/features/ble", () => ({
  BLE_MAX_MESSAGE_BYTES: 180,
  WatchBleClient: jest.fn((listener: WatchBleListener) => {
    mockClient.listener = listener
    return mockClient
  }),
}))
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(async () => {}),
  deleteItemAsync: jest.fn(async () => {}),
}))

beforeEach(() => {
  jest.useFakeTimers()
  jest.clearAllMocks()
  resetWatchSession()
  usePairing.setState({ enabled: false })
})
afterEach(() => jest.useRealTimers())

test("remembers the watch only after a connection works, and reconnects after a drop", async () => {
  usePairing.getState().setEnabled(true)
  expect(SecureStore.setItemAsync).not.toHaveBeenCalled()

  const link = new WatchLink("phone-1")
  link.start()
  expect(mockClient.connect).toHaveBeenCalledTimes(1)
  mockClient.listener.onStatus("connected")
  for (const frame of encodeFrames({ t: "welcome", v: 1, ok: true }, 180, 1)) {
    mockClient.listener.onMessage("watch-to-phone", frame, frame.length)
  }
  expect(useWatchStore.getState().status).toBe("connected")
  expect(SecureStore.setItemAsync).toHaveBeenCalledWith("watch.enabled", "1")

  mockClient.listener.onStatus("disconnected")
  await jest.advanceTimersByTimeAsync(6000)
  expect(mockClient.connect).toHaveBeenCalledTimes(2)
  link.destroy()
})

test("connects on its own next launch until the watch is forgotten", async () => {
  jest.mocked(SecureStore.getItemAsync).mockResolvedValueOnce("1")
  await usePairing.getState().load()
  expect(usePairing.getState().enabled).toBe(true)

  usePairing.getState().setEnabled(false)
  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("watch.enabled")
})
