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
