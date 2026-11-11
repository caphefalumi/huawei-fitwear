/**
 * Formats a stored `YYYY-MM-DD` birth date as `DD-MM-YYYY`, e.g. `12-04-1994`.
 * Parses the string directly so the day never shifts with the device time zone.
 */
export function formatBirthdate(iso: string | null | undefined) {
  const match = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null
  if (!match) return "Not set"
  const [, year, month, day] = match
  if (Number(month) < 1 || Number(month) > 12 || Number(day) < 1 || Number(day) > 31) {
    return "Not set"
  }
  return `${day}-${month}-${year}`
}
