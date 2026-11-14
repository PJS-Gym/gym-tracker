import "server-only";
import type { Sex } from "@/features/profile/validation";
import { apiFetch } from "./api";
import { uiPreview } from "./ui-preview";

/** GET /api/v1/me/profile. Dates are calendar days ("1996-11-07"). */
export type Profile = {
  display_name: string | null;
  birth_date: string | null;
  sex: Sex | null;
  height_cm: number | null;
  onboarded_at: string | null;
  weekly_report_email: boolean;
};

/** GET /api/v1/me/measurements, newest first. */
export type Measurement = {
  id: number;
  measured_on: string;
  mass_kg: number | null;
  chest_cm: number | null;
  hips_cm: number | null;
};

// UI preview runs without Clerk or the backend, so it shows a finished profile.
const PREVIEW_PROFILE: Profile = {
  display_name: "Maciej",
  birth_date: "1996-05-14",
  sex: "male",
  height_cm: 168,
  onboarded_at: "2026-11-01T09:00:00Z",
  weekly_report_email: true,
};
const PREVIEW_MEASUREMENTS: Measurement[] = [
  { id: 1, measured_on: "2026-11-01", mass_kg: 62.5, chest_cm: 90, hips_cm: 98 },
];

async function getJson<T>(path: `/${string}`): Promise<T> {
  const response = await apiFetch(path);
  if (!response.ok) throw new Error(`GET ${path} answered ${response.status}`);
  return response.json() as Promise<T>;
}

/** The signed-in user's profile and settings. Reads the session: call it inside <Suspense>. */
export function getProfile(): Promise<Profile> {
  return uiPreview ? Promise.resolve(PREVIEW_PROFILE) : getJson<Profile>("/me/profile");
}

/** The signed-in user's body measurements, newest first. Reads the session: call it inside <Suspense>. */
export function getMeasurements(): Promise<Measurement[]> {
  return uiPreview ? Promise.resolve(PREVIEW_MEASUREMENTS) : getJson<Measurement[]>("/me/measurements");
}
