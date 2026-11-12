import { act, render } from "@testing-library/react-native"

import { NutritionScreen } from "@/features/home/screens/nutrition-screen"
import { useMeals } from "@/features/meals"

jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }))
jest.mock("@/features/meals", () => ({ useMeals: jest.fn() }))
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

function mockMeals(value: unknown, error: string | null = null) {
  jest.mocked(useMeals).mockReturnValue({ summary: value, error } as never)
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
    missingFields: ["gender"],
    targetReached: false,
    targets: null,
    remaining: null,
  })
  const screen = await renderScreen()
  expect(screen.getByText("Complete your profile to see your customized dashboard.")).toBeTruthy()
  expect(screen.getByText("Logged today")).toBeTruthy()
  expect(screen.getByText("42 g")).toBeTruthy()
  expect(screen.queryByText("Daily target")).toBeNull()
})

test("nutrition shows the load error while the summary is missing", async () => {
  mockMeals(null, "Couldn't load your meals.")
  const screen = await renderScreen()
  expect(screen.getByText("Couldn't load your meals.")).toBeTruthy()
})
