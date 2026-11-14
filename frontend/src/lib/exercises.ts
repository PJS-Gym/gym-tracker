import "server-only";
import { apiFetch } from "./api";
import { uiPreview } from "./ui-preview";

// Shapes of /api/v1/me/exercises. Muscle groups and equipment are keys; the Polish names come with them.

export type Option = { key: string; name_pl: string };

export type Exercise = {
  id: number;
  /** Polish name when there is one, otherwise the English one. */
  name: string;
  name_en: string;
  equipment: string | null;
  equipment_pl: string | null;
  own: boolean;
  primary: string[];
  secondary: string[];
};

export type Catalogue = { exercises: Exercise[]; muscle_groups: Option[]; equipment: Option[] };

export type ExerciseDetail = Exercise & { category_pl: string | null; deleted: boolean };

export type HistorySet = { reps: number; weight_kg: number; rpe: number | null; e1rm: number | null };
export type HistoryWorkout = { id: number; workout_date: string; sets: HistorySet[]; best_e1rm: number | null };
export type Record = { value: number; workout_date: string };
export type History = {
  workouts: number;
  /** Latest first, at most 5. */
  recent: HistoryWorkout[];
  best_e1rm: Record | null;
  heaviest: Record | null;
  /** The best e1RM of each workout, oldest first. */
  points: { workout_date: string; e1rm: number }[];
};

export type LastSet = { exercise_id: number; workout_date: string; reps: number; weight_kg: number };

/** Everything the list and the picker need. Reads the session: call it inside <Suspense>. */
export async function getCatalogue(): Promise<Catalogue> {
  if (uiPreview) return PREVIEW_CATALOGUE;
  const response = await apiFetch("/me/exercises");
  if (!response.ok) throw new Error(`GET /me/exercises answered ${response.status}`);
  return response.json() as Promise<Catalogue>;
}

/** A shared exercise or one of the member's own; null when missing or someone else's. */
export async function getExercise(id: number): Promise<ExerciseDetail | null> {
  if (uiPreview) {
    const found = PREVIEW_CATALOGUE.exercises.find((e) => e.id === id);
    return found ? { ...found, category_pl: found.own ? null : "siłowe", deleted: false } : null;
  }
  const response = await apiFetch(`/me/exercises/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GET /me/exercises/${id} answered ${response.status}`);
  return response.json() as Promise<ExerciseDetail>;
}

export async function getHistory(id: number): Promise<History> {
  if (uiPreview) return PREVIEW_HISTORY;
  const response = await apiFetch(`/me/exercises/${id}/history`);
  if (!response.ok) throw new Error(`GET /me/exercises/${id}/history answered ${response.status}`);
  return response.json() as Promise<History>;
}

// UI preview runs without Clerk or the backend.

const groups: [string, string][] = [
  ["abs", "brzuch"],
  ["shoulders", "barki"],
  ["biceps", "biceps"],
  ["calves", "łydki"],
  ["chest", "klatka piersiowa"],
  ["glutes", "pośladki"],
  ["hamstrings", "dwugłowe uda"],
  ["lats", "najszersze grzbietu"],
  ["quads", "czworogłowe uda"],
  ["triceps", "triceps"],
  ["upper_back", "górna część pleców"],
];

const PREVIEW_CATALOGUE: Catalogue = {
  muscle_groups: groups.map(([key, name_pl]) => ({ key, name_pl })),
  equipment: [
    { key: "barbell", name_pl: "sztanga" },
    { key: "dumbbell", name_pl: "hantle" },
    { key: "body only", name_pl: "masa ciała" },
    { key: "cable", name_pl: "wyciąg" },
  ],
  exercises: [
    [1, "Wyciskanie sztangi na ławce płaskiej", "Barbell Bench Press - Medium Grip", "barbell", "sztanga", ["chest"], ["shoulders", "triceps"]],
    [2, "Przysiad ze sztangą", "Barbell Squat", "barbell", "sztanga", ["quads"], ["glutes", "hamstrings"]],
    [3, "Wiosłowanie hantlem", "One-Arm Dumbbell Row", "dumbbell", "hantle", ["upper_back"], ["biceps", "lats"]],
    [4, "Podciąganie nachwytem", "Pullups", "body only", "masa ciała", ["lats"], ["biceps"]],
    [5, "Uginanie ramion z hantlami", "Dumbbell Bicep Curl", "dumbbell", "hantle", ["biceps"], []],
  ].map(([id, name, name_en, equipment, equipment_pl, primary, secondary]) => ({
    id: id as number,
    name: name as string,
    name_en: name_en as string,
    equipment: equipment as string,
    equipment_pl: equipment_pl as string,
    own: false,
    primary: primary as string[],
    secondary: secondary as string[],
  })),
};

const PREVIEW_HISTORY: History = {
  workouts: 3,
  recent: [
    { id: 1, workout_date: "2026-11-12", best_e1rm: 76, sets: [{ reps: 8, weight_kg: 60, rpe: 8, e1rm: 76 }] },
    { id: 2, workout_date: "2026-11-05", best_e1rm: 73.83, sets: [{ reps: 8, weight_kg: 57.5, rpe: 8, e1rm: 72.83 }] },
  ],
  best_e1rm: { value: 76, workout_date: "2026-11-12" },
  heaviest: { value: 60, workout_date: "2026-11-12" },
  points: [
    { workout_date: "2026-10-29", e1rm: 70.67 },
    { workout_date: "2026-11-05", e1rm: 72.83 },
    { workout_date: "2026-11-12", e1rm: 76 },
  ],
};
