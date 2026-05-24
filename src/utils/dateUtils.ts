/**
 * dateUtils.ts — Native JS date helpers replacing date-fns.
 *
 * date-fns v4 has a known incompatibility with Plasmo/Parcel's bundler where
 * the internal token formatters (e.g. the "y" year token) are not included in
 * the bundle, causing: TypeError: Cannot read properties of undefined (reading 'y').
 *
 * These are lightweight, zero-dependency replacements covering every date-fns
 * function used across the project.
 */

const PAD2 = (n: number) => String(n).padStart(2, "0");

// Short weekday names keyed by getDay() (0=Sun … 6=Sat)
const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
// Full weekday names
const WEEKDAYS_LONG  = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
// Short month names
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
// Full month names
const MONTHS_LONG  = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;

/**
 * Formats a Date using a small subset of date-fns tokens:
 *   yyyy, MM, dd, M, d, EEE, EEEE, MMM, MMMM, HH, mm, ss
 *
 * Examples:
 *   format(date, "yyyy-MM-dd")   → "2025-05-24"
 *   format(date, "EEE")          → "Fri"
 *   format(date, "MMMM yyyy")    → "May 2025"
 *   format(date, "MMM d")        → "May 24"
 *   format(date, "d")            → "24"
 *   format(date, "HH:mm")        → "14:30"
 */
export function format(date: Date, pattern: string): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    // Graceful fallback: return ISO string fragment rather than crash
    return "";
  }

  const yyyy = String(date.getFullYear());
  const MM   = PAD2(date.getMonth() + 1);
  const dd   = PAD2(date.getDate());
  const M    = String(date.getMonth() + 1);
  const d    = String(date.getDate());
  const HH   = PAD2(date.getHours());
  const mm   = PAD2(date.getMinutes());
  const ss   = PAD2(date.getSeconds());
  const EEE  = WEEKDAYS_SHORT[date.getDay()];
  const EEEE = WEEKDAYS_LONG[date.getDay()];
  const MMM  = MONTHS_SHORT[date.getMonth()];
  const MMMM = MONTHS_LONG[date.getMonth()];

  // 12-hour calculations
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const hh = PAD2(hours12);
  const h = String(hours12);
  const ampm = hours24 >= 12 ? "PM" : "AM";

  // Replace longest tokens first to avoid partial substitution
  return pattern
    .replace("MMMM", MMMM)
    .replace("MMM",  MMM)
    .replace("EEEE", EEEE)
    .replace("EEE",  EEE)
    .replace("yyyy", yyyy)
    .replace("MM",   MM)
    .replace("dd",   dd)
    .replace("HH",   HH)
    .replace("hh",   hh)
    .replace("mm",   mm)
    .replace("ss",   ss)
    .replace(/\bh\b/g, h)
    .replace(/\bM\b/g, M)
    .replace(/\bd\b/g, d)
    .replace(/\ba\b/g, ampm);
}

/**
 * Subtracts `amount` days from `date` and returns a new Date.
 */
export function subDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - amount);
  return result;
}

/**
 * Subtracts `amount` months from `date` and returns a new Date.
 * Clamps the day to the last day of the resulting month.
 */
export function subMonths(date: Date, amount: number): Date {
  const result = new Date(date);
  const day    = result.getDate();
  result.setMonth(result.getMonth() - amount);
  // If the month overflowed (e.g. Jan 31 - 1 month → Mar 3), clamp to last day
  if (result.getDate() !== day) {
    result.setDate(0);
  }
  return result;
}

/**
 * Returns a new Date set to midnight (00:00:00.000) of the given date,
 * i.e. the start of the day in local time.
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Returns a new Date set to the first day (day 1) of the same month.
 */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Returns a new Date set to the last day of the same month.
 */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Returns an array of Date objects, one per day between start and end (inclusive).
 */
export function eachDayOfInterval({ start, end }: { start: Date; end: Date }): Date[] {
  const days: Date[] = [];
  const current = startOfDay(new Date(start));
  const last    = startOfDay(new Date(end));
  while (current <= last) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

/**
 * Parses an ISO 8601 date string (e.g. "2025-05-24") into a local Date.
 * Avoids the UTC-midnight problem of `new Date("2025-05-24")`.
 */
export function parseISO(dateString: string): Date {
  // "yyyy-MM-dd" → local midnight, not UTC midnight
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/**
 * Returns true if `date` is in the future relative to now.
 */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Returns true if two dates fall on the same calendar day.
 */
export function isSameDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth()    === dateB.getMonth()    &&
    dateA.getDate()     === dateB.getDate()
  );
}

/**
 * Returns true if `date` falls on a Friday.
 */
export function isFriday(date: Date): boolean {
  return date.getDay() === 5;
}

/**
 * Returns true if `date` falls on a Monday.
 */
export function isMonday(date: Date): boolean {
  return date.getDay() === 1;
}

/**
 * Returns true if `date` falls on a Thursday.
 */
export function isThursday(date: Date): boolean {
  return date.getDay() === 4;
}

/**
 * Returns the absolute number of whole days between dateA and dateB.
 */
export function differenceInDays(dateA: Date, dateB: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((startOfDay(dateA).getTime() - startOfDay(dateB).getTime()) / msPerDay);
}

/**
 * Returns the number of whole seconds between dateA and dateB.
 * Positive when dateA is after dateB.
 */
export function differenceInSeconds(dateA: Date, dateB: Date): number {
  return Math.floor((dateA.getTime() - dateB.getTime()) / 1000);
}
