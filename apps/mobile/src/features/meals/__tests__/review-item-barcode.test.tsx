import { act, fireEvent, render } from "@testing-library/react-native"
import { router, useLocalSearchParams } from "expo-router"

import { useMeals } from "../hooks/meals-hooks"
import { ReviewItemScreen } from "../screens/review-item-screen"

jest.mock("expo-router", () => ({
  router: { navigate: jest.fn(), back: jest.fn() },
  useLocalSearchParams: jest.fn(),
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))
jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAvoidingView: require("react-native").View,
}))
jest.mock("../hooks/meals-hooks", () => ({ useMeals: jest.fn() }))

test("a camera match prefills the form and changing the portion rescales nutrition before saving", async () => {
  const addItem = jest.fn(async () => {})
  jest.mocked(useMeals).mockReturnValue({ addItem, items: [], history: [] } as never)
  jest.mocked(useLocalSearchParams).mockReturnValue({
    barcode: "042100005264",
    name: "Packaged oats",
    unit: "g",
    kcal: "370",
    protein: "13",
    carbs: "60",
    fat: "7",
  })
  const screen = await render(<ReviewItemScreen />)
  expect(screen.getByDisplayValue("Packaged oats")).toBeTruthy()
  expect(screen.getByDisplayValue("370")).toBeTruthy()
  expect(addItem).not.toHaveBeenCalled()
  await fireEvent.changeText(screen.getByDisplayValue("100"), "50")
  expect(screen.getByDisplayValue("185")).toBeTruthy()
  await act(async () => {
    await fireEvent.press(screen.getByText("Add item"))
  })
  expect(addItem).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "Packaged oats",
      detail: "50g · reviewed",
      kcal: 185,
      macros: { protein: 6.5, carbs: 30, fat: 3.5 },
    }),
    undefined,
  )
  expect(router.navigate).toHaveBeenCalledWith("/meal")
})
