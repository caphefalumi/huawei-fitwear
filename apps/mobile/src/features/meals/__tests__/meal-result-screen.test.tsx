import { act, fireEvent, render, waitFor } from "@testing-library/react-native"
import { router } from "expo-router"

import { useMeals, type MealItem, type MealLog } from "../hooks/meals-hooks"
import { MealResultScreen } from "../screens/meal-result-screen"

jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: require("react-native").View,
}))
jest.mock("@/features/auth", () => ({ useAuth: () => ({ user: { id: "user-1" } }) }))
jest.mock("@/lib/storage/meal-photo-cache", () => ({
  loadCachedMealPhoto: jest.fn(),
  removeCachedMealPhoto: jest.fn(async () => undefined),
}))
jest.mock("../components/meal-photo", () => ({ MealPhoto: () => null }))
jest.mock("../hooks/meals-hooks", () => ({
  ...jest.requireActual("../hooks/meals-hooks"),
  useMeals: jest.fn(),
}))

const food = (id: string, name: string, kcal: number, detail = "100g"): MealItem => ({
  id,
  name,
  detail,
  kcal,
  macros: { protein: 10, carbs: 20, fat: 4 },
  glyph: "wheat",
})
const rice = food("rice", "Cơm tấm", 600, "200g · reviewed")
const soup = food("soup", "Canh chua", 80)

const log: MealLog = {
  id: "lunch",
  name: "Lunch",
  date: "Nov 24, 2026",
  time: "12:20",
  targetDate: "2026-11-24",
  loggedAt: "2026-11-24T12:20:00.000Z",
  mealType: "lunch",
  imageUrl: null,
  items: [soup, rice],
  kcal: 680,
  macros: { protein: 20, carbs: 40, fat: 8 },
}

const updateItem = jest.fn(async () => undefined)
const removeItem = jest.fn(async () => undefined)

beforeEach(() => {
  jest.mocked(useMeals).mockReturnValue({
    mealName: "Lunch",
    mealType: "lunch",
    items: [],
    totals: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
    draftImage: null,
    busy: false,
    error: null,
    actionError: null,
    updateItem,
    removeItem,
  } as never)
})
afterEach(() => jest.clearAllMocks())

test("a saved meal is titled like its card, not by its meal type", async () => {
  const screen = await render(<MealResultScreen log={log} />)
  expect(screen.getByRole("header", { name: "Cơm tấm, Canh chua" })).toBeTruthy()
  expect(screen.queryByRole("header", { name: "Lunch" })).toBeNull()
})

test("an empty meal falls back to its meal type", async () => {
  const screen = await render(<MealResultScreen log={{ ...log, items: [] }} />)
  expect(screen.getByRole("header", { name: "Lunch" })).toBeTruthy()
})

test("the item sheet edits the name and rescales nutrition with the amount", async () => {
  const screen = await render(<MealResultScreen log={log} />)
  await fireEvent.press(screen.getByLabelText(/^Cơm tấm, 200g/))

  expect(screen.queryByText("Change amount")).toBeNull()
  expect(screen.getByText("Edit nutrition")).toBeTruthy()
  const save = screen.getByRole("button", { name: "Save changes" })
  expect(save.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }))

  await fireEvent.changeText(screen.getByLabelText("Name"), "Cơm gà")
  await fireEvent.changeText(screen.getByLabelText("Amount, g"), "100")
  expect(screen.getByText("300 kcal")).toBeTruthy()

  await fireEvent.press(screen.getByRole("button", { name: "Save changes" }))
  await waitFor(() => expect(updateItem).toHaveBeenCalledTimes(1))
  expect(updateItem).toHaveBeenCalledWith(
    "rice",
    expect.objectContaining({
      name: "Cơm gà",
      detail: "100g · reviewed",
      kcal: 300,
      macros: { protein: 5, carbs: 10, fat: 2 },
    }),
    "lunch",
  )
})

test("a name-only edit keeps the nutrition", async () => {
  const screen = await render(<MealResultScreen log={log} />)
  await fireEvent.press(screen.getByLabelText(/^Canh chua, 100g/))
  await fireEvent.changeText(screen.getByLabelText("Name"), "Canh chua cá")
  await fireEvent.press(screen.getByRole("button", { name: "Save changes" }))
  await waitFor(() => expect(updateItem).toHaveBeenCalled())
  expect(updateItem).toHaveBeenCalledWith(
    "soup",
    expect.objectContaining({ name: "Canh chua cá", detail: "100g", kcal: 80 }),
    "lunch",
  )
})

test("rejects an empty name or a non-positive amount without saving", async () => {
  const screen = await render(<MealResultScreen log={log} />)
  await fireEvent.press(screen.getByLabelText(/^Canh chua, 100g/))

  await fireEvent.changeText(screen.getByLabelText("Name"), "   ")
  await fireEvent.press(screen.getByRole("button", { name: "Save changes" }))
  expect(screen.getByText("Enter a name for this item.")).toBeTruthy()

  await fireEvent.changeText(screen.getByLabelText("Name"), "Canh")
  await fireEvent.changeText(screen.getByLabelText("Amount, g"), "0")
  await fireEvent.press(screen.getByRole("button", { name: "Save changes" }))
  expect(screen.getByText("Enter a positive portion.")).toBeTruthy()
  expect(updateItem).not.toHaveBeenCalled()
})

test("Edit nutrition still opens the review screen for the item", async () => {
  const screen = await render(<MealResultScreen log={log} />)
  await fireEvent.press(screen.getByLabelText(/^Cơm tấm, 200g/))
  await act(async () => {
    await fireEvent.press(screen.getByText("Edit nutrition"))
  })
  expect(router.push).toHaveBeenCalledWith("/review-item?id=rice&log=lunch")
})
