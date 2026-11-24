import { act, fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { NutritionScreen } from "@/features/home/screens/nutrition-screen"
import { useMeals } from "@/features/meals"

jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }))
jest.mock("@/features/meals", () => {
  const { Text } = require("react-native")
  return {
    useMeals: jest.fn(),
    localDate: () => "2026-11-12",
    MealHistoryCard: ({ meal, onPress }: { meal: { id: string }; onPress: () => void }) => (
      <Text accessibilityRole="button" onPress={onPress}>
        {`Meal ${meal.id}`}
      </Text>
    ),
  }
})
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))

const summary = {
  targetDate: "2026-11-12",
  profileComplete: true,
  missingFields: [],
  targetReached: false,
  targets: { calorieTargetKcal: 2190, proteinTargetG: 140, carbsTargetG: 270, fatTargetG: 61 },
  consumed: { caloriesKcal: 650, proteinG: 42.3, carbsG: 80, fatG: 20 },
  remaining: { caloriesKcal: 1540, proteinG: 97.7, carbsG: 190.7, fatG: 40.8 },
  mealCount: 2,
}

function mockMeals(value: unknown, error: string | null = null, history: unknown[] = []) {
  jest.mocked(useMeals).mockReturnValue({ summary: value, error, history } as never)
}

// The ring and bars animate; let them finish inside act so tests stay warning free.
async function renderScreen() {
  jest.useFakeTimers()
  const screen = await render(<NutritionScreen />)
  await act(() => {
    jest.advanceTimersByTime(1000)
  })
  return screen
}

afterEach(() => {
  jest.useRealTimers()
})

test("nutrition shows the derived target, remaining kcal and macro grams", async () => {
  mockMeals(summary)
  const screen = await renderScreen()
  expect(screen.getByText("650 kcal")).toBeTruthy()
  expect(screen.getByText("2,190 kcal")).toBeTruthy()
  expect(screen.getByText("1,540 kcal")).toBeTruthy()
  expect(screen.getByText("98 g remaining")).toBeTruthy()
  expect(screen.queryByText("Complete profile")).toBeNull()
})

test("nutrition asks to complete the profile and lists what was logged", async () => {
  mockMeals({
    ...summary,
    profileComplete: false,
    missingFields: ["gender", "activityLevel"],
    targetReached: false,
    targets: null,
    remaining: null,
  })
  const screen = await renderScreen()
  expect(screen.getByText("Complete your profile to see your customized dashboard.")).toBeTruthy()
  expect(screen.getByText("Still needed: Sex / gender, Daily activity")).toBeTruthy()
  expect(screen.getByText("Logged today")).toBeTruthy()
  expect(screen.getByText("42 g")).toBeTruthy()
  expect(screen.queryByText("Daily target")).toBeNull()
})

test("nutrition shows the load error while the summary is missing", async () => {
  mockMeals(null, "Couldn't load your meals.")
  const screen = await renderScreen()
  expect(screen.getByText("Couldn't load your meals.")).toBeTruthy()
})

test("nutrition lists today's meals in eating order and opens one", async () => {
  mockMeals(summary, null, [
    { id: "dinner", targetDate: "2026-11-12", loggedAt: "2026-11-12T12:00:00.000Z" },
    { id: "older", targetDate: "2026-11-11", loggedAt: "2026-11-11T05:00:00.000Z" },
    { id: "breakfast", targetDate: "2026-11-12", loggedAt: "2026-11-12T01:00:00.000Z" },
  ])
  const screen = await renderScreen()
  expect(screen.getByRole("header", { name: "Today's meals" })).toBeTruthy()
  expect(screen.getAllByText(/^Meal /).map((node) => node.props.children)).toEqual([
    "Meal breakfast",
    "Meal dinner",
  ])
  await fireEvent.press(screen.getByText("Meal dinner"))
  expect(router.push).toHaveBeenCalledWith("/meal?log=dinner")
})

test("nutrition invites logging when nothing was eaten today", async () => {
  mockMeals(summary)
  const screen = await renderScreen()
  expect(screen.getByText("No meals logged today.")).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Capture a meal" }))
  expect(router.push).toHaveBeenCalledWith("/capture")
})
