import { act, renderHook } from "@testing-library/react-native"

import { GIVE_UP_MS, useBackgroundLink } from "../background"
import { watchService } from "../background-service"
import { resetWatchSession, useWatchStore } from "../store"

let mockTick: () => void = () => {}
jest.mock("../background-service", () => ({
  watchService: {
    start: jest.fn(() => true),
    stop: jest.fn(),
    onTick: jest.fn((listener: () => void) => {
      mockTick = listener
      return { remove: jest.fn() }
    }),
  },
}))

beforeEach(() => {
  jest.useFakeTimers()
  jest.clearAllMocks()
  resetWatchSession()
  useWatchStore.setState({ status: "searching" })
})
afterEach(() => jest.useRealTimers())

type Props = { enabled: boolean; foreground: boolean }

async function setup() {
  const onTick = jest.fn()
  const hook = await renderHook(
    ({ enabled, foreground }: Props) => useBackgroundLink(enabled, foreground, onTick),
    { initialProps: { enabled: true, foreground: true } },
  )
  const status = (next: "connected" | "searching") =>
    act(() => useWatchStore.setState({ status: next }))
  return { ...hook, onTick, status }
}

test("starts the service once the watch is connected, and not before", async () => {
  const { status } = await setup()
  expect(watchService.start).not.toHaveBeenCalled()

  await status("connected")

  expect(watchService.start).toHaveBeenCalledTimes(1)
})

test("keeps looking for a lost watch in the background, then gives up", async () => {
  const { rerender, status, onTick } = await setup()
  await status("connected")
  await rerender({ enabled: true, foreground: false })
  await status("searching")

  await act(() => mockTick())
  expect(onTick).toHaveBeenCalledTimes(1)
  expect(watchService.stop).not.toHaveBeenCalled()

  jest.advanceTimersByTime(GIVE_UP_MS)
  await act(() => mockTick())
  expect(watchService.stop).toHaveBeenCalled()
  expect(onTick).toHaveBeenCalledTimes(1)
})

test("stops the service when the watch is forgotten", async () => {
  const { rerender, status } = await setup()
  await status("connected")

  await rerender({ enabled: false, foreground: true })

  expect(watchService.stop).toHaveBeenCalled()
})
