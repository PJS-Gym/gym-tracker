import type { Metadata } from "next";
import { FinishOnboarding } from "@/features/onboarding/finish-onboarding";

export const metadata: Metadata = {
  title: "Zapisujemy profil",
};

// Clerk opens this after every sign-up (signUpForceRedirectUrl in the root layout).
export default function FinishOnboardingPage() {
  return <FinishOnboarding />;
}
