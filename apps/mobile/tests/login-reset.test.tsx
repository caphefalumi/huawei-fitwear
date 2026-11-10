import { act, fireEvent, render, waitFor } from "@testing-library/react-native"
import { CanceledError } from "axios"
import * as Haptics from "expo-haptics"
import { AccessibilityInfo, AppState, StyleSheet, type AppStateStatus } from "react-native"

import { useAuth } from "@/features/auth"
import { AuthField } from "@/features/auth/auth-field"
import { LoginScreen } from "@/features/auth/screens/login-screen"
import { ApiError } from "@/lib/api/client"

jest.mock("@/features/auth/auth-hooks", () => ({
  APP_ROUTES: { signUp: "/sign-up" },
  useAuth: jest.fn(),
}))
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn() },
}))
jest.mock("expo-router/react-navigation", () => ({ useIsFocused: () => true }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))
jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  performAndroidHapticsAsync: jest.fn().mockResolvedValue(undefined),
  NotificationFeedbackType: { Error: "error" },
  AndroidHaptics: { Reject: "reject", Long_Press: "longpress" },
}))
jest.mock("expo-symbols", () => ({
  SymbolView: require("react-native").View,
}))
jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAvoidingView: require("react-native").View,
}))
jest.mock("react-native-reanimated", () => {
  const transition = { duration: () => transition }
  return {
    __esModule: true,
    default: { View: require("react-native").View },
    FadeIn: transition,
    FadeOut: transition,
    useReducedMotion: () => true,
  }
})

const mockUseAuth = jest.mocked(useAuth)
const auth = {
  user: null,
  loading: false,
  pending: false,
  error: null as string | null,
  signIn: jest.fn(),
  signUp: jest.fn(),
  requestPasswordReset: jest.fn(),
  verifyPasswordReset: jest.fn(),
  completePasswordReset: jest.fn(),
  signOut: jest.fn(),
  deleteAccount: jest.fn(),
  updateUser: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
  auth.error = null
  auth.pending = false
  auth.signIn.mockReset().mockResolvedValue(undefined)
  jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => {})
  jest.spyOn(AccessibilityInfo, "setAccessibilityFocus").mockImplementation(() => {})
  auth.requestPasswordReset.mockResolvedValue({
    message: "If an account exists, a code is on its way.",
    resendAfterSeconds: 60,
  })
  auth.verifyPasswordReset.mockResolvedValue("short-lived-reset-token")
  auth.completePasswordReset.mockResolvedValue("Password updated. You can now sign in.")
  mockUseAuth.mockReturnValue(auth)
})

afterEach(() => {
  jest.useRealTimers()
})

test("shows one inline credential error and preserves entered credentials", async () => {
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  await fireEvent.changeText(screen.getByLabelText("Password"), "wrong")
  auth.signIn.mockRejectedValueOnce(new ApiError("secret-specific server text", 401))
  await fireEvent.press(screen.getByLabelText("Log in"))
  expect(
    await screen.findByText(
      "We could not sign you in. Check your email and password and try again.",
    ),
  ).toBeTruthy()
  expect(screen.queryByText("secret-specific server text")).toBeNull()
  expect(screen.getByLabelText("Email address").props.value).toBe("member@example.com")
  expect(screen.getByLabelText("Password").props.value).toBe("wrong")
  expect(screen.getByLabelText("Password").props.accessibilityHint).toBeUndefined()
  expect(screen.queryByText("Re-enter your password.")).toBeNull()

  await fireEvent.changeText(screen.getByLabelText("Email address"), "bad")
  await fireEvent.press(screen.getByLabelText("Log in"))
  expect(screen.getByText("Enter a valid email address.")).toBeTruthy()
  expect(
    screen.queryByText("We could not sign you in. Check your email and password and try again."),
  ).toBeNull()
  expect(auth.signIn).toHaveBeenCalledTimes(1)
})

