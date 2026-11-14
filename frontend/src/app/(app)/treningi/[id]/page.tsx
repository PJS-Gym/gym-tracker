import type { Metadata } from "next";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { BackLink } from "@/components/top-bar-link";
import { WorkoutContent, WorkoutPlaceholder } from "@/features/workouts/workout-content";

export const metadata: Metadata = { title: "Trening" };

export default function WorkoutPage({ params }: PageProps<"/treningi/[id]">) {
  return (
    <Screen title="Trening" back={<BackLink href="/treningi" label="Wróć do treningów" text="Treningi" />}>
      <Suspense fallback={<WorkoutPlaceholder />}>
        <WorkoutContent params={params} />
      </Suspense>
    </Screen>
  );
}
