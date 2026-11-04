import { render } from "@testing-library/react-native";

import { useHealth } from "@/features/health/health-store";
import { HomeScreen } from "@/features/home/home-screen";
import { useMeals } from "@/features/meals/meals-store";
import { useWorkouts } from "@/features/workout/workout-store";

jest.mock("expo-router", () => ({ router: { push: jest.fn() }, useFocusEffect: jest.fn() }));
jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  apiRequest: jest.fn(),
}));
jest.mock("@/features/auth/auth-store", () => ({ useAuth: () => ({ user: { name: "Vooc" } }) }));
jest.mock("@/features/health/health-store", () => ({
  ...jest.requireActual("@/features/health/health-store"),
  useHealth: jest.fn(),
}));
jest.mock("@/features/meals/meals-store", () => ({ useMeals: jest.fn() }));
jest.mock("@/features/workout/workout-store", () => ({ useWorkouts: jest.fn() }));
jest.mock("@/features/recovery/recovery-sheet", () => ({ RecoverySheet: () => null }));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

test("home shows the latest logged weight and consumed calories", async () => {
  jest.mocked(useHealth).mockReturnValue({
    weightKg: 72,
    weightUpdated: true,
    recovery: null,
    error: null,
    loading: false,
    refresh: jest.fn(),
  } as never);
  jest.mocked(useMeals).mockReturnValue({
    loggedKcal: 0,
    loggedMacros: { protein: 0, carbs: 0, fat: 0 },
    loading: false,
    error: null,
    refresh: jest.fn(),
  } as never);
  jest.mocked(useWorkouts).mockReturnValue({
    sessions: [],
    loading: false,
    error: null,
    refresh: jest.fn(),
  } as never);

  const screen = await render(<HomeScreen />);

  expect(screen.getByText("Logged Oct 8")).toBeTruthy();
  expect(screen.getByText(/1,320 consumed/)).toBeTruthy();
});
