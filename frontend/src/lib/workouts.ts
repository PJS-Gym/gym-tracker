import "server-only";
import { apiFetch } from "./api";
import type { MuscleGroupTotal } from "./training";
import { uiPreview } from "./ui-preview";

// Shapes of /api/v1/me/workouts. Dates are calendar days.

export type WorkoutSet = { reps: number; weight_kg: number; rpe: number | null };

export type WorkoutDetail = {
  id: number;
  workout_date: string;
  note: string | null;
  exercises: { exercise_id: number; name: string; sets: WorkoutSet[] }[];
  effective_sets: number;
  tonnage_kg: number;
  /** Only the groups the workout trained, most effective sets first. */
  groups: MuscleGroupTotal[];
};

export type WorkoutListItem = {
  id: number;
  workout_date: string;
  exercises: string[];
  sets: number;
  primary_groups: string[];
};

export type WorkoutPage = { items: WorkoutListItem[]; next: string | null };

/** One workout, or null when it does not exist or belongs to someone else. Reads the session. */
export async function getWorkout(id: number): Promise<WorkoutDetail | null> {
  if (uiPreview) return id === PREVIEW_WORKOUT.id ? PREVIEW_WORKOUT : null;
  const response = await apiFetch(`/me/workouts/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GET /me/workouts/${id} answered ${response.status}`);
  return response.json() as Promise<WorkoutDetail>;
}

/** Twenty workouts, newest first, after the `next` cursor of the previous page. */
export async function getWorkouts(after?: string | null): Promise<WorkoutPage> {
  if (uiPreview) return { items: after ? [] : PREVIEW_PAGE, next: null };
  const response = await apiFetch(after ? `/me/workouts?after=${encodeURIComponent(after)}` : "/me/workouts");
  if (!response.ok) throw new Error(`GET /me/workouts answered ${response.status}`);
  return response.json() as Promise<WorkoutPage>;
}

const PREVIEW_WORKOUT: WorkoutDetail = {
  id: 1,
  workout_date: "2026-11-12",
  note: "Ostatnia seria ciężko, ale czysto.",
  exercises: [
    { exercise_id: 1, name: "Wyciskanie sztangi na ławce płaskiej", sets: [{ reps: 8, weight_kg: 60, rpe: 8 }, { reps: 8, weight_kg: 60, rpe: 8.5 }] },
    { exercise_id: 3, name: "Wiosłowanie hantlem", sets: [{ reps: 10, weight_kg: 26, rpe: null }] },
  ],
  effective_sets: 4.5,
  tonnage_kg: 1220,
  groups: [
    { key: "chest", name_pl: "klatka piersiowa", effective_sets: 2, tonnage_kg: 960 },
    { key: "upper_back", name_pl: "górna część pleców", effective_sets: 1, tonnage_kg: 260 },
    { key: "shoulders", name_pl: "barki", effective_sets: 1, tonnage_kg: 0 },
    { key: "triceps", name_pl: "triceps", effective_sets: 1, tonnage_kg: 0 },
  ],
};

const PREVIEW_PAGE: WorkoutListItem[] = [
  { id: 1, workout_date: "2026-11-12", exercises: ["Wyciskanie sztangi na ławce płaskiej", "Wiosłowanie hantlem"], sets: 3, primary_groups: ["klatka piersiowa", "górna część pleców"] },
  { id: 2, workout_date: "2026-11-10", exercises: ["Przysiad ze sztangą", "Podciąganie nachwytem"], sets: 8, primary_groups: ["czworogłowe uda", "najszersze grzbietu"] },
];
