import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingSignUp } from "@/features/onboarding/onboarding-sign-up";
import { uiPreview } from "@/lib/ui-preview";

export const metadata: Metadata = { title: "Załóż konto" };

export default function SignUpPage() {
  if (uiPreview) return <p className="m-0 text-center text-fg-2">Podgląd UI: logowanie jest wyłączone.</p>;
  return (
    <Suspense>
      <GuestsOnly />
    </Suspense>
  );
}

async function GuestsOnly() {
  if ((await auth()).userId) redirect("/");
  return <OnboardingSignUp />;
}
