import { act, fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { useMeals } from "@/features/meals"
import { MealCaptureScreen } from "@/features/meals/screens/capture-screen"
import { apiRequest } from "@/lib/api/client"

const mockTakePicture = jest.fn()
const mockRequestPermission = jest.fn()
let mockCameraGranted = true
jest.mock("../screens/meal-camera", () => ({
  useMealCamera: (options: {
    active: boolean
    scan: boolean
    onBarcode: (data: string, compressed: boolean) => void
  }) => {
    const { View } = require("react-native")
    return {
      cameraGranted: mockCameraGranted,
      cameraAvailable: true,
      requestPermission: mockRequestPermission,
      takePhoto: mockTakePicture,
      preview:
        options.active && mockCameraGranted ? (
          <View
            testID="meal-capture-camera"
            onBarcodeScanned={options.scan ? options.onBarcode : undefined}
          />
        ) : null,
    }
  },
}))
jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }))
jest.mock("expo-router/react-navigation", () => ({ useIsFocused: () => true }))
jest.mock("expo-image-manipulator", () => ({
  SaveFormat: { WEBP: "webp" },
  ImageManipulator: {
    manipulate: () => ({
      renderAsync: async () => ({
        saveAsync: async () => ({
          uri: "file://meal.webp",
          base64: "UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=",
        }),
      }),
    }),
  },
}))
jest.mock("@/features/camera", () => ({
  pickImage: jest.fn(),
  prepareMealImage: jest.requireActual("@/features/camera/api/image-picker").prepareMealImage,
}))
jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  apiRequest: jest.fn(),
}))
jest.mock("@/features/meals/hooks/meals-hooks", () => ({ useMeals: jest.fn() }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))
jest.mock("react-native-reanimated", () => ({ useReducedMotion: () => true }))
import { createQueryWrapper } from "@/test-utils/query-wrapper"
jest.mock("react-native-keyboard-controller", () => {
  const { View } = require("react-native")
  return { KeyboardAvoidingView: View }
})

const dismissTutorial = jest.fn()
function mockMeals(tutorialSeen: boolean) {
  jest.mocked(useMeals).mockReturnValue({
    tutorialSeen,
    dismissTutorial,
    setAnalysis: jest.fn(),
    setDraftPhoto: jest.fn(),
    items: [],
  } as never)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockCameraGranted = true
})

test("camera detects a barcode once, previews it, and waits for confirmation", async () => {
  mockMeals(true)
  jest.mocked(apiRequest).mockResolvedValueOnce({
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
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })
  const camera = screen.getByTestId("meal-capture-camera")
  await act(async () => {
    await Promise.all([
      fireEvent(camera, "barcodeScanned", "04252614", true),
      fireEvent(camera, "barcodeScanned", "04252614", true),
    ])
  })
  expect(apiRequest).toHaveBeenCalledTimes(1)
  expect(apiRequest).toHaveBeenCalledWith("/foods/barcode/042100005264", expect.any(Object))
  expect(screen.getByText("Packaged oats")).toBeTruthy()
  expect(router.push).not.toHaveBeenCalled()
  await fireEvent.press(screen.getByText("Review product"))
  expect(router.push).toHaveBeenCalledWith({
    pathname: "/review-item",
    params: {
      barcode: "042100005264",
      name: "Packaged oats",
      unit: "g",
      kcal: "370",
      protein: "13",
      carbs: "60",
      fat: "7",
    },
  })
})

test("a dismissed result does not reopen for the same barcode, and another code can use manual entry", async () => {
  mockMeals(true)
  jest.mocked(apiRequest).mockResolvedValue({ food: null })
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })
  const scan = (data: string) =>
    fireEvent(screen.getByTestId("meal-capture-camera"), "barcodeScanned", data, false)
  await act(async () => {
    await scan("3017620422003")
  })
  await fireEvent.press(screen.getByLabelText("Dismiss barcode result"))
  await act(async () => {
    await scan("3017620422003")
  })
  expect(apiRequest).toHaveBeenCalledTimes(1)
  await act(async () => {
    await scan("3017620422004")
  })
  expect(screen.getByText(/No nutrition data found/)).toBeTruthy()
  await fireEvent.press(screen.getByText("Enter nutrition manually"))
  expect(router.push).toHaveBeenCalledWith({ pathname: "/review-item", params: {} })
})

