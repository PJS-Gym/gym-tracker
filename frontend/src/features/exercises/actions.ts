"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";
import { uiPreview } from "@/lib/ui-preview";

export type ExerciseInput = { name: string; equipment: string | null; primary: string[]; secondary: string[] };

export type SaveResult = { ok: true; id: number } | { ok: false };

/** Adds an own exercise, or changes one when `id` is given. The backend checks every rule again. */
export async function saveExercise(id: number | null, input: ExerciseInput): Promise<SaveResult> {
  if (uiPreview) return { ok: true, id: id ?? 1 };
  const response = await apiFetch(id ? `/me/exercises/${id}` : "/me/exercises", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).catch(() => null);
  if (!response?.ok) return { ok: false };
  const saved = (await response.json()) as { id: number };
  // The list, the exercise page and any workout that shows it.
  revalidatePath("/", "layout");
  return { ok: true, id: saved.id };
}

/** Deletes an own exercise; one that was logged only disappears from the list. */
export async function deleteExercise(id: number): Promise<{ ok: boolean }> {
  if (uiPreview) return { ok: true };
  const response = await apiFetch(`/me/exercises/${id}`, { method: "DELETE" }).catch(() => null);
  if (!response?.ok) return { ok: false };
  revalidatePath("/", "layout");
  return { ok: true };
}
