import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { fromWorkout } from "@/features/logger/draft";
import { LoggerPlaceholder, WorkoutLogger } from "@/features/logger/workout-logger";
import { getCatalogue } from "@/lib/exercises";
import { todayInWarsaw } from "@/lib/format";
import { getWorkout } from "@/lib/workouts";

export const metadata: Metadata = { title: "Nowy trening" };

// The logger (#11). `?cwiczenie=<id>` adds an exercise ("Dodaj do treningu"); `?powtorz=<id>`
// starts from an earlier workout with today's date ("Powtórz", #13).
export default function NewWorkoutPage({ searchParams }: PageProps<"/treningi/nowy">) {
  return (
    <Screen title="Nowy trening" header={false} bare>
      <Suspense fallback={<LoggerPlaceholder />}>
        <Logger searchParams={searchParams} />
      </Suspense>
    </Screen>
  );
}

const idParam = (value: string | string[] | undefined) => {
  const id = typeof value === "string" ? Number(value) : NaN;
  return Number.isInteger(id) && id > 0 ? id : undefined;
};

async function Logger({ searchParams }: { searchParams: PageProps<"/treningi/nowy">["searchParams"] }) {
  const params = await searchParams;
  const repeatId = idParam(params.powtorz);
  const [catalogue, repeated] = await Promise.all([getCatalogue(), repeatId ? getWorkout(repeatId) : null]);
  await connection();
  const today = todayInWarsaw();
  return (
    <WorkoutLogger
      catalogue={catalogue}
      today={today}
      initial={repeated ? fromWorkout(repeated, today, false) : undefined}
      addExerciseId={idParam(params.cwiczenie)}
    />
  );
}
