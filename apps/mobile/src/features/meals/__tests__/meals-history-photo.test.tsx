import { render, waitFor } from "@testing-library/react-native"

import { createQueryWrapper } from "@/test-utils/query-wrapper"

import { fetchMealPhoto } from "../api/meals-api"
import { useMeals } from "../hooks/meals-hooks"
import { MealsHistoryScreen } from "../screens/meals-history-screen"

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))
jest.mock("@/features/auth", () => ({ useAuth: () => ({ user: { id: "user-1" } }) }))
jest.mock("../api/meals-api", () => ({ fetchMealPhoto: jest.fn() }))
jest.mock("../hooks/meals-hooks", () => ({
  useMeals: jest.fn(),
  mealsQueryKeys: { photo: (userId: string, mealId: string) => ["meals", userId, "photo", mealId] },
}))

test("history shows each saved meal photo and identifies meals without photos", async () => {
  jest.mocked(useMeals).mockReturnValue({
    historyState: "ready",
    history: [
      {
        id: "one",
        name: "Lunch",
        imageUrl: "/meals/one/photo",
        kcal: 100,
        date: "Today",
        time: "12:00",
        macros: {},
      },
      {
        id: "two",
        name: "Dinner",
        imageUrl: null,
        kcal: 200,
        date: "Today",
        time: "18:00",
        macros: {},
      },
    ],
  } as never)
  jest.mocked(fetchMealPhoto).mockResolvedValue("data:image/jpeg;base64,cGhvdG8=")

  const screen = await render(<MealsHistoryScreen />, { wrapper: createQueryWrapper() })
  await waitFor(() =>
    expect(screen.getByLabelText("Logged meal photo").props.source).toEqual([
      { uri: "data:image/jpeg;base64,cGhvdG8=" },
    ]),
  )
  expect(fetchMealPhoto).toHaveBeenCalledWith("one", expect.anything())
  expect(screen.getByLabelText("Meal without a photo")).toBeTruthy()
})
