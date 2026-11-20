import { act, fireEvent, render } from "@testing-library/react-native"
import { router, useLocalSearchParams } from "expo-router"

import { pickImage } from "@/features/camera"

import { readNutritionLabel, uploadMealPhoto } from "../api/meals-api"
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
jest.mock("@/features/camera", () => ({ pickImage: jest.fn() }))
jest.mock("../api/meals-api", () => ({ readNutritionLabel: jest.fn(), uploadMealPhoto: jest.fn() }))

beforeEach(() => jest.clearAllMocks())

test("changing the amount eaten scales nutrition without overwriting corrected label values", async () => {
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
  await fireEvent.changeText(screen.getByLabelText("Energy, kcal"), "380")
  await fireEvent.changeText(screen.getByLabelText("Amount eaten, g"), "50")
  expect(screen.getByLabelText("Energy, kcal").props.value).toBe("380")
  expect(screen.getByText(/190 kcal · 6.5 g protein/)).toBeTruthy()
  await act(async () => {
    await fireEvent.press(screen.getByText("Add item"))
  })
  expect(addItem).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "Packaged oats",
      detail: "50g · reviewed",
      kcal: 190,
      macros: { protein: 6.5, carbs: 30, fat: 3.5 },
    }),
    undefined,
  )
  expect(router.navigate).toHaveBeenCalledWith("/meal")
})

test("incomplete products keep known values but require missing nutrition before adding", async () => {
  const addItem = jest.fn(async () => {})
  jest.mocked(useMeals).mockReturnValue({ addItem, items: [], history: [] } as never)
  jest.mocked(useLocalSearchParams).mockReturnValue({
    barcode: "1000000000001",
    name: "Packaged snack",
    brand: "Example Brand",
    unit: "g",
    kcal: "145",
    fat: "0",
  })
  const screen = await render(<ReviewItemScreen />)
  expect(screen.getByText("Example Brand")).toBeTruthy()
  expect(screen.getByLabelText("Fat, g").props.value).toBe("0")
  expect(screen.getByLabelText("Protein, g").props.value).toBe("")
  expect(screen.getByText(/Missing: Protein, Carbs/)).toBeTruthy()
  await fireEvent.changeText(screen.getByLabelText("Amount eaten, g"), "100")
  await fireEvent.press(screen.getByText("Add item"))
  expect(addItem).not.toHaveBeenCalled()
  expect(screen.getByRole("alert")).toBeTruthy()
})

test("label photo requires consent, fills the printed serving basis, and leaves absent values blank", async () => {
  const addItem = jest.fn(async () => {})
  jest.mocked(useMeals).mockReturnValue({ addItem, items: [], history: [] } as never)
  jest.mocked(useLocalSearchParams).mockReturnValue({ barcode: "1000000000001", labelPhoto: "1" })
  jest.mocked(pickImage).mockResolvedValueOnce({
    uri: "file://label.webp",
    sourceUri: "file://label.jpg",
    mimeType: "image/webp",
  })
  jest.mocked(uploadMealPhoto).mockResolvedValueOnce("photo-id")
  jest.mocked(readNutritionLabel).mockResolvedValueOnce({
    name: "Drink",
    basis: { kind: "serving", unit: "ml", amount: 125 },
    nutrition: { kcal: 100, protein: null, carbs: 15.5, fat: 0 },
  })
  const screen = await render(<ReviewItemScreen />)
  await fireEvent.press(screen.getByText("Choose label photo"))
  expect(pickImage).toHaveBeenCalledWith(false, { allowsEditing: false })
  expect(uploadMealPhoto).not.toHaveBeenCalled()
  await fireEvent.press(await screen.findByText("Read label"))
  expect(await screen.findByDisplayValue("Drink")).toBeTruthy()
  expect(uploadMealPhoto).toHaveBeenCalledWith("file://label.webp")
  expect(readNutritionLabel).toHaveBeenCalledWith("photo-id")
  expect(screen.getByLabelText("Serving size on label, mL").props.value).toBe("125")
  expect(screen.getByLabelText("Fat, g").props.value).toBe("0")
  expect(screen.getByLabelText("Protein, g").props.value).toBe("")
  expect(screen.getByText(/transcribed, not verified/)).toBeTruthy()
  expect(addItem).not.toHaveBeenCalled()
  await fireEvent.changeText(screen.getByLabelText("Protein, g"), "1,5")
  await fireEvent.changeText(screen.getByLabelText("Amount eaten, mL"), "62,5")
  expect(screen.getByLabelText("Protein, g").props.value).toBe("1,5")
  await fireEvent.press(screen.getByText("Add item"))
  expect(addItem).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "Drink",
      detail: "62.5ml · reviewed",
      kcal: 50,
      macros: { protein: 0.75, carbs: 7.75, fat: 0 },
    }),
    undefined,
  )
})

test("failed label analysis leaves catalog and manual entry intact and can retry the uploaded photo", async () => {
  jest.mocked(useMeals).mockReturnValue({ items: [], history: [] } as never)
  jest.mocked(useLocalSearchParams).mockReturnValue({
    barcode: "1000000000001",
    labelPhoto: "1",
    unit: "g",
    name: "Packaged snack",
    kcal: "145",
  })
  jest.mocked(pickImage).mockResolvedValueOnce({
    uri: "file://label.webp",
    sourceUri: "file://label.jpg",
    mimeType: "image/webp",
  })
  jest.mocked(uploadMealPhoto).mockResolvedValueOnce("photo-id")
  jest
    .mocked(readNutritionLabel)
    .mockRejectedValueOnce(new Error("Offline"))
    .mockResolvedValueOnce({
      name: null,
      basis: { kind: "per100", unit: "g" },
      nutrition: { kcal: null, protein: 5, carbs: null, fat: 0 },
    })
  const screen = await render(<ReviewItemScreen />)
  await fireEvent.press(screen.getByText("Take label photo"))
  expect(pickImage).toHaveBeenCalledWith(true, { allowsEditing: false })
  await fireEvent.press(await screen.findByText("Read label"))
  await screen.findByRole("alert")
  expect(screen.getByLabelText("Energy, kcal").props.value).toBe("145")
  await fireEvent.changeText(screen.getByLabelText("Protein, g"), "7")
  await fireEvent.press(screen.getByText("Read label"))
  await screen.findByText(/transcribed, not verified/)
  expect(screen.getByLabelText("Protein, g").props.value).toBe("7")
  expect(screen.getByLabelText("Energy, kcal").props.value).toBe("145")
  expect(screen.getByLabelText("Fat, g").props.value).toBe("0")
  expect(uploadMealPhoto).toHaveBeenCalledTimes(1)
})
