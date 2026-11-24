import type { MealLog } from "../hooks/meals-hooks"
import {
  dayLabel,
  daysBetween,
  groupByDay,
  macroShares,
  matchesMeal,
  mealTitle,
  shiftDateKey,
} from "../utils/meal-journal"

const item = (name: string, kcal: number) => ({
  id: name,
  name,
  detail: "100g",
  kcal,
  macros: { protein: 10, carbs: 20, fat: 5 },
  glyph: "wheat" as const,
})

const meal = (
  id: string,
  targetDate: string,
  loggedAt: string,
  items = [item("Rice", 200)],
): MealLog => ({
  id,
  name: "Lunch",
  mealType: "lunch",
  targetDate,
  loggedAt,
  date: targetDate,
  time: loggedAt.slice(11, 16),
  imageUrl: null,
  items,
  kcal: items.reduce((sum, entry) => sum + entry.kcal, 0),
  macros: { protein: 10, carbs: 20, fat: 5 },
})

test("groups meals by day, newest day first and meals in eating order", () => {
  const days = groupByDay(
    [
      meal("dinner", "2026-11-24", "2026-11-24T12:00:00.000Z"),
      meal("breakfast", "2026-11-24", "2026-11-24T01:00:00.000Z"),
      meal("older", "2026-11-20", "2026-11-20T05:00:00.000Z"),
      meal("yesterday", "2026-11-23", "2026-11-23T05:00:00.000Z"),
    ],
    "2026-11-24",
  )
  expect(days.map((day) => day.title)).toEqual(["Today", "Yesterday", "Fri, Nov 20"])
  expect(days[0].data.map((entry) => entry.id)).toEqual(["breakfast", "dinner"])
  expect(days[0].kcal).toBe(400)
  expect(days[0].macros).toEqual({ protein: 20, carbs: 40, fat: 10 })
})

test("labels other years with the year", () => {
  expect(dayLabel("2025-12-31", "2026-01-02")).toBe("Wed, Dec 31, 2025")
  expect(shiftDateKey("2026-03-01", -1)).toBe("2026-02-28")
  expect(daysBetween("2026-11-24", "2026-11-20")).toBe(-4)
})

test("names a meal by its largest items", () => {
  expect(mealTitle({ mealType: "dinner", items: [] })).toBe("Dinner")
  expect(mealTitle({ mealType: "lunch", items: [item("Canh", 80), item("Cơm tấm", 600)] })).toBe(
    "Cơm tấm, Canh",
  )
  expect(
    mealTitle({
      mealType: "lunch",
      items: [item("A", 10), item("B", 30), item("C", 20), item("D", 5)],
    }),
  ).toBe("B, C +2 more")
})

test("search matches food names and meal type without accents or case", () => {
  const pho = meal("pho", "2026-11-24", "2026-11-24T12:00:00.000Z", [item("Phở bò tái", 450)])
  expect(matchesMeal(pho, "pho bo")).toBe(true)
  expect(matchesMeal(pho, "PHỞ")).toBe(true)
  expect(matchesMeal(pho, "lunch")).toBe(true)
  expect(matchesMeal(pho, "rice")).toBe(false)
  expect(matchesMeal(pho, "  ")).toBe(true)
})

test("macro shares split energy by 4, 4 and 9 kcal per gram", () => {
  expect(macroShares({ protein: 25, carbs: 25, fat: 0 })).toEqual({
    protein: 0.5,
    carbs: 0.5,
    fat: 0,
  })
  expect(macroShares({ protein: 0, carbs: 0, fat: 0 })).toEqual({ protein: 0, carbs: 0, fat: 0 })
})
