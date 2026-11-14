// Profile and measurement rules from tickets #17 and #18. Pure functions, so the backend
// can mirror them and they are easy to test.

export const LIMITS = {
  displayName: { max: 40 },
  heightCm: { min: 100, max: 250 },
  massKg: { min: 30, max: 300 },
  circumferenceCm: { min: 40, max: 200 },
  age: { min: 13, max: 100 },
} as const;

export type Sex = "female" | "male" | "undisclosed";

const NBSP = " ";

/** Parses "82,5", "82.5" or " 82 ". Empty input is `null`; anything else that is not a number is `NaN`. */
export function parseDecimal(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed === "") return null;
  if (!/^\d+(?:[.,]\d*)?$/.test(trimmed)) return Number.NaN;
  return Number(trimmed.replace(",", "."));
}

type Range = { min: number; max: number };

function checkNumber(input: string, range: Range, unit: string, what: string, example: string) {
  const value = parseDecimal(input);
  if (value === null) return null;
  if (Number.isNaN(value)) return `Wpisz liczbę, np. ${example}`;
  if (value < range.min || value > range.max) {
    return `Wpisz ${what} od ${range.min} do ${range.max}${NBSP}${unit}`;
  }
  return null;
}

export const validateHeight = (input: string) =>
  checkNumber(input, LIMITS.heightCm, "cm", "wzrost", "178");

export const validateMass = (input: string) =>
  checkNumber(input, LIMITS.massKg, "kg", "masę", "72,5");

export const validateCircumference = (input: string) =>
  checkNumber(input, LIMITS.circumferenceCm, "cm", "obwód", "96");

export function validateDisplayName(input: string) {
  if (input.trim().length > LIMITS.displayName.max) {
    return `Skróć do ${LIMITS.displayName.max} znaków`;
  }
  return null;
}

/** How to address someone in a sentence: their first word, or nothing if it would swamp the sentence. */
export function nameToAddress(displayName: string): string {
  const first = displayName.trim().split(/\s+/)[0];
  return first.length <= 16 ? first : "";
}

// Dates are calendar days ("2026-11-07"), compared as local dates, never as instants.

/** Today as YYYY-MM-DD in the user's time zone. */
export function todayIso(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseIsoDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return { y, m, d };
}

/** Full years between a birth date and today. Someone born on 29 February turns a year older on 1 March. */
export function ageOn(birthIso: string, todayIsoValue: string): number | null {
  const birth = parseIsoDate(birthIso);
  const today = parseIsoDate(todayIsoValue);
  if (!birth || !today) return null;
  let age = today.y - birth.y;
  if (today.m < birth.m || (today.m === birth.m && today.d < birth.d)) age -= 1;
  return age;
}

function shiftYears(iso: string, years: number) {
  const date = parseIsoDate(iso)!;
  return todayIso(new Date(date.y + years, date.m - 1, date.d));
}

/** The `min` and `max` attributes for the birth date picker. */
export function birthDateBounds(todayIsoValue: string) {
  const latest = shiftYears(todayIsoValue, -LIMITS.age.min);
  const before = parseIsoDate(shiftYears(todayIsoValue, -(LIMITS.age.max + 1)))!;
  const earliest = todayIso(new Date(before.y, before.m - 1, before.d + 1));
  return { min: earliest, max: latest };
}

export function validateBirthDate(input: string, todayIsoValue: string) {
  if (input === "") return null;
  const age = ageOn(input, todayIsoValue);
  if (age === null) return "Wpisz datę w formacie dd.mm.rrrr";
  if (age < LIMITS.age.min || age > LIMITS.age.max) {
    return `Wpisz datę, która daje wiek od ${LIMITS.age.min} do ${LIMITS.age.max} lat`;
  }
  return null;
}

/** "13 lat", "22 lata", "25 lat", "100 lat". */
export function formatAge(age: number): string {
  const lastDigit = age % 10;
  const lastTwo = age % 100;
  if (age === 1) return `1${NBSP}rok`;
  const word = lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? "lata" : "lat";
  return `${age}${NBSP}${word}`;
}
