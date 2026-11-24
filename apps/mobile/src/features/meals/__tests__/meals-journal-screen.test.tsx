import { act, fireEvent, render, waitFor } from "@testing-library/react-native"
import { router } from "expo-router"

import { useDeviceFlag } from "@/lib/storage/device-flags"
import { createQueryWrapper } from "@/test-utils/query-wrapper"

import { fetchMealPhoto } from "../api/meals-api"
import { localDate, useDaySummary, useMeals, type MealLog } from "../hooks/meals-hooks"
import { MealsJournalScreen } from "../screens/meals-journal-screen"
import { useJournalDay } from "../store/journal-day.store"
import { shiftDateKey, weekOf } from "../utils/meal-journal"

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: require("react-native").View,
}))
jest.mock("@/features/auth", () => ({ useAuth: () => ({ user: { id: "user-1" } }) }))
jest.mock("@/lib/storage/meal-photo-cache", () => ({
  loadCachedMealPhoto: (_user: string, _meal: string, load: () => Promise<string | null>) => load(),
  removeCachedMealPhoto: jest.fn(async () => undefined),
}))
jest.mock("@/lib/storage/device-flags", () => ({ useDeviceFlag: jest.fn() }))
jest.mock("../api/meals-api", () => ({ fetchMealPhoto: jest.fn() }))
jest.mock("../hooks/meals-hooks", () => ({
  ...jest.requireActual("../hooks/meals-hooks"),
  useMeals: jest.fn(),
  useDaySummary: jest.fn(),
}))

const today = localDate()
const yesterday = shiftDateKey(today, -1)
const at = (dateKey: string, time: string) => new Date(`${dateKey}T${time}:00`).toISOString()
const food = (name: string, kcal: number) => ({
  id: name,
  name,
  detail: "100g",
  kcal,
  macros: { protein: 10, carbs: 20, fat: 5 },
  glyph: "wheat" as const,
})
const meal = (overrides: Partial<MealLog> & Pick<MealLog, "id" | "items">): MealLog => ({
  name: "Lunch",
  mealType: "lunch",
  targetDate: today,
  loggedAt: at(today, "12:00"),
  date: today,
  time: "12:00",
  imageUrl: null,
  kcal: overrides.items.reduce((sum, item) => sum + item.kcal, 0),
  macros: { protein: 10, carbs: 20, fat: 5 },
  ...overrides,
})

const history = [
  meal({
    id: "lunch",
    imageUrl: "/meals/lunch/photo",
    items: [food("Canh chua", 80), food("Cơm tấm", 600)],
  }),
  meal({
    id: "breakfast",
    name: "Breakfast",
    mealType: "breakfast",
    loggedAt: at(today, "08:00"),
    time: "08:00",
    items: [food("Bánh mì", 400)],
  }),
  meal({
    id: "dinner",
    name: "Dinner",
    mealType: "dinner",
    targetDate: yesterday,
    loggedAt: at(yesterday, "19:00"),
    time: "19:00",
    photoUnavailableOffline: true,
    items: [food("Phở bò", 450)],
  }),
]
const deleteLogWithUndo = jest.fn()
const dismissTip = jest.fn()
const meals = (overrides: Record<string, unknown> = {}) =>
  jest.mocked(useMeals).mockReturnValue({
    historyState: "ready",
    history,
    deleteLogWithUndo,
    ...overrides,
  } as never)

let clearCache: (() => void) | undefined
beforeEach(() => {
  useJournalDay.setState({ selectedDate: null })
  jest.mocked(useDeviceFlag).mockReturnValue([false, dismissTip])
  jest.mocked(useDaySummary).mockReturnValue({
    targets: { calorieTargetKcal: 2100, proteinTargetG: 150, carbsTargetG: 250, fatTargetG: 60 },
  } as never)
  jest.mocked(fetchMealPhoto).mockResolvedValue("data:image/jpeg;base64,cGhvdG8=")
})
afterEach(() => {
  clearCache?.()
  jest.clearAllMocks()
})

async function renderScreen() {
  const wrapper = createQueryWrapper(undefined, (client) => {
    clearCache = () => client.clear()
  })
  return render(<MealsJournalScreen />, { wrapper })
}

const cardLabels = (screen: Awaited<ReturnType<typeof renderScreen>>) =>
  screen
    .getAllByRole("button", { name: /kilocalories$/ })
    .map((card) => card.props.accessibilityLabel as string)
    .filter((label) => !/^\w+day, /.test(label))

