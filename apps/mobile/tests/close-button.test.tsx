import { fireEvent, render } from "@testing-library/react-native"
import { Text } from "react-native"

import { CloseButton } from "@/components/close-button"
import { Sheet } from "@/components/sheet"

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))
jest.mock("react-native-reanimated", () => ({ useReducedMotion: () => true }))
jest.mock("react-native-keyboard-controller", () => {
  const { View } = require("react-native")
  return { KeyboardAvoidingView: View }
})

test("is a labelled circle that calls onPress and keeps a 44dp hit area", async () => {
  const onPress = jest.fn()
  const screen = await render(<CloseButton label="Close sheet" onPress={onPress} size={32} />)
  const button = screen.getByLabelText("Close sheet")
  expect(button).toHaveStyle({ width: 32, height: 32, borderRadius: 16 })
  expect(button.props.hitSlop).toBe(6)
  await fireEvent.press(button)
  expect(onPress).toHaveBeenCalledTimes(1)
})

test("every sheet closes through the circular X, not a text button", async () => {
  const onClose = jest.fn()
  const screen = await render(
    <Sheet visible title="Height" onClose={onClose}>
      <Text>Body</Text>
    </Sheet>,
  )
  expect(screen.queryByText("Close")).toBeNull()
  await fireEvent.press(screen.getByLabelText("Close Height"))
  expect(onClose).toHaveBeenCalledTimes(1)
})
