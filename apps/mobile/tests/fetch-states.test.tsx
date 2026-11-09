import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { AccessibilityInfo } from "react-native"

import { FetchErrorState } from "@/components/fetch-states"

jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => {})

beforeEach(() => {
  jest.clearAllMocks()
})

test("failed retry keeps the error visible and does not announce success", async () => {
  const onRetry = jest.fn().mockRejectedValue(new Error("still failing"))
  const screen = await render(
    <FetchErrorState message="Could not load this meal" onRetry={onRetry} retrying={false} />,
  )
  await fireEvent.press(screen.getByLabelText("Try again"))
  await waitFor(() => expect(onRetry).toHaveBeenCalled())
  expect(screen.getByText("Could not load this meal")).toBeTruthy()
  expect(screen.getByLabelText("Try again")).toBeTruthy()
  expect(screen.queryByText("Updated successfully.")).toBeNull()
  expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled()
})

test("failed refetch retry rejects and avoids false recovery success", async () => {
  const onRetry = jest.fn().mockImplementation(async () => {
    const result = { isError: true as const, error: new Error("still failing") }
    if (result.isError) throw result.error
  })
  const screen = await render(
    <FetchErrorState
      message="Could not load this meal"
      onRetry={onRetry}
      retrySuccessMessage="Meal loaded."
    />,
  )
  await fireEvent.press(screen.getByLabelText("Try again"))
  await waitFor(() => expect(onRetry).toHaveBeenCalled())
  expect(screen.getByText("Could not load this meal")).toBeTruthy()
  expect(screen.queryByText("Meal loaded.")).toBeNull()
  expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled()
})

test("successful retry shows recovery confirmation", async () => {
  const onRetry = jest.fn().mockResolvedValue(undefined)
  const screen = await render(
    <FetchErrorState
      message="Could not load this meal"
      onRetry={onRetry}
      retrySuccessMessage="Meal loaded."
    />,
  )
  await fireEvent.press(screen.getByLabelText("Try again"))
  expect(await screen.findByText("Meal loaded.")).toBeTruthy()
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith("Meal loaded.")
})