test("shows the selected day with its total against the target", async () => {
  meals()
  const screen = await renderScreen()

  expect(screen.getByRole("header", { name: "Today" })).toBeTruthy()
  expect(screen.getByText("1,080 / 2,100 kcal")).toBeTruthy()
  expect(cardLabels(screen)).toEqual([
    expect.stringMatching(/^Bánh mì, Breakfast at 08:00/),
    expect.stringMatching(/^Cơm tấm, Canh chua, Lunch at 12:00/),
  ])
  await waitFor(() => expect(screen.getByLabelText("Logged meal photo")).toBeTruthy())
  expect(screen.queryAllByRole("button", { name: /^View photo of/ })).toHaveLength(0)
  await fireEvent.press(screen.getByRole("button", { name: /^Cơm tấm, Canh chua/ }))
  expect(router.push).toHaveBeenCalledWith("/meal?log=lunch")
})

test("the info button reveals macro progress against the profile targets", async () => {
  meals()
  const screen = await renderScreen()
  expect(screen.queryByText("20/150g Protein")).toBeNull()
  await fireEvent.press(screen.getByRole("button", { name: "Show macro breakdown" }))
  expect(screen.getByText("20/150g Protein")).toBeTruthy()
  expect(screen.getByText("40/250g Carbs")).toBeTruthy()
  expect(screen.getByText("10/60g Fat")).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Hide macro breakdown" }))
  expect(screen.queryByText("20/150g Protein")).toBeNull()
})

test("every day in the week can be opened, including days without meals", async () => {
  meals()
  const screen = await renderScreen()
  const empty = weekOf(today).find((key) => key !== today && key !== yesterday)!
  const label = new Date(`${empty}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
  await fireEvent.press(screen.getByRole("button", { name: `${label}, no meals` }))
  expect(useJournalDay.getState().selectedDate).toBe(empty)
  expect(screen.getByText(/^No meals logged on /)).toBeTruthy()
  expect(screen.queryByRole("button", { name: /^Bánh mì/ })).toBeNull()

  await act(async () => useJournalDay.getState().selectDate(yesterday))
  expect(screen.getByRole("header", { name: "Yesterday" })).toBeTruthy()
  expect(cardLabels(screen)).toEqual([expect.stringMatching(/^Phở bò, Dinner at 19:00/)])
  await fireEvent.press(screen.getByRole("button", { name: "‹ Today" }))
  expect(useJournalDay.getState().selectedDate).toBeNull()

  await fireEvent.press(screen.getByRole("button", { name: "Meals history ›" }))
  expect(router.push).toHaveBeenCalledWith("/meals-history")
})

test("searches food names across the whole history", async () => {
  meals()
  const screen = await renderScreen()
  await fireEvent.changeText(screen.getByLabelText("Search food"), "pho")
  expect(cardLabels(screen)).toEqual([expect.stringMatching(/^Phở bò/)])
  expect(screen.getByRole("header", { name: "Yesterday" })).toBeTruthy()
  expect(screen.getByText("1 meal")).toBeTruthy()
  expect(screen.queryByRole("button", { name: "Show macro breakdown" })).toBeNull()

  await fireEvent.changeText(screen.getByLabelText("Search food"), "sushi")
  expect(screen.getByText("No meals match “sushi”.")).toBeTruthy()
})

test("the swipe tip can be dismissed and deleting goes through Undo", async () => {
  meals()
  const screen = await renderScreen()
  expect(screen.getByText("Swipe left on a meal to delete it.")).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Dismiss tip" }))
  expect(dismissTip).toHaveBeenCalled()

  // The Delete action is not mounted until a swipe reveals it.
  expect(screen.queryByText("Delete")).toBeNull()
  await fireEvent(screen.getByRole("button", { name: /^Bánh mì/ }), "accessibilityAction", {
    nativeEvent: { actionName: "delete" },
  })
  expect(deleteLogWithUndo).toHaveBeenCalledWith("breakfast")
})

test("a dismissed tip stays hidden", async () => {
  meals()
  jest.mocked(useDeviceFlag).mockReturnValue([true, dismissTip])
  const screen = await renderScreen()
  expect(screen.queryByText("Swipe left on a meal to delete it.")).toBeNull()
})

test("an empty journal offers ways to log the first meal", async () => {
  meals({ history: [] })
  const screen = await renderScreen()
  expect(screen.getByRole("header", { name: "No meals yet" })).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Capture a meal" }))
  expect(router.push).toHaveBeenCalledWith("/capture")
  await fireEvent.press(screen.getByRole("button", { name: "Add food manually" }))
  expect(router.push).toHaveBeenCalledWith("/meal")
})
