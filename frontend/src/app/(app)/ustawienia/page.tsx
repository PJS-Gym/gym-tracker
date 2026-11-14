import type { Metadata } from "next";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { SettingsForm } from "@/features/settings/settings-form";
import { getProfile } from "@/lib/profile";

export const metadata: Metadata = { title: "Ustawienia" };

export default function UstawieniaPage() {
  return (
    <Screen title="Ustawienia" subtitle="Profil, powiadomienia i wygląd aplikacji." width="narrow">
      <Suspense>
        <Settings />
      </Suspense>
    </Screen>
  );
}

async function Settings() {
  return <SettingsForm profile={await getProfile()} />;
}
