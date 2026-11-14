"use client";

import { useClerk } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { AppIcon } from "@/components/app-icons";
import { clearDraft } from "@/features/onboarding/draft";
import { uiPreview } from "@/lib/ui-preview";

type Props = { children: (signOut: () => void) => ReactNode };

function ClerkSignOut({ children }: Props) {
  const { signOut } = useClerk();
  return children(() => {
    // Answers typed before signing up must not outlive the session on a shared device.
    clearDraft();
    signOut({ redirectUrl: "/sign-in" });
  });
}

/** Hands its child a sign-out function. In UI preview there is no Clerk, so it does nothing. */
export function SignOut({ children }: Props) {
  return uiPreview ? children(() => {}) : <ClerkSignOut>{children}</ClerkSignOut>;
}

/** A round sign-out button, for the side menu's account card. */
export function SignOutIconButton() {
  return (
    <SignOut>
      {(signOut) => (
        <button
          type="button"
          onClick={signOut}
          aria-label="Wyloguj się"
          title="Wyloguj się"
          className="pjs-i pjs-press pjs-press--icon flex size-10 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-fg-2"
        >
          <AppIcon name="log-out" size={18} />
        </button>
      )}
    </SignOut>
  );
}
