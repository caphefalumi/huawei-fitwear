import { fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { localDate, useMeals } from "../hooks/meals-hooks"
import { MealsCalendarScreen } from "../screens/meals-calendar-screen"
import { useJournalDay } from "../store/journal-day.store"
import { shiftDateKey } from "../utils/meal-journal"

jest.mock("expo-router", () => ({ router: { back: jest.fn(), push: jest.fn() } }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))
jest.mock("../hooks/meals-hooks", () => ({
  localDate: (date = new Date()) => jest.requireActual("../utils/meal-journal").toDateKey(date),
  useMeals: jest.fn(),
}))

const today = localDate(new Date())
const firstOfMonth = `${today.slice(0, 8)}01`

beforeEach(() => {
  useJournalDay.setState({ selectedDate: null })
  jest.mocked(useMeals).mockReturnValue({
    historyState: "ready",
    history: [
      { id: "a", targetDate: firstOfMonth, kcal: 1500 },
      { id: "b", targetDate: firstOfMonth, kcal: 500 },
    ],
  } as never)
})

test("marks logged days and opens the picked day on the Meals tab", async () => {
  const screen = await render(<MealsCalendarScreen />)
  expect(screen.getByLabelText(/, 2000 kilocalories$/)).toBeTruthy()
  expect(screen.getByText("2,000")).toBeTruthy()
  expect(screen.getByText("day logged")).toBeTruthy()
  // The current month is the latest one.
  expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled()

  await fireEvent.press(screen.getByTestId(`calendar-day-${firstOfMonth}`))
  expect(useJournalDay.getState().selectedDate).toBe(firstOfMonth === today ? null : firstOfMonth)
  expect(router.back).toHaveBeenCalled()
})

test("future days cannot be picked and past months are reachable", async () => {
  const screen = await render(<MealsCalendarScreen />)
  const tomorrow = shiftDateKey(today, 1)
  if (tomorrow.slice(0, 7) === today.slice(0, 7))
    expect(screen.getByTestId(`calendar-day-${tomorrow}`)).toBeDisabled()
  await fireEvent.press(screen.getByRole("button", { name: "Previous month" }))
  expect(screen.getByRole("button", { name: "Next month" })).toBeEnabled()
  expect(screen.getByText("0")).toBeTruthy()
})
