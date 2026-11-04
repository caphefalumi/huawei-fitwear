import { fireEvent, render } from "@testing-library/react-native"

import { DateOfBirthField } from "@/features/auth/components/date-of-birth-field"

const onChange = jest.fn()

beforeEach(() => onChange.mockClear())

test("assembles a typed locale-ordered date as an ISO date", async () => {
  const screen = await render(<DateOfBirthField value="" onChange={onChange} />)

  await fireEvent.changeText(screen.getByLabelText("Day"), "12")
  await fireEvent.changeText(screen.getByLabelText("Month"), "03")
  await fireEvent.changeText(screen.getByLabelText("Year"), "1998")
  expect(onChange).toHaveBeenLastCalledWith("1998-03-12")

  await fireEvent.changeText(screen.getByLabelText("Day"), "")
  expect(onChange).toHaveBeenLastCalledWith("")
})
test("accepts pasted ISO dates from any date field", async () => {
  const screen = await render(<DateOfBirthField value="" onChange={onChange} />)

  await fireEvent.changeText(screen.getByLabelText("Month"), "1998-03-12")

  expect(onChange).toHaveBeenCalledWith("1998-03-12")
})
