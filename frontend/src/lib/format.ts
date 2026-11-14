// Polish numbers, plurals and dates for the training screens. Dates are calendar days ("2026-11-13").

const NBSP = " ";

/** "Klatka piersiowa" from "klatka piersiowa": muscle groups and equipment are stored in lower case. */
export const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("pl-PL") + text.slice(1);

/** "1 trening", "3 treningi", "5 treningów", "12,5 serii": Polish picks the form by the last digits. */
export function plural(count: number, one: string, few: string, many: string): string {
  if (!Number.isInteger(count)) return many;
  if (count === 1) return one;
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  return lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? few : many;
}

const numberFormat = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 1 });
const wholeFormat = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0, useGrouping: true });

/** Up to one decimal, Polish comma: 84, 12,5. */
export const formatNumber = (value: number) => numberFormat.format(value);

const weightFormat = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 });

/** A logged weight, which moves in steps of 0,25 kg: 80, 82,5, 82,25. */
export const formatWeight = (kg: number) => weightFormat.format(kg);

/** "80 kg × 8": a set the way the logger and history show it. */
export const formatSet = (kg: number, reps: number) => `${formatWeight(kg)}${NBSP}kg × ${reps}`;

/** Whole kilograms with a thin grouping space: 24 725 kg. */
export const formatKg = (value: number) => `${wholeFormat.format(Math.round(value))}${NBSP}kg`;

export const countLabel = (count: number, one: string, few: string, many: string) =>
  `${formatNumber(count)}${NBSP}${plural(count, one, few, many)}`;

export const workoutsLabel = (count: number) => countLabel(count, "trening", "treningi", "treningów");
export const setsLabel = (count: number) => countLabel(count, "seria", "serie", "serii");
export const exercisesLabel = (count: number) => countLabel(count, "ćwiczenie", "ćwiczenia", "ćwiczeń");

const asDate = (iso: string) => new Date(`${iso}T12:00:00Z`);
const dayMonth = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", timeZone: "UTC" });
const weekdayDayMonth = new Intl.DateTimeFormat("pl-PL", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const dayOnly = new Intl.DateTimeFormat("pl-PL", { day: "numeric", timeZone: "UTC" });

const dayShortMonth = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", timeZone: "UTC" });
const monthYear = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric", timeZone: "UTC" });

/** "13 lis", for chart axes and compact lists. */
export const formatDayMonth = (iso: string) => dayShortMonth.format(asDate(iso));

/** "13 listopada" */
export const formatDay = (iso: string) => dayMonth.format(asDate(iso));

/** "listopad 2026", a heading over a month of workouts. */
export const formatMonth = (iso: string) => monthYear.format(asDate(iso));

/** "piątek, 13 listopada" */
export const formatLongDay = (iso: string) => weekdayDayMonth.format(asDate(iso));

// The usual two-letter Polish abbreviations; Intl gives "pon." and "niedz.".
const WEEKDAYS_SHORT = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];

/** "Pn", "Wt", … for a week strip. */
export const formatWeekdayShort = (iso: string) => WEEKDAYS_SHORT[asDate(iso).getUTCDay()];

/** "Dziś", "Wczoraj", otherwise "wtorek, 10 listopada". */
export function formatRelativeDay(iso: string, today: string): string {
  const days = Math.round((asDate(today).getTime() - asDate(iso).getTime()) / 86_400_000);
  if (days === 0) return "Dziś";
  if (days === 1) return "Wczoraj";
  return formatLongDay(iso);
}

/** "10–16 listopada", or "27 października – 2 listopada" across months. */
export function formatRange(start: string, end: string): string {
  if (start === end) return dayMonth.format(asDate(start));
  if (start.slice(0, 7) === end.slice(0, 7)) return `${dayOnly.format(asDate(start))}–${dayMonth.format(asDate(end))}`;
  return `${dayMonth.format(asDate(start))} – ${dayMonth.format(asDate(end))}`;
}

/** Today in Europe/Warsaw as YYYY-MM-DD, the zone the training weeks use. */
export function todayInWarsaw(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(now);
}
