import { act, fireEvent, render } from "@testing-library/react-native"

import { showToast, ToastHost, useToastStore } from "@/components/feedback/toast"

import { MealTimeSheet } from "../components/meal-time-sheet"

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: require("react-native").View,
}))
jest.mock("../hooks/meals-hooks", () => ({
  localDate: (date = new Date()) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
}))

const now = new Date(2026, 10, 24, 18, 30)

test("saves the meal's current day and time when nothing is changed", async () => {
  const onSave = jest.fn()
  const screen = await render(
    <MealTimeSheet
      visible
      value={new Date(2026, 10, 23, 7, 45, 59)}
      pending={false}
      error={null}
      now={now}
      onClose={jest.fn()}
      onSave={onSave}
    />,
  )
  expect(screen.getByText("The meal moves to the day you pick.")).toBeTruthy()
  await fireEvent.press(screen.getByLabelText("Save meal time"))
  expect(onSave).toHaveBeenCalledWith(new Date(2026, 10, 23, 7, 45))
})

test("quick picks move the meal to yesterday at the same time", async () => {
  const onSave = jest.fn()
  const screen = await render(
    <MealTimeSheet
      visible
      value={new Date(2026, 10, 24, 12, 15)}
      pending={false}
      error={null}
      now={now}
      onClose={jest.fn()}
      onSave={onSave}
    />,
  )
  expect(screen.getByRole("button", { name: "Set day to today", selected: true })).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Set day to yesterday" }))
  await fireEvent.press(screen.getByLabelText("Save meal time"))
  expect(onSave).toHaveBeenCalledWith(new Date(2026, 10, 23, 12, 15))
})

test("does not allow a time in the future", async () => {
  const onSave = jest.fn()
  const screen = await render(
    <MealTimeSheet
      visible
      value={new Date(2026, 10, 24, 19, 0)}
      pending={false}
      error={null}
      now={now}
      onClose={jest.fn()}
      onSave={onSave}
    />,
  )
  expect(screen.getByText("Choose a time that is not in the future.")).toBeTruthy()
  await fireEvent.press(screen.getByLabelText("Save meal time"))
  expect(onSave).not.toHaveBeenCalled()
})

test("shows a save error from the server", async () => {
  const screen = await render(
    <MealTimeSheet
      visible
      value={new Date(2026, 10, 24, 12, 0)}
      pending={false}
      error="Could not save the meal time. Try again."
      now={now}
      onClose={jest.fn()}
      onSave={jest.fn()}
    />,
  )
  expect(screen.getByRole("alert")).toHaveTextContent("Could not save the meal time. Try again.")
})

test("the toast runs its action once and then closes", async () => {
  const onAction = jest.fn()
  const screen = await render(<ToastHost />)
  await act(async () => {
    showToast({ message: "Saved Phở bò", actionLabel: "View", onAction })
  })
  expect(screen.getByText("Saved Phở bò")).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "View" }))
  expect(onAction).toHaveBeenCalledTimes(1)
  expect(useToastStore.getState().toast).toBeNull()
  expect(screen.queryByText("Saved Phở bò")).toBeNull()
})
