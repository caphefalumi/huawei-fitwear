import { act, fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { apiRequest } from "@/lib/api/client"

import { useMeals } from "../hooks/meals-hooks"
import { AddItemScreen } from "../screens/add-item-screen"

jest.mock("expo-camera", () => ({
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
  CameraView: ({ onBarcodeScanned }: { onBarcodeScanned: (event: object) => void }) => {
    const { Pressable } = require("react-native")
    return (
      <Pressable
        accessibilityLabel="Camera scan"
        onPress={() => {
          const event = { type: "upc_e", data: "04252614" }
          onBarcodeScanned(event)
          onBarcodeScanned(event)
        }}
      />
    )
  },
}))
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useLocalSearchParams: () => ({ log: "existing-meal" }),
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))
jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  apiRequest: jest.fn(),
}))
jest.mock("../hooks/meals-hooks", () => ({
  ...jest.requireActual("../hooks/meals-hooks"),
  useMeals: jest.fn(),
  useFoodSearch: () => ({ matches: [], loading: false }),
}))

const addItem = jest.fn(async () => {})

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useMeals).mockReturnValue({ addItem } as never)
})

test("a scan prefills nutrition and logging uses the edited portion in the selected meal", async () => {
  jest.mocked(apiRequest).mockResolvedValue({
    food: {
      id: "off-042100005264",
      name: "Packaged oats",
      servingUnit: "g",
      glyph: "wheat",
      caloriesPer100: 370,
      proteinPer100G: 13,
      carbsPer100G: 60,
      fatPer100G: 7,
    },
  })
  const screen = await render(<AddItemScreen />)
  await fireEvent.press(screen.getByText("Scan barcode"))
  await act(async () => {
    await fireEvent.press(screen.getByLabelText("Camera scan"))
  })
  expect(apiRequest).toHaveBeenCalledTimes(1)
  expect(apiRequest).toHaveBeenCalledWith("/foods/barcode/042100005264", expect.any(Object))
  expect(screen.getByText("Packaged oats")).toBeTruthy()
  expect(screen.getByDisplayValue("370")).toBeTruthy()
  expect(addItem).not.toHaveBeenCalled()

  await fireEvent.changeText(screen.getByDisplayValue("100"), "50")
  expect(screen.getByDisplayValue("185")).toBeTruthy()
  await act(async () => {
    await fireEvent.press(screen.getByText("Add Item"))
  })
  expect(addItem).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "Packaged oats",
      detail: "50g",
      kcal: 185,
      macros: { protein: 6.5, carbs: 30, fat: 3.5 },
    }),
    "existing-meal",
  )
})

test("an unknown barcode leaves the existing meal available for manual entry", async () => {
  jest.mocked(apiRequest).mockResolvedValue({ food: null })
  const screen = await render(<AddItemScreen />)
  await fireEvent.press(screen.getByText("Scan barcode"))
  await act(async () => {
    await fireEvent.press(screen.getByLabelText("Camera scan"))
  })
  expect(screen.getByText(/No complete nutrition data/)).toBeTruthy()
  await fireEvent.press(screen.getByText("Enter nutrition manually"))
  expect(router.push).toHaveBeenCalledWith({
    pathname: "/review-item",
    params: { name: "", log: "existing-meal" },
  })
  expect(addItem).not.toHaveBeenCalled()
})
