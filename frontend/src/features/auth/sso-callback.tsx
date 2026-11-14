"use client";

import { HandleSSOCallback } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { safeRedirect } from "./auth-errors";
import { navigateTo } from "./auth-ui";

/** Where Google sends the browser back: finishes the sign-in and opens the app. */
export function SsoCallback() {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <>
      <p role="status" className="m-0 text-center text-fg-2">
        Logujemy cię…
      </p>
      <HandleSSOCallback
        navigateToApp={(args) => navigateTo(router.push, safeRedirect(params.get("next"), window.location.origin))(args)}
        navigateToSignIn={() => router.push("/sign-in")}
        navigateToSignUp={() => router.push("/sign-up")}
      />
    </>
  );
}
