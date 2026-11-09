import { validateBirthDate, validateEmail, validatePassword } from "@/lib/form-validation"

test("validateEmail waits for actionable feedback", () => {
  expect(validateEmail("")).toBe("Enter your email address.")
  expect(validateEmail("partial@")).toBe("Enter a valid email address.")
  expect(validateEmail("member@example.com")).toBeNull()
})

test("validatePassword avoids technical limits in user copy", () => {
  expect(validatePassword("short")).toBe("Use at least 8 characters.")
  expect(validatePassword("a".repeat(80))).toBe("Password is too long. Use 72 characters or fewer.")
  expect(validatePassword("good-password")).toBeNull()
})

test("validateBirthDate distinguishes invalid and future dates", () => {
  expect(validateBirthDate("")).toBe("Enter your date of birth.")
  expect(validateBirthDate("2024-02-31")).toBe("Enter a valid date of birth.")
  const tomorrow = new Date()
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  const iso = tomorrow.toISOString().slice(0, 10)
  expect(validateBirthDate(iso)).toBe("Date of birth can't be in the future.")
  expect(validateBirthDate("1998-03-12")).toBeNull()
})
