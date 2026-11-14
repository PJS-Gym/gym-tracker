// The workout being logged (#11). It lives on the phone and is saved on every change, so closing
// the tab, locking the screen or losing signal never loses a set. It goes to the backend only
// when it is finished.

import type { LastSet } from "@/lib/exercises";
import type { WorkoutInput } from "@/features/workouts/actions";

export type DraftSet = { key: string; weight: number | null; reps: number | null; rpe: number | null };
export type DraftExercise = { key: string; exerciseId: number; name: string; sets: DraftSet[] };
export type Draft = { version: 1; date: string; note: string; exercises: DraftExercise[] };

/** The one new workout in progress. */
export const NEW_DRAFT_KEY = "gym-tracker:trening";
/** Unsaved changes to a finished workout, one per workout. */
export const editDraftKey = (workoutId: number) => `gym-tracker:trening-edycja:${workoutId}`;
/** Fired on the window when the new workout's draft changes, so the resume bar follows in the same tab. */
export const DRAFT_EVENT = "gym-tracker:trening";

export type Field = "weight" | "reps" | "rpe";

// The same limits as the backend (backend/app/workouts.py).
export const LIMITS: Record<Field, { min: number; max: number; step: number }> = {
  weight: { min: 0, max: 1000, step: 0.25 },
  reps: { min: 1, max: 100, step: 1 },
  rpe: { min: 1, max: 10, step: 0.5 },
};

export const FIELD_HINT: Record<Field, string> = {
  weight: "Ciężar: od 0 do 1000 kg, co 0,25 kg, np. 82,5.",
  reps: "Powtórzenia: liczba od 1 do 100.",
  rpe: "RPE: od 1 do 10, co 0,5, albo puste.",
};

let counter = 0;
export const newKey = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

export const emptyDraft = (date: string): Draft => ({ version: 1, date, note: "", exercises: [] });

/** "82,5" or "82.5" as a number; empty is null; anything off the field's range or step is "invalid". */
export function parseValue(text: string, field: Field): number | null | "invalid" {
  const trimmed = text.trim().replace(",", ".");
  if (trimmed === "") return null;
  if (!/^\d+(\.\d+)?$|^\d+\.$|^\.\d+$/.test(trimmed)) return "invalid";
  const value = Number(trimmed);
  const { min, max, step } = LIMITS[field];
  if (value < min || value > max) return "invalid";
  // Steps are 1, 0,5 and 0,25: whole multiples in quarters avoid floating point noise.
  if (Math.abs(value / step - Math.round(value / step)) > 1e-9) return "invalid";
  return value;
}

export const isComplete = (set: DraftSet) => set.reps !== null && set.weight !== null;

export function hasContent(draft: Draft | null): boolean {
  return !!draft && (draft.exercises.length > 0 || draft.note.trim() !== "");
}

/** Exercises with at least one complete set, the complete sets, and the sets that will be left out. */
export function summarize(draft: Draft): { exercises: number; sets: number; incomplete: number } {
  let sets = 0;
  let incomplete = 0;
  let exercises = 0;
  for (const exercise of draft.exercises) {
    const complete = exercise.sets.filter(isComplete).length;
    sets += complete;
    incomplete += exercise.sets.length - complete;
    if (complete > 0) exercises += 1;
  }
  return { exercises, sets, incomplete };
}

/** What the backend receives: only complete sets, and only exercises that have one. */
export function toInput(draft: Draft): WorkoutInput {
  return {
    workout_date: draft.date,
    note: draft.note.trim() || null,
    exercises: draft.exercises
      .map((exercise) => ({
        exercise_id: exercise.exerciseId,
        sets: exercise.sets.filter(isComplete).map((set) => ({ reps: set.reps!, weight_kg: set.weight!, rpe: set.rpe })),
      }))
      .filter((exercise) => exercise.sets.length > 0),
  };
}

/**
 * The next set of an exercise starts with the previous set's values. The first set starts with
 * last time's best set ("Ostatnio"), or empty for an exercise done for the first time.
 */
export function nextSet(exercise: DraftExercise, last?: LastSet): DraftSet {
  const previous = exercise.sets.at(-1);
  if (previous) return { key: newKey(), weight: previous.weight, reps: previous.reps, rpe: previous.rpe };
  if (last) return { key: newKey(), weight: last.weight_kg, reps: last.reps, rpe: null };
  return { key: newKey(), weight: null, reps: null, rpe: null };
}

export function newExercise(exerciseId: number, name: string, last?: LastSet): DraftExercise {
  const exercise: DraftExercise = { key: newKey(), exerciseId, name, sets: [] };
  return { ...exercise, sets: [nextSet(exercise, last)] };
}

type SavedWorkout = {
  note: string | null;
  exercises: { exercise_id: number; name: string; sets: { reps: number; weight_kg: number; rpe: number | null }[] }[];
};

/** A finished workout as a draft: for editing it, or for "Powtórz" with today's date. */
export function fromWorkout(workout: SavedWorkout, date: string, keepNote: boolean): Draft {
  return {
    version: 1,
    date,
    note: keepNote ? (workout.note ?? "") : "",
    exercises: workout.exercises.map((exercise) => ({
      key: newKey(),
      exerciseId: exercise.exercise_id,
      name: exercise.name,
      sets: exercise.sets.map((set) => ({ key: newKey(), weight: set.weight_kg, reps: set.reps, rpe: set.rpe })),
    })),
  };
}

function isDraft(value: unknown): value is Draft {
  const draft = value as Draft;
  return !!draft && draft.version === 1 && typeof draft.date === "string" && Array.isArray(draft.exercises);
}

// Storage can be missing or full (private mode); the logger still works, it just cannot keep the draft.

export function readDraft(key: string): Draft | null {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeDraft(key: string, draft: Draft) {
  try {
    window.localStorage.setItem(key, JSON.stringify(draft));
  } catch {}
  if (key === NEW_DRAFT_KEY) window.dispatchEvent(new Event(DRAFT_EVENT));
}

export function clearDraft(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {}
  if (key === NEW_DRAFT_KEY) window.dispatchEvent(new Event(DRAFT_EVENT));
}
