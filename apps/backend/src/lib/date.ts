export const DATE_KEY_PATTERN = "^\\d{4}-\\d{2}-\\d{2}$"

const DATE_KEY_REGEX = new RegExp(DATE_KEY_PATTERN)

export function toDateKey(value: Date | string | number = new Date()): string {
  const date = value instanceof Date ? value : new Date(value)
  return date.toISOString().slice(0, 10)
}

export function isDateKey(value: string): boolean {
  return (
    DATE_KEY_REGEX.test(value) &&
    !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime()) &&
    toDateKey(`${value}T00:00:00.000Z`) === value
  )
}

export function shiftDateKey(dateKey: string, days: number): string {
  const base = new Date(`${dateKey}T00:00:00.000Z`)
  base.setUTCDate(base.getUTCDate() + days)
  return toDateKey(base)
}
