import type { Sex } from "@/features/profile/validation";
import type { OnboardingData } from "./actions";

// A guest fills in onboarding before they have an account. Their answers wait here, in this
// browser, until sign-up finishes and /onboarding/zapisz saves them to the new account.
const KEY = "gym-tracker:onboarding-draft";

/** `data: null` means the guest skipped everything. */
export type Draft = { data: OnboardingData | null };

export function saveDraft(data: OnboardingData | null) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ data } satisfies Draft));
  } catch {
    // Blocked storage: the answers are lost, and the signed-in form asks for them again.
  }
}

export function readDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

/** Removes everything a guest typed: the finished answers and the half-filled steps. */
export function clearDraft() {
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // Nothing to clear.
  }
}

// True once this page load has walked from the tutorial to /sign-up, so the steps are right behind
// it in the browser history and "Wróć" can step back instead of adding a new entry.
let cameFromTutorial = false;

export function markCameFromTutorial() {
  cameFromTutorial = true;
}

export function didComeFromTutorial() {
  return cameFromTutorial;
}

// The steps answered so far, so a reload or an interruption does not lose them.
const PROGRESS_KEY = "gym-tracker:onboarding-progress";

export type Progress = { values: Record<string, string>; sex: Sex | null };

export function saveProgress(progress: Progress) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Blocked storage: the answers still live in the open page.
  }
}

export function readProgress(): Progress | null {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as Progress) : null;
  } catch {
    return null;
  }
}
