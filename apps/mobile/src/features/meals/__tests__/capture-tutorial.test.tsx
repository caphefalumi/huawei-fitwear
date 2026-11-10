import { fireEvent, render } from "@testing-library/react-native"
import { useCameraPermissions } from "expo-camera"

import { useMeals } from "@/features/meals"
import { MealCaptureScreen } from "@/features/meals/screens/capture-screen"

const mockTakePicture = jest.fn()
const mockRequestPermission = jest.fn()
jest.mock("expo-camera", () => {
  const React = require("react")
  const RN = require("react-native")
  const MockCameraView = React.forwardRef((props: object, ref: object) => {
    React.useImperativeHandle(ref, () => ({ takePictureAsync: mockTakePicture }))
    return <RN.View {...props} />
  })
  MockCameraView.displayName = "MockCameraView"
  return { CameraView: MockCameraView, useCameraPermissions: jest.fn() }
})
jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }))
jest.mock("@/features/camera", () => ({
  pickImage: jest.fn(),
  validatePickedImage: jest.requireActual("@/features/camera/api/image-picker").validatePickedImage,
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
import { createQueryWrapper } from "@/tests/utils/query-wrapper"
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
function mockPermission(granted: boolean) {
  jest
    .mocked(useCameraPermissions)
    .mockReturnValue([{ granted } as never, mockRequestPermission, jest.fn()] as never)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockPermission(true)
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
  mockTakePicture.mockResolvedValueOnce({ uri: "file://meal.jpg", base64: "/9j/abc" })
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })
  expect(screen.getByLabelText("Analyze photo").props.accessibilityState.disabled).toBe(true)
  await fireEvent.press(screen.getByLabelText("Take meal photo"))
  await screen.findByLabelText("Selected meal photo")
  expect(mockTakePicture).toHaveBeenCalledWith({ base64: true, quality: 0.7 })
  expect(screen.getByLabelText("Analyze photo").props.accessibilityState.disabled).toBe(false)
})

test("retake returns to live camera", async () => {
  mockMeals(true)
  mockTakePicture.mockResolvedValueOnce({ uri: "file://meal.jpg", base64: "/9j/abc" })
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
    base64: "/9j/abc",
    mimeType: "image/jpeg",
  })
  await fireEvent.press(screen.getByLabelText("Choose from library"))
  expect(jest.mocked(pickImage)).toHaveBeenLastCalledWith(false)
  await screen.findByLabelText("Selected meal photo")
})

test("denied permission shows request button and library fallback", async () => {
  mockMeals(true)
  mockPermission(false)
  const screen = await render(<MealCaptureScreen />, { wrapper: createQueryWrapper() })
  expect(screen.getByLabelText("Allow camera access")).toBeTruthy()
  await fireEvent.press(screen.getByLabelText("Allow camera access"))
  expect(mockRequestPermission).toHaveBeenCalled()
  const { pickImage } = require("@/features/camera")
  jest.mocked(pickImage).mockResolvedValueOnce({
    uri: "file://meal.jpg",
    base64: "/9j/abc",
    mimeType: "image/jpeg",
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