test("shows account deletion completion feedback instead of a network error", async () => {
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
  auth.signIn.mockRejectedValueOnce(
    new ApiError("Account deletion has completed. Create a new account to continue.", 410),
  )
  await fireEvent.press(screen.getByLabelText("Log in"))
  expect(
    await screen.findByText("Account deletion has completed. Create a new account to continue."),
  ).toBeTruthy()
  expect(screen.queryByText(/Can't connect/)).toBeNull()
})

test("invalid email feedback appears with the email input and no credential message", async () => {
  const screen = await render(<LoginScreen />)
  const emailField = screen.getByLabelText("Email address")
  await fireEvent.changeText(emailField, "not-an-email")
  await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
  await fireEvent.press(screen.getByLabelText("Log in"))
  expect(screen.getByText("Enter a valid email address.")).toBeTruthy()
  expect(screen.queryByText("Incorrect email or password.")).toBeNull()
  expect(auth.signIn).not.toHaveBeenCalled()
})

test.each([
  [0, "Can't connect. Check your connection and try again."],
  [503, "Something went wrong on our end. Try again."],
  [400, "Check your email address and try again."],
  [422, "Check your email address and try again."],
])("shows a banner, not a password error, for status %i", async (status, expected) => {
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
  auth.signIn.mockRejectedValueOnce(new ApiError("internal detail", status))
  await fireEvent.press(screen.getByLabelText("Log in"))
  expect(await screen.findByText(expected)).toBeTruthy()
  expect(screen.queryByText("Incorrect email or password.")).toBeNull()
  expect(screen.getByLabelText("Password").props.value).toBe("secret")
  expect(screen.getByLabelText("Password").props.accessibilityHint).toBeUndefined()
  expect(screen.getByLabelText("Log in").props.accessibilityState.disabled).toBe(false)
  expect(screen.queryByText("internal detail")).toBeNull()
  await fireEvent.changeText(screen.getByLabelText("Email address"), "other@example.com")
  expect(screen.queryByText(expected)).toBeNull()
})

test("empty password is inline and stale store errors never appear", async () => {
  auth.error = "A stale login failure"
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  await fireEvent.press(screen.getByLabelText("Log in"))
  expect(screen.getByText("Enter your password.")).toBeTruthy()
  expect(screen.queryByText("A stale login failure")).toBeNull()
  expect(auth.signIn).not.toHaveBeenCalled()
  await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
  expect(screen.queryByText("Enter your password.")).toBeNull()
})

test("same-tick submissions make one request and a failure releases the guard", async () => {
  const { promise, reject: rejectRequest } = Promise.withResolvers<void>()
  auth.signIn.mockReturnValueOnce(promise)
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
  const submit = screen.getByLabelText("Password").props.onSubmitEditing
  await act(async () => {
    submit()
    submit()
  })
  expect(auth.signIn).toHaveBeenCalledTimes(1)
  expect(screen.getByText("Log in")).toBeTruthy()
  expect(screen.getByLabelText("Log in").props.accessibilityState.busy).toBe(true)
  await act(async () => {
    rejectRequest(new ApiError("offline", 0))
  })
  await fireEvent.press(screen.getByLabelText("Log in"))
  expect(auth.signIn).toHaveBeenCalledTimes(2)
})

test("the third credential failure offers a reset hint and usable reset link", async () => {
  auth.signIn.mockRejectedValue(new ApiError("invalid", 401))
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await fireEvent.changeText(screen.getByLabelText("Password"), "wrong")
    await fireEvent.press(screen.getByLabelText("Log in"))
    expect(
      await screen.findByText(
        "We could not sign you in. Check your email and password and try again.",
      ),
    ).toBeTruthy()
    if (attempt < 2) expect(screen.queryByText(/Having trouble/)).toBeNull()
  }
  expect(screen.getByText("Having trouble? Reset your password.")).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Reset password" }))
  expect(screen.getByLabelText("Send reset code")).toBeTruthy()
})

test("credential feedback leaves the password unhighlighted", async () => {
  auth.signIn.mockRejectedValueOnce(new ApiError("invalid", 401))
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  await fireEvent.changeText(screen.getByLabelText("Password"), "wrong")
  await fireEvent(screen.getByLabelText("Password"), "focus", { nativeEvent: {} })
  await fireEvent.press(screen.getByLabelText("Log in"))
  await screen.findByText("We could not sign you in. Check your email and password and try again.")
  const input = screen.getByLabelText("Password")
  expect(input.props.value).toBe("wrong")
  expect(input.props.accessibilityHint).toBeUndefined()
  expect(screen.queryByText("Re-enter your password.")).toBeNull()
})

test("shared signup fields keep the existing palette and disabled outlines stay neutral", async () => {
  const screen = await render(<AuthField label="Signup password" value="draft" secureTextEntry />)
  await fireEvent(screen.getByLabelText("Signup password"), "focus", { nativeEvent: {} })
  expect(StyleSheet.flatten(screen.getByLabelText("Signup password").props.style).color).toBe(
    "#252321",
  )
  await screen.rerender(
    <AuthField label="Signup password" value="draft" secureTextEntry editable={false} error />,
  )
  const input = screen.getByLabelText("Signup password")
  expect(StyleSheet.flatten(input.parent?.props.style)).toEqual(
    expect.objectContaining({ borderWidth: 1, borderColor: "#E7E2DC", backgroundColor: "#FFFFFF" }),
  )
  expect(
    screen.getByRole("button", { name: "Show password" }).props.accessibilityState.disabled,
  ).toBe(true)
})

test("cancelled requests do not masquerade as network failures", async () => {
  auth.signIn.mockRejectedValueOnce(new CanceledError())
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
  await fireEvent.press(screen.getByLabelText("Log in"))
  expect(screen.queryByText(/Can't connect/)).toBeNull()
  expect(screen.getByLabelText("Log in").props.accessibilityState.disabled).toBe(false)
})

describe("wall-clock lockouts and delayed focus", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"))
  })

  test("429 disables both fields, counts down, and expires using wall-clock time", async () => {
    auth.signIn.mockRejectedValueOnce(new ApiError("limited", 429, "API_ERROR", undefined, 30))
    const screen = await render(<LoginScreen />)
    await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
    await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
    await fireEvent.press(screen.getByLabelText("Log in"))
    expect(screen.getByText("Too many attempts. Try again in 0:30.")).toBeTruthy()
    expect(screen.getByLabelText("Email address").props.editable).toBe(false)
    expect(screen.getByLabelText("Password").props.editable).toBe(false)
    expect(screen.getByLabelText("Log in").props.accessibilityState.disabled).toBe(true)
    expect(screen.getByText(/credential editing are disabled/)).toBeTruthy()
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText("Too many attempts. Try again in 0:29.")).toBeTruthy()
    await act(async () => {
      jest.advanceTimersByTime(29000)
    })
    expect(screen.queryByText(/Too many attempts/)).toBeNull()
    expect(screen.getByLabelText("Email address").props.editable).toBe(true)
    expect(screen.getByLabelText("Password").props.editable).toBe(true)
    expect(screen.getByLabelText("Log in").props.accessibilityState.disabled).toBe(false)
  })

  test("foreground recomputes a suspended countdown and the reset flow stays reachable", async () => {
    const listeners: ((state: AppStateStatus) => void)[] = []
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, callback) => {
      listeners.push(callback)
      return { remove: jest.fn() }
    })
    auth.signIn.mockRejectedValueOnce(new ApiError("limited", 429, "API_ERROR", undefined, 60))
    const screen = await render(<LoginScreen />)
    await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
    await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
    await fireEvent.press(screen.getByLabelText("Log in"))
    jest.setSystemTime(new Date("2026-01-01T00:00:45Z"))
    await act(async () => {
      listeners.forEach((listener) => listener("active"))
    })
    expect(screen.getByText("Too many attempts. Try again in 0:15.")).toBeTruthy()
    await fireEvent.press(screen.getByRole("button", { name: "Forgot password?" }))
    expect(screen.getByLabelText("Email address").props.editable).toBe(true)
    await fireEvent.press(screen.getByLabelText("Send reset code"))
    expect(auth.requestPasswordReset).toHaveBeenCalledWith("member@example.com")
    expect(screen.getByLabelText("4-digit reset code")).toBeTruthy()
    await fireEvent.press(screen.getByLabelText("Back to log in"))
    jest.setSystemTime(new Date("2026-01-01T00:02:00Z"))
    await act(async () => {
      listeners.forEach((listener) => listener("active"))
    })
    expect(screen.getByLabelText("Log in").props.accessibilityState.disabled).toBe(false)
  })

  test.each([429, 401])("missing duration on status %i never invents an expiry", async (status) => {
    auth.signIn.mockRejectedValueOnce(
      new ApiError("private detail", status, status === 401 ? "ACCOUNT_LOCKED" : "RATE_LIMITED"),
    )
    const screen = await render(<LoginScreen />)
    await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
    await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
    await fireEvent.press(screen.getByLabelText("Log in"))
    expect(
      screen.getByText(
        status === 401
          ? "Account locked. Reset your password to regain access."
          : "Too many attempts. Reset your password or try again later.",
      ),
    ).toBeTruthy()
    expect(screen.queryByText("Incorrect email or password.")).toBeNull()
    await act(async () => {
      jest.advanceTimersByTime(120000)
    })
    expect(screen.getByLabelText("Log in").props.accessibilityState.disabled).toBe(true)
    await fireEvent.press(screen.getByRole("button", { name: "Forgot password?" }))
    expect(screen.getByLabelText("Send reset code").props.accessibilityState.disabled).toBe(false)
  })

  test("a late rejection after unmount cannot focus, announce, or vibrate", async () => {
    const { promise, reject: rejectRequest } = Promise.withResolvers<void>()
    auth.signIn.mockReturnValueOnce(promise)
    const screen = await render(<LoginScreen />)
    await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
    await fireEvent.changeText(screen.getByLabelText("Password"), "wrong")
    await fireEvent.press(screen.getByLabelText("Log in"))
    await screen.unmount()
    await act(async () => {
      rejectRequest(new ApiError("invalid", 401))
      await promise.catch(() => undefined)
      jest.advanceTimersByTime(1000)
    })
    expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled()
    expect(AccessibilityInfo.setAccessibilityFocus).not.toHaveBeenCalled()
    expect(Haptics.notificationAsync).not.toHaveBeenCalled()
    expect(Haptics.performAndroidHapticsAsync).not.toHaveBeenCalled()
  })

  test("unmount does not schedule credential field focus", async () => {
    auth.signIn.mockRejectedValueOnce(new ApiError("invalid", 401))
    const screen = await render(<LoginScreen />)
    await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
    await fireEvent.changeText(screen.getByLabelText("Password"), "wrong")
    await fireEvent.press(screen.getByLabelText("Log in"))
    const message = "We could not sign you in. Check your email and password and try again."
    expect(await screen.findByText(message)).toBeTruthy()
    await screen.unmount()
    expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled()
    expect(AccessibilityInfo.setAccessibilityFocus).not.toHaveBeenCalled()
  })

  test("credential feedback leaves password intact and clears when editing", async () => {
    auth.signIn.mockRejectedValueOnce(new ApiError("invalid", 401))
    const screen = await render(<LoginScreen />)
    await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
    await fireEvent.changeText(screen.getByLabelText("Password"), "wrong")
    await fireEvent.press(screen.getByLabelText("Log in"))
    const message = "We could not sign you in. Check your email and password and try again."
    expect(await screen.findByText(message)).toBeTruthy()
    expect(screen.getByLabelText("Password").props.value).toBe("wrong")
    await fireEvent.changeText(screen.getByLabelText("Email address"), "other@example.com")
    expect(screen.queryByText(message)).toBeNull()
  })

  test("server-duration account locks expire without being treated as credential failures", async () => {
    auth.signIn.mockRejectedValueOnce(new ApiError("locked", 401, "ACCOUNT_LOCKED", undefined, 2))
    const screen = await render(<LoginScreen />)
    await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
    await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
    await fireEvent.press(screen.getByLabelText("Log in"))
    expect(screen.getByText("Account temporarily locked. Try again in 0:02.")).toBeTruthy()
    expect(screen.getByLabelText("Password").props.value).toBe("secret")
    expect(screen.queryByText("Incorrect email or password.")).toBeNull()
    await act(async () => {
      jest.advanceTimersByTime(2000)
    })
    expect(screen.getByLabelText("Log in").props.accessibilityState.disabled).toBe(false)
  })

  test("successful OTP password reset releases an indefinite account lock", async () => {
    auth.signIn.mockRejectedValueOnce(new ApiError("locked", 401, "ACCOUNT_LOCKED"))
    const screen = await render(<LoginScreen />)
    await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
    await fireEvent.changeText(screen.getByLabelText("Password"), "secret")
    await fireEvent.press(screen.getByLabelText("Log in"))
    await fireEvent.press(screen.getByRole("button", { name: "Forgot password?" }))
    await fireEvent.press(screen.getByLabelText("Send reset code"))
    await fireEvent.changeText(screen.getByLabelText("4-digit reset code"), "1234")
    await fireEvent.changeText(screen.getByLabelText("New password"), "ReplacementPassword123!")
    await fireEvent.press(screen.getByLabelText("Reset password"))
    expect(screen.getByText("Password updated. You can now sign in.")).toBeTruthy()
    await fireEvent.press(screen.getByLabelText("Back to log in"))
    expect(screen.getByLabelText("Email address").props.value).toBe("member@example.com")
    expect(screen.getByLabelText("Password").props.value).toBe("")
    expect(screen.getByLabelText("Log in").props.accessibilityState.disabled).toBe(false)
    expect(screen.queryByText(/Account locked/)).toBeNull()
  })

  test("unavailable haptics never prevent credential recovery or the next request", async () => {
    jest.mocked(Haptics.notificationAsync).mockRejectedValueOnce(new Error("unavailable"))
    jest.mocked(Haptics.performAndroidHapticsAsync).mockRejectedValueOnce(new Error("unsupported"))
    auth.signIn.mockRejectedValueOnce(new ApiError("invalid", 401))
    const screen = await render(<LoginScreen />)
    await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
    await fireEvent.changeText(screen.getByLabelText("Password"), "wrong")
    await fireEvent.press(screen.getByLabelText("Log in"))
    expect(
      screen.getByText("We could not sign you in. Check your email and password and try again."),
    ).toBeTruthy()
    await fireEvent.changeText(screen.getByLabelText("Password"), "correct")
    await fireEvent.press(screen.getByLabelText("Log in"))
    expect(auth.signIn).toHaveBeenCalledTimes(2)
  })
})

