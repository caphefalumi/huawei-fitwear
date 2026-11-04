import { useState } from "react"
import { Text } from "react-native"
import { fireEvent, render } from "@testing-library/react-native"
import { WheelPicker } from "@/components/wheel-picker"

function Frequency() {
  const [value, setValue] = useState(2)
  return (
    <>
      <WheelPicker
        values={[1, 2, 3]}
        value={value}
        onChange={setValue}
        format={(item) => `${item} sessions/week`}
      />
      <Text testID="saved-value">{value}</Text>
    </>
  )
}

test("assistive adjustment changes frequency and stops at both bounds", async () => {
  const screen = await render(<Frequency />)
  const adjust = async (actionName: string) => {
    await fireEvent(screen.getByRole("adjustable"), "accessibilityAction", {
      nativeEvent: { actionName },
    })
  }
  await adjust("increment")
  expect(screen.getByTestId("saved-value")).toHaveTextContent("3")
  await adjust("increment")
  expect(screen.getByTestId("saved-value")).toHaveTextContent("3")
  await adjust("decrement")
  await adjust("decrement")
  await adjust("decrement")
  expect(screen.getByTestId("saved-value")).toHaveTextContent("1")
}, 20_000)

test("frequency can be changed without a swipe", async () => {
  const screen = await render(<Frequency />)
  await fireEvent.press(screen.getByRole("button", { name: "Increase value" }))
  expect(screen.getByTestId("saved-value")).toHaveTextContent("3")
  expect(screen.getByRole("button", { name: "Increase value", disabled: true })).toBeDisabled()
  await fireEvent.press(screen.getByRole("button", { name: "Decrease value" }))
  expect(screen.getByTestId("saved-value")).toHaveTextContent("2")
})
