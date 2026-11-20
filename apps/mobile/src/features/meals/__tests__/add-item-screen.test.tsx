import { fireEvent, render } from "@testing-library/react-native"

import { useFoodSearch, useMeals } from "../hooks/meals-hooks"
import { AddItemScreen } from "../screens/add-item-screen"

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useLocalSearchParams: () => ({}),
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))
jest.mock("../hooks/meals-hooks", () => ({
  useMeals: jest.fn(),
  useFoodSearch: jest.fn(),
  estimatePortion: () => ({ kcal: 94, protein: 0.5, carbs: 25, fat: 0.4 }),
}))

const food = {
  id: "apple",
  name: "Apple",
  serving: "Per 100 g",
  unit: "g" as const,
  glyph: "leaf" as const,
  per100: { kcal: 52, protein: 0.3, carbs: 14, fat: 0.2 },
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useMeals).mockReturnValue({ addItem: jest.fn() } as never)
})

test("shows and selects a catalog food before searching", async () => {
  jest
    .mocked(useFoodSearch)
    .mockReturnValue({ matches: [food], loading: false, error: null } as never)
  const screen = await render(<AddItemScreen />)
  expect(useFoodSearch).toHaveBeenCalledWith("", true)
  expect(screen.getByText("Apple")).toBeTruthy()
  await fireEvent.press(screen.getByLabelText("Select Apple"))
  expect(screen.getByText("Nutrition estimate")).toBeTruthy()
})

test("distinguishes loading, failure, and an empty catalog", async () => {
  const retry = jest.fn()
  const search = jest.mocked(useFoodSearch)
  search.mockReturnValue({ matches: [], loading: true, error: null, retry } as never)
  const screen = await render(<AddItemScreen />)
  expect(screen.getByText("Loading foods…")).toBeTruthy()
  expect(screen.queryByText("No foods available")).toBeNull()

  search.mockReturnValue({
    matches: [],
    loading: false,
    error: "Could not load foods",
    retry,
  } as never)
  await screen.rerender(<AddItemScreen />)
  expect(screen.getByText("Could not load foods")).toBeTruthy()
  await fireEvent.press(screen.getByText("Try again"))
  expect(retry).toHaveBeenCalled()

  search.mockReturnValue({ matches: [], loading: false, error: null, retry } as never)
  await screen.rerender(<AddItemScreen />)
  expect(screen.getByText("No foods available")).toBeTruthy()
})
