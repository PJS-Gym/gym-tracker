"use server";

import { refresh } from "next/cache";
import { apiFetch } from "@/lib/api";
import { uiPreview } from "@/lib/ui-preview";
import type { Sex } from "./validation";

/** Only the fields present are changed. `null` clears a profile field. */
export type ProfilePatch = Partial<{
  displayName: string | null;
  birthDate: string | null;
  sex: Sex | null;
  heightCm: number | null;
  weeklyReportEmail: boolean;
}>;

const API_FIELDS = {
  displayName: "display_name",
  birthDate: "birth_date",
  sex: "sex",
  heightCm: "height_cm",
  weeklyReportEmail: "weekly_report_email",
} as const;

/** PATCH /api/v1/me/profile. Returns `ok: false` when the backend refused or could not be reached. */
export async function updateProfile(patch: ProfilePatch): Promise<{ ok: boolean }> {
  if (uiPreview) return { ok: true };
  const body = Object.fromEntries(
    Object.entries(patch).map(([key, value]) => [API_FIELDS[key as keyof ProfilePatch], value]),
  );
  const response = await apiFetch("/me/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  if (!response?.ok) return { ok: false };
  refresh();
  return { ok: true };
}
