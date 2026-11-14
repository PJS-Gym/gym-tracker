import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { ExerciseForm } from "@/features/exercises/exercise-form";
import { EditBackLink } from "@/features/exercises/edit-back-link";
import { getCatalogue, getExercise } from "@/lib/exercises";

export const metadata: Metadata = { title: "Edycja ćwiczenia" };

export default function EditExercisePage({ params }: PageProps<"/cwiczenia/[id]/edytuj">) {
  return (
    <Screen
      title="Edycja ćwiczenia"
      width="narrow"
      back={
        <Suspense>
          <EditBackLink params={params} />
        </Suspense>
      }
    >
      <Suspense fallback={<span aria-hidden="true" className="placeholder-block h-96" />}>
        <Form params={params} />
      </Suspense>
    </Screen>
  );
}

async function Form({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const exercise = Number.isInteger(id) && id > 0 ? await getExercise(id) : null;
  // Shared and deleted exercises cannot be changed.
  if (!exercise || !exercise.own || exercise.deleted) notFound();
  const catalogue = await getCatalogue();
  return (
    <ExerciseForm
      id={exercise.id}
      initial={{ name: exercise.name, equipment: exercise.equipment, primary: exercise.primary, secondary: exercise.secondary }}
      muscleGroups={catalogue.muscle_groups}
      equipment={catalogue.equipment}
    />
  );
}
