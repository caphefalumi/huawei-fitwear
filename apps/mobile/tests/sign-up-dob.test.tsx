import { fireEvent, render } from "@testing-library/react-native"
import { useAuth } from "@/features/auth"
import { SignUpScreen } from "@/features/auth/sign-up-screen"

jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  default: { View: require("react-native").View },
  useReducedMotion: () => true,
}))

jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  default: { View: require("react-native").View },
  useReducedMotion: () => true,
}))

jest.mock("@/features/auth/auth-store", () => ({
  APP_ROUTES: { login: "/login" },
  useAuth: jest.fn(),
}))
jest.mock("expo-router", () => ({ router: { replace: jest.fn() } }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

const signUp = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useAuth).mockReturnValue({
    user: null,
    loading: false,
    pending: false,
    error: null,
    signIn: jest.fn(),
    signUp,
    requestPasswordReset: jest.fn(),
    verifyPasswordReset: jest.fn(),
    completePasswordReset: jest.fn(),
    signOut: jest.fn(),
    deleteAccount: jest.fn(),
    updateUser: jest.fn(),
  })
})

test("clearing a completed DOB disables signup and cannot submit the stale date", async () => {
  const screen = await render(<SignUpScreen />)
  await fireEvent.changeText(screen.getByLabelText("Username"), "member")
  await fireEvent.changeText(screen.getByLabelText("Email"), "member@example.com")
  await fireEvent.changeText(screen.getByLabelText("Day"), "12")
  await fireEvent.changeText(screen.getByLabelText("Month"), "03")
  await fireEvent.changeText(screen.getByLabelText("Year"), "1998")
  await fireEvent.changeText(screen.getByLabelText("Password"), "password123")
  await fireEvent.press(screen.getByRole("checkbox"))

  const submit = screen.getByLabelText("Create account")
  expect(submit.props.accessibilityState.disabled).toBe(false)

  await fireEvent.changeText(screen.getByLabelText("Day"), "")
  expect(screen.getByLabelText("Create account").props.accessibilityState.disabled).toBe(true)
  await fireEvent.press(screen.getByLabelText("Create account"))
  expect(signUp).not.toHaveBeenCalled()
})
