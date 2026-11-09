import { fireEvent, render, screen } from "@testing-library/react-native"

import { useAuth } from "@/features/auth"
import { SignUpScreen } from "@/features/auth/sign-up-screen"

jest.mock("@/features/auth/auth-hooks", () => ({
  APP_ROUTES: { login: "/login" },
  useAuth: jest.fn(),
}))
jest.mock("expo-router", () => ({ router: { replace: jest.fn() } }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))
jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  default: { View: require("react-native").View },
  useReducedMotion: () => true,
}))

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useAuth).mockReturnValue({
    user: null,
    loading: false,
    pending: false,
    error: null,
    signIn: jest.fn(),
    signUp: jest.fn(),
    requestPasswordReset: jest.fn(),
    verifyPasswordReset: jest.fn(),
    completePasswordReset: jest.fn(),
    signOut: jest.fn(),
    deleteAccount: jest.fn(),
    updateUser: jest.fn(),
  })
})

test("shows birth date errors only under the date field", async () => {
  await render(<SignUpScreen />)
  await fireEvent.changeText(screen.getByLabelText("Username"), "member")
  await fireEvent.changeText(screen.getByLabelText("Email"), "member@example.com")
  await fireEvent.changeText(screen.getByLabelText("Password"), "password123")
  await fireEvent.changeText(screen.getByLabelText("Day"), "31")
  await fireEvent.changeText(screen.getByLabelText("Month"), "02")
  await fireEvent.changeText(screen.getByLabelText("Year"), "1998")
  await fireEvent.press(screen.getByRole("checkbox"))
  await fireEvent.press(screen.getByLabelText("Create account"))
  expect(await screen.findByText("Enter a valid date of birth.")).toBeTruthy()
  expect(screen.getAllByText("Enter a valid date of birth.")).toHaveLength(1)
})
