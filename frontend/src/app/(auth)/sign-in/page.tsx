import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignInForm } from "@/features/auth/sign-in-form";
import { uiPreview } from "@/lib/ui-preview";

export const metadata: Metadata = { title: "Logowanie" };

// After signing in the form returns to the `redirect_url` the proxy added, or to Start.
export default function SignInPage() {
  if (uiPreview) return <p className="m-0 text-center text-fg-2">Podgląd UI: logowanie jest wyłączone.</p>;
  return (
    <Suspense>
      <GuestsOnly />
    </Suspense>
  );
}

async function GuestsOnly() {
  if ((await auth()).userId) redirect("/");
  return <SignInForm />;
}
