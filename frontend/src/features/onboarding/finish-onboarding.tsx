"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button, EmptyState } from "@/design-system";
import { todayIso } from "@/features/profile/validation";
import { completeOnboarding } from "./actions";
import { clearDraft, type Draft, readDraft, saveDraft } from "./draft";

/**
 * Right after sign-up: saves what the member typed as a guest to their new account and opens the
 * app. Without a draft (signed up directly, or another browser) it opens the form instead.
 */
export function FinishOnboarding() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const started = useRef(false);

  function save(draft: Draft) {
    // The first measurement is dated the day it is saved, even if sign-up ran past midnight.
    const data = draft.data?.firstMeasurement
      ? { ...draft.data, firstMeasurement: { ...draft.data.firstMeasurement, date: todayIso() } }
      : draft.data;
    startTransition(async () => {
      clearDraft();
      // Opens the app on success; only a failure comes back.
      const result = await completeOnboarding(data);
      saveDraft(draft.data);
      setError(result.error);
    });
  }

  useEffect(() => {
    // Once, even when development mode runs effects twice.
    if (started.current) return;
    started.current = true;
    const draft = readDraft();
    if (draft) save(draft);
    else router.replace("/onboarding");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on arrival
  }, []);

  return (
    <main className="mx-auto grid w-full max-w-[560px] gap-6 px-gutter py-10">
      {error ? (
        <EmptyState
          as="h1"
          title="Nie zapisaliśmy profilu"
          body={error}
          action={
            <Button
              onClick={() => {
                const draft = readDraft();
                if (draft) save(draft);
              }}
              disabled={pending}
              aria-busy={pending || undefined}
            >
              Spróbuj ponownie
            </Button>
          }
        />
      ) : (
        <p role="status" className="m-0 text-fg-2">
          Zapisujemy profil…
        </p>
      )}
    </main>
  );
}
