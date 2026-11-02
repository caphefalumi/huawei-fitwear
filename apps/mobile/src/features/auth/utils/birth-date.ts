export function clampToMonthEnd(year: number, month: number, day: number): number {
  return Math.min(day, new Date(year, month, 0).getDate());
}

export function isFutureBirthDate(
  year: number,
  month: number,
  day: number,
  today = new Date(),
): boolean {
  const currentYear = today.getFullYear();
  if (year > currentYear) return true;
  if (year < currentYear) return false;
  const currentMonth = today.getMonth() + 1;
  if (month > currentMonth) return true;
  if (month < currentMonth) return false;
  return day > today.getDate();
}

export function resolveBirthdaySelection(
  year: number,
  month: number,
  day: number,
  today = new Date(),
) {
  const lastDay = new Date(year, month, 0).getDate();
  const selectedDate = new Date(year, month - 1, Math.min(day, lastDay));
  const latestAllowedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isFuture = selectedDate > latestAllowedDate;

  return { date: isFuture ? latestAllowedDate : selectedDate, isFuture };
}
