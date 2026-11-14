import type { Metadata } from "next";
import { Suspense } from "react";
import { SsoCallback } from "@/features/auth/sso-callback";

export const metadata: Metadata = { title: "Logowanie" };

export default function SsoCallbackPage() {
  return (
    <Suspense>
      <SsoCallback />
    </Suspense>
  );
}
