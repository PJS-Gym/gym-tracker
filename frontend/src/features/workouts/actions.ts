"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";
import type { LastSet } from "@/lib/exercises";
import { uiPreview } from "@/lib/ui-preview";
import { getWorkouts, type WorkoutPage } from "@/lib/workouts";

export type WorkoutInput = {
  workout_date: string;
  note: string | null;
  exercises: { exercise_id: number; sets: { reps: number; weight_kg: number; rpe: number | null }[] }[];
};

export type SaveWorkoutResult = { ok: true; id: number } | { ok: false; message: string };

/** The next page of the history, for scrolling further down Treningi. */
export async function loadWorkouts(after: string): Promise<WorkoutPage> {
  return getWorkouts(after);
}

/** Saves a finished workout, or a new version of one when `id` is given (#11, #13). */
export async function saveWorkout(id: number | null, input: WorkoutInput): Promise<SaveWorkoutResult> {
  if (uiPreview) return { ok: true, id: id ?? 1 };
  const response = await apiFetch(id ? `/me/workouts/${id}` : "/me/workouts", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).catch(() => null);
  if (!response) return { ok: false, message: "Brak połączenia. Trening czeka na telefonie, spróbuj za chwilę." };
  if (response.status === 422) return { ok: false, message: "Sprawdź datę i serie: coś nie przeszło walidacji." };
  if (!response.ok) return { ok: false, message: "Nie udało się zapisać treningu. Spróbuj jeszcze raz." };
  const saved = (await response.json()) as { id: number };
  // Start, Treningi, Podsumowanie and every exercise's history change with it.
  revalidatePath("/", "layout");
  return { ok: true, id: saved.id };
}

export async function deleteWorkout(id: number): Promise<{ ok: boolean }> {
  if (uiPreview) return { ok: true };
  const response = await apiFetch(`/me/workouts/${id}`, { method: "DELETE" }).catch(() => null);
  if (!response?.ok) return { ok: false };
  revalidatePath("/", "layout");
  return { ok: true };
}

/** "Ostatnio" for the logger: the best set of the latest workout before `before` (and not `exclude`). */
export async function lastSets(exerciseIds: number[], before: string, exclude: number | null): Promise<LastSet[]> {
  if (exerciseIds.length === 0) return [];
  if (uiPreview) return exerciseIds.filter((id) => id === 1).map((id) => ({ exercise_id: id, workout_date: "2026-11-12", reps: 8, weight_kg: 60 }));
  const query = new URLSearchParams({ before });
  for (const id of exerciseIds) query.append("id", String(id));
  if (exclude) query.set("exclude", String(exclude));
  const response = await apiFetch(`/me/exercises/last?${query}`).catch(() => null);
  if (!response?.ok) return [];
  return response.json() as Promise<LastSet[]>;
}
