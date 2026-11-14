import { auth } from "@clerk/nextjs/server";
import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
import { getProfile } from "@/lib/profile";
import { uiPreview } from "@/lib/ui-preview";

export const metadata: Metadata = {
  title: "Poznajmy się",
};

// The keyboard shrinks the page on Android, so the button stays above it.
export const viewport: Viewport = { interactiveWidget: "resizes-content" };

// Open to guests: onboarding comes first, the account after it.
export default function OnboardingPage() {
  return (
    <Suspense>
      <FirstRunOnly />
    </Suspense>
  );
}

/** Onboarding shows once: a member who finished or skipped it goes straight to the app. */
async function FirstRunOnly() {
  // UI preview has a finished sample profile, and no Clerk to sign up with.
  if (uiPreview) return <OnboardingFlow mode="member" />;
  if ((await auth()).userId === null) return <OnboardingFlow mode="guest" />;
  const profile = await getProfile();
  if (profile.onboarded_at) redirect("/");
  return <OnboardingFlow mode="member" />;
}