test("first capture shows two tips and no longer shows the old intro or guideline label", async () => {
  mockMeals(false)
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })

  expect(screen.getByText("Capture your meal")).toBeTruthy()
  expect(screen.getByText("Add a ruler")).toBeTruthy()
  expect(screen.getByText("Shoot from above")).toBeTruthy()
  expect(screen.queryByText("Review & edit")).toBeNull()
  expect(screen.queryByText(/three quick tips/i)).toBeNull()
  expect(screen.queryByText(/guidelines/i)).toBeNull()
  expect(screen.getByText("1")).toBeTruthy()
  expect(screen.getByText("2")).toBeTruthy()
  expect(screen.queryByText("3")).toBeNull()
})

test("Got it and the circular X both dismiss the tutorial", async () => {
  mockMeals(false)
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })

  await fireEvent.press(screen.getByText("Got it"))
  expect(dismissTutorial).toHaveBeenCalledTimes(1)
  await fireEvent.press(screen.getByLabelText("Close Capture your meal"))
  expect(dismissTutorial).toHaveBeenCalledTimes(2)
})

test("the tutorial stays hidden once it has been seen", async () => {
  mockMeals(true)
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })
  expect(screen.queryByText("Add a ruler")).toBeNull()
})

test("shutter captures photo -> preview shows and Analyze enables", async () => {
  mockMeals(true)
  mockTakePicture.mockResolvedValueOnce("file://meal.jpg")
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })
  expect(screen.getByLabelText("Analyze photo").props.accessibilityState.disabled).toBe(true)
  await fireEvent.press(screen.getByLabelText("Take meal photo"))
  await screen.findByLabelText("Selected meal photo")
  expect(mockTakePicture).toHaveBeenCalledTimes(1)
  expect(screen.getByLabelText("Analyze photo").props.accessibilityState.disabled).toBe(false)
})

test("retake returns to live camera", async () => {
  mockMeals(true)
  mockTakePicture.mockResolvedValueOnce("file://meal.jpg")
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })
  await fireEvent.press(screen.getByLabelText("Take meal photo"))
  await screen.findByLabelText("Selected meal photo")
  await fireEvent.press(screen.getByLabelText("Retake photo"))
  expect(screen.queryByLabelText("Selected meal photo")).toBeNull()
  expect(screen.getByLabelText("Take meal photo")).toBeTruthy()
})

test("capture failure shows error and library path still works", async () => {
  mockMeals(true)
  mockTakePicture.mockRejectedValueOnce(new Error("Could not capture photo. Try again."))
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })
  await fireEvent.press(screen.getByLabelText("Take meal photo"))
  await screen.findByRole("alert")
  const { pickImage } = require("@/features/camera")
  jest.mocked(pickImage).mockResolvedValueOnce({
    uri: "file://meal.jpg",
    mimeType: "image/webp",
  })
  await fireEvent.press(screen.getByLabelText("Choose from library"))
  expect(jest.mocked(pickImage)).toHaveBeenLastCalledWith(false)
  await screen.findByLabelText("Selected meal photo")
})

test("denied permission shows request button and library fallback", async () => {
  mockMeals(true)
  mockCameraGranted = false
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })
  expect(screen.getByLabelText("Allow camera access")).toBeTruthy()
  await fireEvent.press(screen.getByLabelText("Allow camera access"))
  expect(mockRequestPermission).toHaveBeenCalled()
  const { pickImage } = require("@/features/camera")
  jest.mocked(pickImage).mockResolvedValueOnce({
    uri: "file://meal.jpg",
    mimeType: "image/webp",
  })
  await fireEvent.press(screen.getByLabelText("Choose from library"))
  await screen.findByLabelText("Selected meal photo")
})
test("shutter sits right under preview before description", async () => {
  mockMeals(true)
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })
  const shutter = screen.getByLabelText("Take meal photo")
  const desc = screen.getByLabelText("Optional meal description")
  expect(shutter).toBeTruthy()
  expect(desc).toBeTruthy()
  const flat = JSON.stringify(screen.toJSON())
  expect(flat.indexOf("Take meal photo")).toBeLessThan(flat.indexOf("Optional meal description"))
})
