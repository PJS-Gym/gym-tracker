"use server";

import { redirect } from "next/navigation";
import type { Sex } from "@/features/profile/validation";
import { apiFetch } from "@/lib/api";
import { uiPreview } from "@/lib/ui-preview";

/** What the form collected. `null` means the member skipped that field; `data === null` skips everything. */
export type OnboardingData = {
  displayName: string | null;
  birthDate: string | null;
  sex: Sex | null;
  heightCm: number | null;
  /** Saved as the first body measurement, dated today. `null` when all three values were skipped. */
  firstMeasurement: {
    date: string;
    massKg: number | null;
    chestCm: number | null;
    hipsCm: number | null;
  } | null;
};

/**
 * Saves the profile and first measurement and marks onboarding done, then opens the app.
 * Returns an error message when the backend refused or could not be reached.
 */
export async function completeOnboarding(data: OnboardingData | null): Promise<{ error: string }> {
  if (!uiPreview) {
    const m = data?.firstMeasurement;
    const response = await apiFetch("/me/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: data?.displayName ?? null,
        birth_date: data?.birthDate ?? null,
        sex: data?.sex ?? null,
        height_cm: data?.heightCm ?? null,
        first_measurement: m
          ? { measured_on: m.date, mass_kg: m.massKg, chest_cm: m.chestCm, hips_cm: m.hipsCm }
          : null,
      }),
    }).catch(() => null);
    // 409: finished already, e.g. in another tab. Either way the app is next.
    if (!response || (!response.ok && response.status !== 409)) {
      return { error: "Nie zapisaliśmy profilu. Sprawdź połączenie i spróbuj ponownie." };
    }
  }
  redirect("/");
}
