import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { router } from "expo-router"

import { createQueryWrapper } from "@/test-utils/query-wrapper"

import { fetchMealPhoto } from "../api/meals-api"
import { useMeals } from "../hooks/meals-hooks"
import { MealsHistoryScreen } from "../screens/meals-history-screen"

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: require("react-native").View,
}))
jest.mock("@/features/auth", () => ({ useAuth: () => ({ user: { id: "user-1" } }) }))
jest.mock("../api/meals-api", () => ({ fetchMealPhoto: jest.fn() }))
jest.mock("../hooks/meals-hooks", () => ({
  useMeals: jest.fn(),
  mealsQueryKeys: { photo: (userId: string, mealId: string) => ["meals", userId, "photo", mealId] },
}))

let clearCache: (() => void) | undefined
afterEach(() => clearCache?.())

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

  const wrapper = createQueryWrapper(undefined, (client) => {
    clearCache = () => client.clear()
  })
  const screen = await render(<MealsHistoryScreen />, { wrapper })
  await waitFor(() =>
    expect(screen.getByLabelText("Logged meal photo").props.source).toEqual([
      { uri: "data:image/jpeg;base64,cGhvdG8=" },
    ]),
  )
  expect(fetchMealPhoto).toHaveBeenCalledWith("one", expect.anything())
  expect(screen.getByLabelText("Meal without a photo")).toBeTruthy()

  expect(screen.getAllByRole("button", { name: "View meal photo full screen" })).toHaveLength(1)
  await fireEvent.press(screen.getByRole("button", { name: "View meal photo full screen" }))
  expect(screen.getByLabelText("Full-screen meal photo")).toHaveProp("contentFit", "contain")
  expect(screen.getByLabelText("Full-screen meal photo").props.source).toEqual(
    screen.getByLabelText("Logged meal photo").props.source,
  )
  expect(router.push).not.toHaveBeenCalled()
  await fireEvent.press(screen.getByRole("button", { name: "Close" }))
  expect(screen.queryByLabelText("Full-screen meal photo")).toBeNull()
  await fireEvent.press(screen.getByText("Lunch"))
  expect(router.push).toHaveBeenCalledWith("/meal?log=one")

  await screen.unmount()
  const reopened = await render(<MealsHistoryScreen />, { wrapper })
  expect(reopened.getByLabelText("Logged meal photo")).toBeTruthy()
  expect(fetchMealPhoto).toHaveBeenCalledTimes(1)
  await reopened.unmount()
})
