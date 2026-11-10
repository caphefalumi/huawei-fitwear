import { act, render } from "@testing-library/react-native"

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

test("home shows the latest logged weight and consumed calories", async () => {
  jest.mocked(useHealth).mockReturnValue({
    weightKg: 72,
    weightUpdated: true,
    plan: { goal: "Maintain", sessions: 3 },
    error: null,
    loading: false,
    refresh: jest.fn(),
  } as never)
  jest.mocked(useMeals).mockReturnValue({
    loggedKcal: 0,
    loggedMacros: { protein: 0, carbs: 0, fat: 0 },
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
  try {
    const screen = await render(<HomeScreen />)
    await act(() => {
      jest.advanceTimersByTime(600)
    })

    expect(screen.getByText("Logged Oct 8")).toBeTruthy()
    expect(screen.getByText(/1,320 consumed/)).toBeTruthy()
  } finally {
    jest.useRealTimers()
  }
})