test("requires successful OTP verification before collecting a password and completes with the token", async () => {
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  await fireEvent.press(screen.getByRole("button", { name: "Forgot password?" }))
  await waitFor(() => expect(screen.getByLabelText("Send reset code")).toBeTruthy())
  await fireEvent.press(screen.getByLabelText("Send reset code"))

  await waitFor(() => expect(auth.requestPasswordReset).toHaveBeenCalledWith("member@example.com"))
  await waitFor(() => expect(screen.getByLabelText("4-digit reset code")).toBeTruthy())
  expect(screen.getByText("Resend in 01:00")).toBeTruthy()
  auth.verifyPasswordReset.mockRejectedValueOnce(
    new Error("This reset code is invalid or expired."),
  )
  await fireEvent.changeText(screen.getByLabelText("4-digit reset code"), "1234")

  expect(await screen.findByText("This reset code is invalid or expired.")).toBeTruthy()
  expect(screen.getByLabelText("4-digit reset code")).toBeTruthy()
  expect(screen.queryByLabelText("New password")).toBeNull()
  expect(auth.completePasswordReset).not.toHaveBeenCalled()

  await fireEvent.changeText(screen.getByLabelText("4-digit reset code"), "1234")
  await waitFor(() =>
    expect(auth.verifyPasswordReset).toHaveBeenCalledWith("member@example.com", "1234"),
  )
  expect(await screen.findByLabelText("New password")).toBeTruthy()
  expect(screen.getByText("• At least 8 characters.")).toBeTruthy()
  await fireEvent.changeText(screen.getByLabelText("New password"), "password1")
  expect(screen.getByText("✓ At least 8 characters.")).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Show password" }))
  expect(screen.getByLabelText("New password").props.secureTextEntry).toBe(false)
  await fireEvent.press(screen.getByLabelText("Hide password"))
  expect(screen.getByLabelText("New password").props.secureTextEntry).toBe(true)

  await fireEvent.changeText(screen.getByLabelText("New password"), "ReplacementPassword123!")
  await fireEvent.press(screen.getByLabelText("Reset password"))
  await waitFor(() =>
    expect(auth.completePasswordReset).toHaveBeenCalledWith(
      "short-lived-reset-token",
      "ReplacementPassword123!",
    ),
  )
  expect(await screen.findByText("Password updated. You can now sign in.")).toBeTruthy()
})

