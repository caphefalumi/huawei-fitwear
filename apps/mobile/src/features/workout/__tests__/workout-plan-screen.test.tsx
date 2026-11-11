import { act, fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { useHealth } from "@/features/health"
import { useInjuries } from "@/features/recovery"
import { usePlanPreferences } from "@/features/workout"
import { WorkoutPlanScreen } from "@/features/workout/screens/workout-plan-screen"
import { useDemoClock } from "@/lib/time/demo-clock"

jest.mock("expo-router", () => {
  const { useEffect } = require("react")
  return {
    router: { push: jest.fn() },
    useFocusEffect: (effect: () => void) => useEffect(effect, [effect]),
  }
})
jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  apiRequest: jest.fn(),
}))
jest.mock("@/features/auth/hooks/auth-hooks", () => ({ useAuth: jest.fn() }))
jest.mock("@/features/health", () => ({
  ...jest.requireActual("@/features/health"),
  useHealth: jest.fn(),
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useHealth).mockReturnValue({
    sex: "Male",
    plan: { goal: "Maintain", sessions: 3, activity: "Moderate", targetWeightKg: null },
  } as never)
  useInjuries.setState({ injuries: [] })
  usePlanPreferences.setState({ minutes: 45, likes: [], dislikes: [] })
  // Demo date on the coming Monday, so Monday, Wednesday and Friday are training days.
  useDemoClock.setState({ offsetDays: (8 - new Date().getDay()) % 7 })
})

test("shows each day's session in the week strip and previews a tapped day", async () => {
  const screen = await render(<WorkoutPlanScreen />)
  expect(screen.getByLabelText(/^Mon \d+, Full Body [AB]$/)).toBeTruthy()
  expect(screen.getByLabelText(/^Tue \d+, Rest day$/)).toBeTruthy()
  expect(screen.getByRole("header", { name: "Today" })).toBeTruthy()

  await fireEvent.press(screen.getByLabelText(/^Tue \d+, Rest day$/))
  expect(screen.getByRole("header", { name: "Tuesday" })).toBeTruthy()
  expect(screen.getAllByText("Rest and recover.").length).toBeGreaterThan(0)

  await fireEvent.press(screen.getByLabelText(/^Wed \d+, Full Body [AB]$/))
  expect(screen.getByRole("header", { name: "Wednesday" })).toBeTruthy()
  expect(screen.getByText("Planned")).toBeTruthy()
})

test("opens exercise preferences from Edit plan", async () => {
  const screen = await render(<WorkoutPlanScreen />)
  await fireEvent.press(screen.getByText("Edit plan"))
  expect(router.push).toHaveBeenCalledWith("/exercise-preferences")
})

test("says what changed when the plan settings change", async () => {
  const screen = await render(<WorkoutPlanScreen />)
  expect(screen.queryByText(/^Plan updated/)).toBeNull()
  await act(async () => usePlanPreferences.getState().setMinutes(30))
  expect(screen.getByText("Plan updated · 30 min")).toBeTruthy()
})
