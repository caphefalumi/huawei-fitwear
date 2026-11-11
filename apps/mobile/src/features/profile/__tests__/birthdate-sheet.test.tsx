import { fireEvent, render } from "@testing-library/react-native"

import { useAuth } from "@/features/auth"
import { BirthdatePicker } from "@/features/profile/components/birthdate-picker"
import { BirthdateSheet } from "@/features/profile/components/sheets"

jest.mock("@/features/auth/hooks/auth-hooks", () => ({ useAuth: jest.fn() }))
jest.mock("react-native-keyboard-controller", () => {
  const { View } = require("react-native")
  return { KeyboardAvoidingView: View }
})
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

const mockUseAuth = jest.mocked(useAuth)
const updateUser = jest.fn()
const onClose = jest.fn()

function signedInWith(birthDate: string | null) {
  mockUseAuth.mockReturnValue({
    user: { name: "Member", email: "member@example.com", birthDate },
    updateUser,
  } as never)
}

async function adjust(
  screen: Awaited<ReturnType<typeof render>>,
  label: "Day" | "Month" | "Year",
  actionName: "increment" | "decrement",
  times = 1,
) {
  for (let step = 0; step < times; step++) {
    await fireEvent(screen.getByLabelText(label), "accessibilityAction", {
      nativeEvent: { actionName },
    })
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  updateUser.mockResolvedValue(undefined)
  signedInWith("1994-04-12")
})

afterEach(() => jest.useRealTimers())

test("shows day, month and year wheels starting from the saved birthdate", async () => {
  const screen = await render(<BirthdateSheet visible onClose={onClose} />)
  expect(screen.getByText("DD")).toBeTruthy()
  expect(screen.getByText("MM")).toBeTruthy()
  expect(screen.getByText("YYYY")).toBeTruthy()
  expect(screen.getByLabelText("Day")).toHaveProp(
    "accessibilityValue",
    expect.objectContaining({ text: "12" }),
  )
  expect(screen.getByLabelText("Month")).toHaveProp(
    "accessibilityValue",
    expect.objectContaining({ text: "04" }),
  )
  expect(screen.getByLabelText("Year")).toHaveProp(
    "accessibilityValue",
    expect.objectContaining({ text: "1994" }),
  )
})

test("saves the date picked on the wheels and closes", async () => {
  const screen = await render(<BirthdateSheet visible onClose={onClose} />)
  await adjust(screen, "Year", "decrement", 4)
  await adjust(screen, "Day", "increment")
  await fireEvent.press(screen.getByText("OK"))
  expect(updateUser).toHaveBeenCalledWith({ birthDate: "1990-04-13" })
  expect(onClose).toHaveBeenCalled()
})

test("starts from a neutral date when none is saved", async () => {
  signedInWith(null)
  const screen = await render(<BirthdateSheet visible onClose={onClose} />)
  await fireEvent.press(screen.getByText("OK"))
  expect(updateUser).toHaveBeenCalledWith({ birthDate: "2000-01-01" })
})

test("blocks saving a future date and says why", async () => {
  jest.useFakeTimers({
    now: new Date("2026-06-15T12:00:00Z"),
    doNotFake: [
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "setImmediate",
      "clearImmediate",
      "nextTick",
      "queueMicrotask",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      "performance",
    ],
  })
  signedInWith("2026-12-31")
  const screen = await render(<BirthdateSheet visible onClose={onClose} />)
  expect(screen.getByText("Date of birth can't be in the future.")).toBeTruthy()
  await fireEvent.press(screen.getByText("OK"))
  expect(updateUser).not.toHaveBeenCalled()
})

test("keeps the sheet open and shows an alert when saving fails", async () => {
  updateUser.mockRejectedValue(new Error("offline"))
  const screen = await render(<BirthdateSheet visible onClose={onClose} />)
  await adjust(screen, "Year", "decrement")
  await fireEvent.press(screen.getByText("OK"))
  expect(await screen.findByRole("alert")).toBeTruthy()
  expect(onClose).not.toHaveBeenCalled()
})

test("pulls the day back when the month is shorter", async () => {
  const onChange = jest.fn()
  const screen = await render(
    <BirthdatePicker value={{ day: 31, month: 1, year: 2001 }} onChange={onChange} />,
  )
  await adjust(screen, "Month", "increment")
  expect(onChange).toHaveBeenLastCalledWith({ day: 28, month: 2, year: 2001 })
})

test("keeps 29 February in leap years only", async () => {
  const onChange = jest.fn()
  const screen = await render(
    <BirthdatePicker value={{ day: 29, month: 2, year: 2003 }} onChange={onChange} />,
  )
  expect(screen.getByLabelText("Day")).toHaveProp(
    "accessibilityValue",
    expect.objectContaining({ text: "28" }),
  )
  await adjust(screen, "Year", "increment")
  expect(onChange).toHaveBeenLastCalledWith({ day: 28, month: 2, year: 2004 })
})
