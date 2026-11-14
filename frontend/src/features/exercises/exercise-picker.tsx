"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Button, EmptyState, Sheet } from "@/design-system";
import type { Catalogue, Exercise } from "@/lib/exercises";
import { exercisesLabel } from "@/lib/format";
import { ExerciseFilters } from "./exercise-filters";
import { ExercisePickRow } from "./exercise-row";
import { type Filters, filterExercises, NO_FILTERS } from "./search";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalogue: Catalogue;
  /** The chosen exercises, in the order they were picked. */
  onPick: (exercises: Exercise[]) => void;
};

/**
 * The exercise picker (#9) as a sheet any screen can open: the same search and filters as the
 * list, several exercises at once, handed back in the order they were tapped.
 */
export function ExercisePicker({ open, onOpenChange, catalogue, onPick }: Props) {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [picked, setPicked] = useState<Exercise[]>([]);
  const deferred = useDeferredValue(filters);
  const groupNames = useMemo(() => new Map(catalogue.muscle_groups.map((g) => [g.key, g.name_pl])), [catalogue]);
  const found = useMemo(() => filterExercises(catalogue.exercises, deferred), [catalogue, deferred]);

  function close() {
    onOpenChange(false);
    setPicked([]);
    setFilters(NO_FILTERS);
  }

  function toggle(exercise: Exercise) {
    setPicked((current) => (current.some((e) => e.id === exercise.id) ? current.filter((e) => e.id !== exercise.id) : [...current, exercise]));
  }

  return (
    <Sheet open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())} title="Dodaj ćwiczenia" style={{ maxHeight: "92%", paddingBottom: 0 }}>
      <ExerciseFilters
        filters={filters}
        onChange={setFilters}
        muscleGroups={catalogue.muscle_groups}
        equipment={catalogue.equipment}
        showMine={catalogue.exercises.some((e) => e.own)}
      />
      {found.length === 0 ? (
        <EmptyState
          as="h3"
          title="Nic tu nie pasuje"
          body="Sprawdź pisownię albo poluzuj filtry. Możesz też szukać po angielsku."
          action={<Button onClick={() => setFilters(NO_FILTERS)}>Wyczyść filtry</Button>}
        />
      ) : (
        <ul className="m-0 -mt-2 grid list-none p-0">
          {found.map((exercise) => (
            <li key={exercise.id}>
              <ExercisePickRow
                exercise={exercise}
                groupNames={groupNames}
                selected={picked.some((e) => e.id === exercise.id)}
                onToggle={() => toggle(exercise)}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="sticky bottom-0 -mx-gutter mt-auto bg-surface-card px-gutter pt-2 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <Button
          size="lg"
          fullWidth
          disabled={picked.length === 0}
          onClick={() => {
            onPick(picked);
            close();
          }}
        >
          {picked.length === 0 ? "Wybierz ćwiczenia" : `Dodaj ${exercisesLabel(picked.length)}`}
        </Button>
      </div>
    </Sheet>
  );
}
