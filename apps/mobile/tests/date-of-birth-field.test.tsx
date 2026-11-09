import { fireEvent, render } from "@testing-library/react-native"

import { DateOfBirthField } from "@/features/auth/date-of-birth-field"

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

test("does not auto-advance when a field value shrinks during erase", async () => {
  const screen = await render(<DateOfBirthField value="1998-03-12" onChange={onChange} />)

  await fireEvent.changeText(screen.getByLabelText("Day"), "1")
  await fireEvent.changeText(screen.getByLabelText("Day"), "31")
  expect(onChange).toHaveBeenLastCalledWith("1998-03-31")
})

test("accepts pasted ISO with an invalid month from the year field", async () => {
  const screen = await render(<DateOfBirthField value="1998-03-12" onChange={onChange} />)

  await fireEvent.changeText(screen.getByLabelText("Year"), "1998-13-31")

  expect(onChange).toHaveBeenLastCalledWith("1998-13-31")
  expect(screen.getByLabelText("Day").props.value).toBe("31")
  expect(screen.getByLabelText("Month").props.value).toBe("13")
  expect(screen.getByLabelText("Year").props.value).toBe("1998")
})

test("keeps in-progress edits when the parent value still matches the previous ISO", async () => {
  const screen = await render(<DateOfBirthField value="1998-03-12" onChange={onChange} />)

  await fireEvent.changeText(screen.getByLabelText("Day"), "1")
  screen.rerender(<DateOfBirthField value="1998-03-12" onChange={onChange} />)
  expect(screen.getByLabelText("Day").props.value).toBe("1")
})
