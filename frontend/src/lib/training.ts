import "server-only";
import { apiFetch } from "./api";
import { uiPreview } from "./ui-preview";

// Shapes of /api/v1/me/home and /me/summary. Dates are calendar days.

export type LastWorkout = { id: number; workout_date: string; exercises: number; sets: number };
export type WeekDay = { date: string; trained: boolean };
export type Home = {
  last_workout: LastWorkout | null;
  week: { start: string; end: string; workouts: number; effective_sets: number; days: WeekDay[] };
};

export type RangeKind = "this_week" | "last_week" | "last_4_weeks" | "custom";
export type MuscleGroupTotal = { key: string; name_pl: string; effective_sets: number; tonnage_kg: number };
export type Summary = {
  range: { kind: RangeKind; start: string; end: string };
  workouts: number;
  /** All 17 groups, most effective sets first. */
  groups: MuscleGroupTotal[];
};

async function getJson<T>(path: `/${string}`): Promise<T> {
  const response = await apiFetch(path);
  if (!response.ok) throw new Error(`GET ${path} answered ${response.status}`);
  return response.json() as Promise<T>;
}

/** The Start screen. Reads the session: call it inside <Suspense>. */
export function getHome(): Promise<Home> {
  return uiPreview ? Promise.resolve(PREVIEW_HOME) : getJson<Home>("/me/home");
}

/** Podsumowanie for a range. `from` and `to` only count for a custom range. */
export function getSummary(kind: RangeKind, from?: string, to?: string): Promise<Summary> {
  if (uiPreview) return Promise.resolve(previewSummary(kind));
  const query = new URLSearchParams({ range: kind });
  if (kind === "custom" && from && to) {
    query.set("from", from);
    query.set("to", to);
  }
  return getJson<Summary>(`/me/summary?${query}`);
}

// UI preview runs without Clerk or the backend.

const PREVIEW_HOME: Home = {
  last_workout: { id: 1, workout_date: "2026-11-12", exercises: 5, sets: 16 },
  week: {
    start: "2026-11-09",
    end: "2026-11-15",
    workouts: 2,
    effective_sets: 41.5,
    days: ["09", "10", "11", "12", "13", "14", "15"].map((d) => ({ date: `2026-11-${d}`, trained: d === "10" || d === "12" })),
  },
};

const PREVIEW_GROUPS: [string, string, number, number][] = [
  ["shoulders", "barki", 10, 1890],
  ["chest", "klatka piersiowa", 7, 2925],
  ["upper_back", "górna część pleców", 7, 2600],
  ["triceps", "triceps", 6.5, 1200],
  ["quads", "czworogłowe uda", 6, 4320],
  ["lats", "najszersze grzbietu", 5.5, 1530],
  ["glutes", "pośladki", 5, 3480],
  ["biceps", "biceps", 4, 570],
  ["hamstrings", "dwugłowe uda", 3.5, 1440],
  ["calves", "łydki", 3, 2250],
  ["lower_back", "dolna część pleców", 1.5, 0],
  ["traps", "kaptury", 1.5, 0],
  ["forearms", "przedramiona", 1, 0],
  ["abs", "brzuch", 0, 0],
  ["adductors", "przywodziciele", 0, 0],
  ["abductors", "odwodziciele", 0, 0],
  ["neck", "szyja", 0, 0],
];

function previewSummary(kind: RangeKind): Summary {
  const scale = kind === "last_4_weeks" ? 4 : kind === "last_week" ? 1.2 : 1;
  return {
    range: { kind, start: "2026-11-09", end: "2026-11-15" },
    workouts: Math.round(3 * scale),
    groups: PREVIEW_GROUPS.map(([key, name_pl, sets, kg]) => ({
      key,
      name_pl,
      effective_sets: sets * scale,
      tonnage_kg: kg * scale,
    })),
  };
}
