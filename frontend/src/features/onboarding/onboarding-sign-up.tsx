"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore, ViewTransition } from "react";
import { SignUpForm } from "@/features/auth/sign-up-form";
import { nameToAddress } from "@/features/profile/validation";
import { didComeFromTutorial, readDraft } from "./draft";

const noopSubscribe = () => () => {};

/** `null` without onboarding answers waiting (someone opened /sign-up directly), otherwise the name given. */
function useWaitingName() {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      const draft = readDraft();
      return draft ? nameToAddress(draft.data?.displayName ?? "") : null;
    },
    () => null,
  );
}

/** Creating the account, which is the last step of onboarding when answers are waiting. */
export function OnboardingSignUp() {
  const name = useWaitingName();
  const router = useRouter();

  if (name === null) return <SignUpForm title="Załóż konto" intro="Potem zadamy ci kilka pytań." />;

  return (
    <ViewTransition enter={{ "step-forward": "step-forward", default: "none" }} default="none">
      <div className="grid w-full justify-items-center gap-6">
        <SignUpForm
          title={name ? `${name}, ostatni krok` : "Ostatni krok"}
          intro="Załóż konto, a zapiszemy na nim twoje odpowiedzi."
        />
        <Link
          href="/onboarding#jak-to-dziala"
          transitionTypes={["step-back"]}
          className="font-bold"
          onClick={(event) => {
            // A new history entry here would make the tutorial's back arrow return to this page.
            if (didComeFromTutorial()) {
              event.preventDefault();
              router.back();
            }
          }}
        >
          Wróć
        </Link>
      </div>
    </ViewTransition>
  );
}
