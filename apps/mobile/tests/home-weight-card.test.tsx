import { fireEvent, render } from "@testing-library/react-native";

import { useHealth } from "@/features/health/health-store";
import { HomeScreen } from "@/features/home/home-screen";
import { useMeals } from "@/features/meals/meals-store";
import { useWorkouts } from "@/features/workout/workout-store";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));
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

const summary = {
  targets: { calorieTargetKcal: 2773, proteinTargetG: 115, carbsTargetG: 404, fatTargetG: 77 },
  consumed: { caloriesKcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  remaining: { caloriesKcal: 2773 },
};

function mockStores(weights: { id: string; loggedDate: string; weightKg: number }[]) {
  jest.mocked(useHealth).mockReturnValue({
    weightKg: weights.at(-1)?.weightKg ?? null,
    weights,
    weightUpdated: true,
    recovery: null,
    error: null,
    loading: false,
    refresh: jest.fn(),
  } as never);
  jest.mocked(useMeals).mockReturnValue({
    summary,
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
}

const log = (id: string, loggedDate: string, weightKg: number) => ({ id, loggedDate, weightKg });

test("a single weight log shows the value and an info hint instead of a chart", async () => {
  mockStores([log("a", "2026-11-03", 64)]);
  const screen = await render(<HomeScreen />);

  expect(screen.getByText("64.0")).toBeTruthy();
  expect(screen.queryByLabelText(/^Weight chart/)).toBeNull();
  expect(screen.queryByText(/chart appears after/i)).toBeNull();
  await fireEvent.press(screen.getByLabelText("About the weight chart"));
  expect(screen.getByText("Chart appears after 2 weight logs.")).toBeTruthy();
  await fireEvent.press(screen.getByLabelText("About the weight chart"));
  expect(screen.queryByText(/chart appears after/i)).toBeNull();
});

test("two weight logs show the chart and no info button", async () => {
  mockStores([log("a", "2026-11-02", 64.4), log("b", "2026-11-03", 64)]);
  const screen = await render(<HomeScreen />);

  expect(screen.getByLabelText(/^Weight chart/)).toBeTruthy();
  expect(screen.queryByLabelText("About the weight chart")).toBeNull();
});

test("nutrition summary reads consumed of target, not remaining twice", async () => {
  mockStores([log("a", "2026-11-03", 64)]);
  const screen = await render(<HomeScreen />);

  expect(screen.getByText("0 of 2,773 kcal")).toBeTruthy();
  expect(screen.queryByText(/consumed/)).toBeNull();
});

test("the weight saved banner is dismissed by its circular X", async () => {
  mockStores([log("a", "2026-11-03", 64)]);
  const screen = await render(<HomeScreen />);

  expect(screen.getByText("Weight saved")).toBeTruthy();
  await fireEvent.press(screen.getByLabelText("Dismiss weight saved notification"));
  expect(screen.queryByText("Weight saved")).toBeNull();
});
