import type { Macros, MealLog, MealType } from "../hooks/meals-hooks"

// Kept local so this module stays free of the provider's runtime dependencies.
const mealTypeLabel = (type: MealType) => type.charAt(0).toUpperCase() + type.slice(1)

export type JournalDay = {
  dateKey: string
  title: string
  kcal: number
  macros: Macros
  data: MealLog[]
}

const round1 = (value: number) => Math.round(value * 10) / 10

const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

export function shiftDateKey(dateKey: string, days: number) {
  const date = parseDateKey(dateKey)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

/** Whole calendar days from `fromKey` to `toKey` (negative when `toKey` is earlier). */
export function daysBetween(fromKey: string, toKey: string) {
  const utc = (key: string) => {
    const [year, month, day] = key.split("-").map(Number)
    return Date.UTC(year, month - 1, day)
  }
  return Math.round((utc(toKey) - utc(fromKey)) / 86_400_000)
}

/** "Today", "Yesterday", "Mon, Nov 23", or with the year when it is not the current one. */
export function dayLabel(dateKey: string, todayKey: string) {
  if (dateKey === todayKey) return "Today"
  if (dateKey === shiftDateKey(todayKey, -1)) return "Yesterday"
  const date = parseDateKey(dateKey)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(dateKey.slice(0, 4) === todayKey.slice(0, 4) ? {} : { year: "numeric" }),
  })
}

/** Case- and accent-insensitive form used for search ("Phở" matches "pho"). */
export function normalizeSearch(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").trim()
}

/** Names the meal by its largest items, e.g. "Cơm tấm, Canh chua +2 more". */
export function mealTitle(meal: Pick<MealLog, "items" | "mealType">) {
  const names = [...meal.items].sort((a, b) => b.kcal - a.kcal).map((item) => item.name)
  if (!names.length) return mealTypeLabel(meal.mealType)
  const shown = names.slice(0, 2).join(", ")
  return names.length > 2 ? `${shown} +${names.length - 2} more` : shown
}

export function matchesMeal(meal: MealLog, query: string) {
  const needle = normalizeSearch(query)
  if (!needle) return true
  return [mealTypeLabel(meal.mealType), ...meal.items.map((item) => item.name)].some((name) =>
    normalizeSearch(name).includes(needle),
  )
}

/** Groups meals by their nutrition day, newest day first and meals in eating order. */
export function groupByDay(meals: MealLog[], todayKey: string): JournalDay[] {
  const days = new Map<string, MealLog[]>()
  for (const meal of meals) {
    const bucket = days.get(meal.targetDate)
    if (bucket) bucket.push(meal)
    else days.set(meal.targetDate, [meal])
  }
  return [...days.entries()]
    .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
    .map(([dateKey, data]) => ({
      dateKey,
      title: dayLabel(dateKey, todayKey),
      kcal: Math.round(data.reduce((sum, meal) => sum + meal.kcal, 0)),
      macros: {
        protein: round1(data.reduce((sum, meal) => sum + meal.macros.protein, 0)),
        carbs: round1(data.reduce((sum, meal) => sum + meal.macros.carbs, 0)),
        fat: round1(data.reduce((sum, meal) => sum + meal.macros.fat, 0)),
      },
      data: [...data].sort((a, b) => Date.parse(a.loggedAt) - Date.parse(b.loggedAt)),
    }))
}

/** Share of energy from each macro (4/4/9 kcal per gram), for the day bar. */
export function macroShares({ protein, carbs, fat }: Macros) {
  const energy = protein * 4 + carbs * 4 + fat * 9
  if (energy <= 0) return { protein: 0, carbs: 0, fat: 0 }
  return { protein: (protein * 4) / energy, carbs: (carbs * 4) / energy, fat: (fat * 9) / energy }
}

/** Monday-to-Sunday date keys of the week containing `dateKey`. */
export function weekOf(dateKey: string) {
  const offset = (parseDateKey(dateKey).getDay() + 6) % 7
  return Array.from({ length: 7 }, (_, index) => shiftDateKey(dateKey, index - offset))
}

/** Energy per logged day, for day pickers and calendars. */
export function kcalByDay(meals: MealLog[]) {
  const totals = new Map<string, number>()
  for (const meal of meals)
    totals.set(meal.targetDate, (totals.get(meal.targetDate) ?? 0) + meal.kcal)
  return totals
}

/** Fits a day's energy into a narrow cell: 980, 1.2k, 12k. */
export function compactKcal(kcal: number) {
  if (kcal < 1000) return String(Math.round(kcal))
  const thousands = kcal / 1000
  return `${thousands < 10 ? Math.round(thousands * 10) / 10 : Math.round(thousands)}k`
}
