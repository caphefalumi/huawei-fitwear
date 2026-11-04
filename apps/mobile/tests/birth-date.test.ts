import { resolveBirthdaySelection } from "@/features/auth/birth-date"

const today = new Date(2026, 4, 15, 12)

test("future selections return to the latest valid date", () => {
  const result = resolveBirthdaySelection(2026, 5, 16, today)

  expect(result.isFuture).toBe(true)
  expect(result.date.getTime()).toBe(new Date(2026, 4, 15).getTime())
})

test("today remains selectable and is not marked future", () => {
  const result = resolveBirthdaySelection(2026, 5, 15, today)

  expect(result.isFuture).toBe(false)
  expect(result.date.getTime()).toBe(new Date(2026, 4, 15).getTime())
})

test("impossible month days clamp to the month's last valid day", () => {
  const result = resolveBirthdaySelection(2024, 2, 31, today)

  expect(result.isFuture).toBe(false)
  expect(result.date.getTime()).toBe(new Date(2024, 1, 29).getTime())
})
