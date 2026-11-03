import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/features/auth/store/auth.store";
import { LoginScreen } from "@/features/auth/components/login-screen";

jest.mock("@/features/auth/store/auth.store", () => ({
  APP_ROUTES: { signUp: "/sign-up" },
  useAuth: jest.fn(),
}));
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn() },
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

const mockUseAuth = jest.mocked(useAuth);
const auth = {
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
};

beforeEach(() => {
  jest.clearAllMocks();
  auth.requestPasswordReset.mockResolvedValue("If an account exists, a code is on its way.");
  auth.verifyPasswordReset.mockResolvedValue("short-lived-reset-token");
  auth.completePasswordReset.mockResolvedValue("Password updated. You can now sign in.");
  mockUseAuth.mockReturnValue(auth);
});

test("requires successful OTP verification before collecting a password and completes with the token", async () => {
  const screen = await render(<LoginScreen />);
  await fireEvent.changeText(screen.getByLabelText("Email"), "member@example.com");
  await fireEvent.press(screen.getByRole("button", { name: "Forgot password?" }));
  await waitFor(() => expect(screen.getByLabelText("Send reset code")).toBeTruthy());
  await fireEvent.press(screen.getByLabelText("Send reset code"));

  await waitFor(() => expect(auth.requestPasswordReset).toHaveBeenCalledWith("member@example.com"));
  await waitFor(() => expect(screen.getByLabelText("4-digit reset code")).toBeTruthy());
  auth.verifyPasswordReset.mockRejectedValueOnce(
    new Error("This reset code is invalid or expired."),
  );
  await fireEvent.changeText(screen.getByLabelText("4-digit reset code"), "1234");

  expect(await screen.findByText("This reset code is invalid or expired.")).toBeTruthy();
  expect(screen.getByLabelText("4-digit reset code")).toBeTruthy();
  expect(screen.queryByLabelText("New password")).toBeNull();
  expect(auth.completePasswordReset).not.toHaveBeenCalled();

  await fireEvent.changeText(screen.getByLabelText("4-digit reset code"), "1234");
  await waitFor(() =>
    expect(auth.verifyPasswordReset).toHaveBeenCalledWith("member@example.com", "1234"),
  );
  expect(await screen.findByLabelText("New password")).toBeTruthy();

  await fireEvent.changeText(screen.getByLabelText("New password"), "ReplacementPassword123!");
  await fireEvent.press(screen.getByLabelText("Reset password"));
  await waitFor(() =>
    expect(auth.completePasswordReset).toHaveBeenCalledWith(
      "short-lived-reset-token",
      "ReplacementPassword123!",
    ),
  );
  expect(await screen.findByText("Password updated. You can now sign in.")).toBeTruthy();
});
