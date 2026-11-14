import type { Metadata } from "next";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { BackLink } from "@/components/top-bar-link";
import { ExerciseForm } from "@/features/exercises/exercise-form";
import { getCatalogue } from "@/lib/exercises";

export const metadata: Metadata = { title: "Nowe ćwiczenie" };

// An own exercise (#10): only its author sees it.
export default function NewExercisePage() {
  return (
    <Screen title="Nowe ćwiczenie" back={<BackLink href="/cwiczenia" label="Wróć do listy ćwiczeń" text="Ćwiczenia" />} width="narrow">
      <p className="m-0 text-fg-2">Ćwiczenie, którego nie ma w bazie. Widzisz je tylko ty.</p>
      <Suspense fallback={<span aria-hidden="true" className="placeholder-block h-96" />}>
        <Form />
      </Suspense>
    </Screen>
  );
}

async function Form() {
  const catalogue = await getCatalogue();
  return <ExerciseForm muscleGroups={catalogue.muscle_groups} equipment={catalogue.equipment} />;
}
