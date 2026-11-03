import { fireEvent, render } from "@testing-library/react-native";
import { AuthField } from "@/features/auth/auth-field";

test("reveals and hides a password without changing its value", async () => {
  const changed = jest.fn();
  const screen = await render(
    <AuthField
      label="Password"
      icon={1}
      secureTextEntry
      value="example-password"
      onChangeText={changed}
    />,
  );
  expect(screen.getByLabelText("Password").props.secureTextEntry).toBe(true);
  await fireEvent.press(screen.getByRole("button", { name: "Show password" }));
  expect(screen.getByLabelText("Password").props.secureTextEntry).toBe(false);
  expect(screen.getByLabelText("Password").props.value).toBe("example-password");
  await fireEvent.press(screen.getByRole("button", { name: "Hide password" }));
  expect(screen.getByLabelText("Password").props.secureTextEntry).toBe(true);
  expect(changed).not.toHaveBeenCalled();
});

test("a disabled password field cannot be revealed", async () => {
  const screen = await render(
    <AuthField
      label="Password"
      icon={1}
      secureTextEntry
      editable={false}
      value="example-password"
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Show password" }));
  expect(screen.getByLabelText("Password").props.secureTextEntry).toBe(true);
});

test("renders an accessible icon toggle instead of text", async () => {
  const screen = await render(
    <AuthField label="Password" icon={1} secureTextEntry value="example-password" />,
  );
  expect(screen.queryByText("Show")).toBeNull();
  expect(screen.queryByText("Hide")).toBeNull();
  expect(screen.getByTestId("password-visibility-toggle")).toBeTruthy();
});
