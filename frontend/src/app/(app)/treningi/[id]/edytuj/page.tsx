import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { fromWorkout } from "@/features/logger/draft";
import { LoggerPlaceholder, WorkoutLogger } from "@/features/logger/workout-logger";
import { getCatalogue } from "@/lib/exercises";
import { todayInWarsaw } from "@/lib/format";
import { getWorkout } from "@/lib/workouts";

export const metadata: Metadata = { title: "Edycja treningu" };

// Editing a finished workout (#13) in the same logger: date, exercises, sets and note.
export default function EditWorkoutPage({ params }: PageProps<"/treningi/[id]/edytuj">) {
  return (
    <Screen title="Edycja treningu" header={false} bare>
      <Suspense fallback={<LoggerPlaceholder />}>
        <Logger params={params} />
      </Suspense>
    </Screen>
  );
}

async function Logger({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const workout = Number.isInteger(id) && id > 0 ? await getWorkout(id) : null;
  if (!workout) notFound();
  const catalogue = await getCatalogue();
  await connection();
  return (
    <WorkoutLogger
      catalogue={catalogue}
      today={todayInWarsaw()}
      workoutId={workout.id}
      initial={fromWorkout(workout, workout.workout_date, true)}
    />
  );
}
