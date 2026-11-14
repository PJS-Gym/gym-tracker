import { redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import { AccountChip, AccountChipPlaceholder } from "@/features/navigation/account-chip";
import { AppFrame } from "@/features/navigation/app-frame";
import { getProfile } from "@/lib/profile";

// Everything in (app) needs a signed-in user; src/proxy.ts enforces it.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AppFrame
      account={
        <Suspense fallback={<AccountChipPlaceholder />}>
          <AccountChip />
        </Suspense>
      }
    >
      <Suspense>
        <OnboardedOnly>{children}</OnboardedOnly>
      </Suspense>
    </AppFrame>
  );
}

/** A member who has not finished or skipped onboarding starts there, whichever screen they opened. */
async function OnboardedOnly({ children }: { children: ReactNode }) {
  const profile = await getProfile();
  if (!profile.onboarded_at) redirect("/onboarding");
  return children;
}
