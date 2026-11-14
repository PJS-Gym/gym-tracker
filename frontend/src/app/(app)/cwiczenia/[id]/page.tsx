import type { Metadata } from "next";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { BackLink } from "@/components/top-bar-link";
import { ExerciseContent, ExercisePlaceholder } from "@/features/exercises/exercise-content";

export const metadata: Metadata = { title: "Ćwiczenie" };

export default function ExercisePage({ params }: PageProps<"/cwiczenia/[id]">) {
  return (
    <Screen title="Ćwiczenie" back={<BackLink href="/cwiczenia" label="Wróć do listy ćwiczeń" text="Ćwiczenia" />}>
      <Suspense fallback={<ExercisePlaceholder />}>
        <ExerciseContent params={params} />
      </Suspense>
    </Screen>
  );
}
