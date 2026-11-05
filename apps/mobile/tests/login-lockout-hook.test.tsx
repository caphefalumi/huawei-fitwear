import { act, renderHook, waitFor } from "@testing-library/react-native"
import { AppState, type AppStateStatus } from "react-native"

import { useLoginLockout } from "@/features/auth/use-login-lockout"

afterEach(() => {
  jest.useRealTimers()
})

test("lockout counts down from a wall-clock deadline and expires", async () => {
  const { result } = await renderHook(() => useLoginLockout())
  await waitFor(() => expect(result.current).not.toBeNull())
  jest.useFakeTimers()
  jest.setSystemTime(new Date("2026-01-01T00:00:00Z"))
  await act(async () => result.current!.lock("rate", 3))
  await waitFor(() => expect(result.current!.message).toBe("Too many attempts. Try again in 0:03."))

  await act(async () => jest.advanceTimersByTime(1000))
  await waitFor(() => expect(result.current!.message).toBe("Too many attempts. Try again in 0:02."))
  await act(async () => jest.advanceTimersByTime(2000))
  await waitFor(() => {
    expect(result.current!.kind).toBeNull()
    expect(result.current!.message).toBeNull()
  })
})

test("foreground refresh recomputes lockout against wall-clock time", async () => {
  const listeners: ((state: AppStateStatus) => void)[] = []
  jest.spyOn(AppState, "addEventListener").mockImplementation((_type, callback) => {
    listeners.push(callback)
    return { remove: jest.fn() }
  })
  const { result } = await renderHook(() => useLoginLockout())
  await waitFor(() => expect(result.current).not.toBeNull())
  jest.useFakeTimers()
  jest.setSystemTime(new Date("2026-01-01T00:00:00Z"))
  await act(async () => result.current!.lock("locked", 60))
  jest.setSystemTime(new Date("2026-01-01T00:00:45Z"))
  await act(async () => listeners.forEach((listener) => listener("active")))
  expect(result.current!.message).toBe("Account temporarily locked. Try again in 0:15.")
})
