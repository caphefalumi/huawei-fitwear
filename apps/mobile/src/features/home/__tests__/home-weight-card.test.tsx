import { act, fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { useHealth } from "@/features/health"
import { HomeScreen } from "@/features/home/screens/home-screen"
import { useMeals } from "@/features/meals"
import { useWorkouts } from "@/features/workout"

jest.mock("expo-router", () => ({ router: { push: jest.fn() }, useFocusEffect: jest.fn() }))
jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  apiRequest: jest.fn(),
}))
jest.mock("@/features/auth/hooks/auth-hooks", () => ({
  useAuth: () => ({ user: { name: "Vooc" } }),
}))
jest.mock("@/features/health", () => ({
  ...jest.requireActual("@/features/health"),
  useHealth: jest.fn(),
}))
jest.mock("@/features/meals", () => ({ useMeals: jest.fn() }))
jest.mock("@/features/workout", () => ({
  ...jest.requireActual("@/features/workout"),
  useWorkouts: jest.fn(),
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))

const readySummary = {
  targetDate: "2026-11-12",
  profileComplete: true,
  missingFields: [],
  targetReached: false,
  targets: { calorieTargetKcal: 2190, proteinTargetG: 140, carbsTargetG: 270, fatTargetG: 61 },
  consumed: { caloriesKcal: 650, proteinG: 42.3, carbsG: 80, fatG: 20 },
  remaining: { caloriesKcal: 1540, proteinG: 97.7, carbsG: 190.7, fatG: 40.8 },
  mealCount: 2,
}
const incompleteSummary = {
  ...readySummary,
  profileComplete: false,
  missingFields: ["heightCm", "currentWeightKg"],
  targetReached: false,
  targets: null,
  remaining: null,
}

async function renderHome(summary: unknown) {
  jest.mocked(useHealth).mockReturnValue({
    weightKg: 72,
    weightUpdated: true,
    plan: { goal: "Maintain", sessions: 3 },
    error: null,
    loading: false,
    refresh: jest.fn(),
  } as never)
  jest.mocked(useMeals).mockReturnValue({
    summary,
    loading: false,
    error: null,
    refresh: jest.fn(),
  } as never)
  jest.mocked(useWorkouts).mockReturnValue({
    sessions: [],
    loading: false,
    error: null,
    refresh: jest.fn(),
  } as never)

  jest.useFakeTimers()
  const screen = await render(<HomeScreen />)
  await act(() => {
    jest.advanceTimersByTime(600)
  })
  return screen
}

afterEach(() => {
  jest.useRealTimers()
  jest.clearAllMocks()
})

test("home shows the latest logged weight", async () => {
  const screen = await renderHome(readySummary)
  expect(screen.getByText("Logged Oct 8")).toBeTruthy()
})

test("home shows the real daily target, consumed and kcal left", async () => {
  const screen = await renderHome(readySummary)
  expect(screen.getAllByText(/1540 kcal left/).length).toBeGreaterThan(0)
  expect(screen.getByText(/650 consumed - 1540 kcal left of 2,190/)).toBeTruthy()
  expect(screen.getByText("42 / 140 g")).toBeTruthy()
  expect(screen.queryByText("Complete profile")).toBeNull()
})

test("home says when the target weight was reached", async () => {
  const screen = await renderHome({ ...readySummary, targetReached: true })
  expect(screen.getByText(/Target weight reached/)).toBeTruthy()
})

test("home asks to complete the profile instead of showing targets", async () => {
  const screen = await renderHome(incompleteSummary)
  expect(screen.getByText("Complete your profile to see your customized dashboard.")).toBeTruthy()
  expect(screen.getByText("650 kcal logged today")).toBeTruthy()
  expect(screen.queryByText(/kcal left/)).toBeNull()

  fireEvent.press(screen.getByLabelText("Complete profile"))
  expect(router.push).toHaveBeenCalledWith("/profile")
})
