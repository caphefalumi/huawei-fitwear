import { fireEvent, render } from "@testing-library/react-native"

import { useMeals } from "@/features/meals"
import { MealCaptureScreen } from "@/features/meals/capture-screen"

jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }))
jest.mock("@/features/camera", () => ({ pickImage: jest.fn() }))
jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  apiRequest: jest.fn(),
}))
jest.mock("@/features/meals/meals-hooks", () => ({ useMeals: jest.fn() }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))
jest.mock("react-native-reanimated", () => ({ useReducedMotion: () => true }))
import { createQueryWrapper } from "./query-wrapper"
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
