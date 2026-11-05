import { act, renderHook, waitFor } from "@testing-library/react-native"

import { useAuth } from "@/features/auth/auth-hooks"
import { usePasswordReset } from "@/features/auth/use-password-reset"

jest.mock("@/features/auth/auth-hooks", () => ({ useAuth: jest.fn() }))

const mockUseAuth = jest.mocked(useAuth)
const mockAuth = {
  requestPasswordReset: jest.fn(),
  verifyPasswordReset: jest.fn(),
  completePasswordReset: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
  mockAuth.requestPasswordReset.mockResolvedValue({
    message: "If an account exists, a code is on its way.",
    resendAfterSeconds: 2,
  })
  mockAuth.verifyPasswordReset.mockResolvedValue("reset-token")
  mockAuth.completePasswordReset.mockResolvedValue("Password updated.")
  mockUseAuth.mockReturnValue(mockAuth as never)
})

afterEach(() => {
  jest.useRealTimers()
})

test("password reset cooldown blocks resend and releases it after expiry", async () => {
  const { result } = await renderHook(() =>
    usePasswordReset({ email: "member@example.com", onStart: jest.fn(), onCompleted: jest.fn() }),
  )
  await waitFor(() => expect(result.current).not.toBeNull())
  jest.useFakeTimers()
  jest.setSystemTime(new Date("2026-01-01T00:00:00Z"))
  await act(async () => result.current!.start())
  await act(async () => result.current!.submit())
  await waitFor(() => expect(result.current!.resendSeconds).toBe(2))

  await act(async () => result.current!.resend())
  expect(mockAuth.requestPasswordReset).toHaveBeenCalledTimes(1)

  await act(async () => jest.advanceTimersByTime(2000))
  await waitFor(() => expect(result.current!.resendSeconds).toBe(0))
  await act(async () => result.current!.resend())
  expect(mockAuth.requestPasswordReset).toHaveBeenCalledTimes(2)
})

test("failed completion preserves the reset password; success invokes completion only once", async () => {
  const onCompleted = jest.fn()
  const { result } = await renderHook(() =>
    usePasswordReset({ email: "member@example.com", onStart: jest.fn(), onCompleted }),
  )
  await waitFor(() => expect(result.current).not.toBeNull())
  mockAuth.completePasswordReset
    .mockRejectedValueOnce(new Error("Reset failed"))
    .mockResolvedValueOnce("Password updated.")

  await act(async () => result.current!.start())
  await act(async () => result.current!.submit())
  await act(async () => result.current!.verify("1234"))
  await act(async () => result.current!.setNewPassword("ReplacementPassword123!"))
  await act(async () => result.current!.submit())

  expect(result.current!.error).toBe("Reset failed")
  expect(result.current!.newPassword).toBe("ReplacementPassword123!")
  expect(onCompleted).not.toHaveBeenCalled()

  await act(async () => result.current!.submit())
  expect(onCompleted).toHaveBeenCalledTimes(1)
  expect(result.current!.step).toBe("done")
})
