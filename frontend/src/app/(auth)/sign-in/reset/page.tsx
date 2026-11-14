import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { uiPreview } from "@/lib/ui-preview";

export const metadata: Metadata = { title: "Nowe hasło" };

export default function ResetPasswordPage() {
  if (uiPreview) return <p className="m-0 text-center text-fg-2">Podgląd UI: logowanie jest wyłączone.</p>;
  return (
    <Suspense>
      <GuestsOnly />
    </Suspense>
  );
}

async function GuestsOnly() {
  if ((await auth()).userId) redirect("/");
  return <ResetPasswordForm />;
}
