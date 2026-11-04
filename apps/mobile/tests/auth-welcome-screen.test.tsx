import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";

import { WelcomeScreen } from "@/features/auth/components/welcome-screen";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

test("routes welcome actions to login and signup", async () => {
  const screen = await render(<WelcomeScreen />);

  await fireEvent.press(screen.getByRole("button", { name: "Sign in" }));
  expect(router.push).toHaveBeenCalledWith("/(auth)/login");

  await fireEvent.press(screen.getByRole("button", { name: "Create account" }));
  expect(router.push).toHaveBeenCalledWith("/(auth)/sign-up");
});
