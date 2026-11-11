import { formatBirthdate } from "../utils/format-birthdate"

test("formats a stored ISO date without shifting the day", () => {
  expect(formatBirthdate("1994-04-12")).toBe("12-04-1994")
  expect(formatBirthdate("2000-02-29")).toBe("29-02-2000")
  expect(formatBirthdate("1999-12-01")).toBe("01-12-1999")
})

test("falls back to Not set when missing or malformed", () => {
  expect(formatBirthdate(null)).toBe("Not set")
  expect(formatBirthdate(undefined)).toBe("Not set")
  expect(formatBirthdate("")).toBe("Not set")
  expect(formatBirthdate("12/04/1994")).toBe("Not set")
  expect(formatBirthdate("1994-13-01")).toBe("Not set")
})
