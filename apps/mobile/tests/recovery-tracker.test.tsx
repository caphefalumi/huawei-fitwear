import { fireEvent, render } from "@testing-library/react-native"

import { Palette } from "@/constants/palette"
import type { RecoveryPlan } from "@/features/health/health-store"
import { RecoveryTracker } from "@/features/recovery/recovery-stages"

jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  apiRequest: jest.fn(),
}))
jest.mock("@/features/auth/auth-store", () => ({ useAuth: jest.fn() }))

const recovery: RecoveryPlan = {
  area: "Right knee",
  note: "",
  restDays: 2,
  lightDays: 3,
  startDate: "2026-11-01",
  start: "Nov 1",
  returnDate: "Nov 6",
}

/** The graph is hidden from assistive tech on purpose; the label carries the meaning. */
const hidden = { includeHiddenElements: true }

beforeEach(() => {
  jest.useFakeTimers({ now: new Date(2026, 10, 4, 9) })
})
afterEach(() => {
  jest.useRealTimers()
})

test("shows the stage names with the short date each stage begins", async () => {
  const screen = await render(
    <RecoveryTracker recovery={recovery} label="Recovery" onPress={jest.fn()} />,
  )
  expect(screen.getByText("Recovery")).toBeTruthy()
  expect(screen.getByText("Rest", hidden)).toBeTruthy()
  expect(screen.getByText("1 Nov", hidden)).toBeTruthy()
  expect(screen.getByText("Rehab", hidden)).toBeTruthy()
  expect(screen.getByText("3 Nov", hidden)).toBeTruthy()
  expect(screen.getByText("Return", hidden)).toBeTruthy()
  expect(screen.getByText("6 Nov", hidden)).toBeTruthy()
})

test("fills reached checkpoints red and leaves pending ones white", async () => {
  const screen = await render(
    <RecoveryTracker recovery={recovery} label="Recovery" onPress={jest.fn()} />,
  )
  expect(screen.getByTestId("recovery-stage-rest", hidden)).toHaveStyle({
    backgroundColor: Palette.accent,
  })
  expect(screen.getByTestId("recovery-stage-rehab", hidden)).toHaveStyle({
    backgroundColor: Palette.surface,
  })
  expect(screen.getByTestId("recovery-stage-return", hidden)).toHaveStyle({
    backgroundColor: Palette.surface,
  })
})

test("fills every checkpoint once the return date has passed", async () => {
  jest.setSystemTime(new Date(2026, 10, 9, 9))
  const screen = await render(
    <RecoveryTracker recovery={recovery} label="Recovery" onPress={jest.fn()} />,
  )
  for (const stage of ["rest", "rehab", "return"]) {
    expect(screen.getByTestId(`recovery-stage-${stage}`, hidden)).toHaveStyle({
      backgroundColor: Palette.accent,
    })
  }
})

test("opens recovery details with the supplied accessibility label", async () => {
  const onPress = jest.fn()
  const screen = await render(
    <RecoveryTracker
      recovery={recovery}
      label="Recovery. Right knee recovery."
      onPress={onPress}
    />,
  )
  await fireEvent.press(screen.getByLabelText("Recovery. Right knee recovery."))
  expect(onPress).toHaveBeenCalledTimes(1)
})