test("password reset failure keeps the login password; only successful completion clears it", async () => {
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  await fireEvent.changeText(screen.getByLabelText("Password"), "original-secret")
  await fireEvent.press(screen.getByRole("button", { name: "Forgot password?" }))
  await fireEvent.press(screen.getByLabelText("Send reset code"))
  await fireEvent.changeText(screen.getByLabelText("4-digit reset code"), "1234")
  await fireEvent.changeText(screen.getByLabelText("New password"), "ReplacementPassword123!")
  auth.completePasswordReset.mockRejectedValueOnce(new Error("Reset failed"))
  await fireEvent.press(screen.getByLabelText("Reset password"))
  expect(await screen.findByText("Could not reset your password. Try again.")).toBeTruthy()
  expect(screen.getByLabelText("Back to log in")).toBeTruthy()
  await fireEvent.press(screen.getByLabelText("Back to log in"))
  expect(screen.getByLabelText("Password").props.value).toBe("original-secret")

  await fireEvent.press(screen.getByRole("button", { name: "Forgot password?" }))
  await fireEvent.press(screen.getByLabelText("Send reset code"))
  await fireEvent.changeText(screen.getByLabelText("4-digit reset code"), "1234")
  await fireEvent.changeText(screen.getByLabelText("New password"), "ReplacementPassword123!")
  await fireEvent.press(screen.getByLabelText("Reset password"))
  expect(await screen.findByText("Password updated. You can now sign in.")).toBeTruthy()
  await fireEvent.press(screen.getByLabelText("Back to log in"))
  expect(screen.getByLabelText("Email address").props.value).toBe("member@example.com")
  expect(screen.getByLabelText("Password").props.value).toBe("")
})

test("password reset resend is blocked during cooldown and allowed after expiry", async () => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date("2026-01-01T00:00:00Z"))
  const screen = await render(<LoginScreen />)
  await fireEvent.changeText(screen.getByLabelText("Email address"), "member@example.com")
  await fireEvent.press(screen.getByRole("button", { name: "Forgot password?" }))
  await fireEvent.press(screen.getByLabelText("Send reset code"))
  expect(screen.getByText("Resend in 01:00")).toBeTruthy()
  await fireEvent.press(screen.getByText("Resend in 01:00"))
  expect(auth.requestPasswordReset).toHaveBeenCalledTimes(1)
  await act(async () => {
    jest.advanceTimersByTime(60000)
  })
  await fireEvent.press(screen.getByText("Resend code"))
  expect(auth.requestPasswordReset).toHaveBeenCalledTimes(2)
})
