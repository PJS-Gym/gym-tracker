"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Button, EmptyState } from "@/design-system";
import type { Catalogue } from "@/lib/exercises";
import { countLabel } from "@/lib/format";
import { ExerciseFilters } from "./exercise-filters";
import { ExerciseLinkRow } from "./exercise-row";
import { type Filters, filterExercises, NO_FILTERS } from "./search";

// The address keeps the filters (see filtersFromParams), so coming back from an exercise finds the list as it was left.
function writeToAddress(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.muscle) params.set("partia", filters.muscle);
  if (filters.equipment) params.set("sprzet", filters.equipment);
  if (filters.mine) params.set("moje", "1");
  const query = params.toString();
  window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
}

export function ExerciseBrowser({ catalogue, initial }: { catalogue: Catalogue; initial: Filters }) {
  const [filters, setFilters] = useState(initial);
  // Typing stays instant; the list catches up a moment later on a slow phone.
  const deferred = useDeferredValue(filters);
  const groupNames = useMemo(() => new Map(catalogue.muscle_groups.map((g) => [g.key, g.name_pl])), [catalogue]);
  const found = useMemo(() => filterExercises(catalogue.exercises, deferred), [catalogue, deferred]);
  const hasOwn = catalogue.exercises.some((e) => e.own);

  function change(next: Filters) {
    setFilters(next);
    writeToAddress(next);
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <ExerciseFilters
        filters={filters}
        onChange={change}
        muscleGroups={catalogue.muscle_groups}
        equipment={catalogue.equipment}
        showMine={hasOwn || filters.mine}
      />

      <p className="m-0 text-body-s text-fg-2 tabular-nums" aria-live="polite">
        {countLabel(found.length, "ćwiczenie", "ćwiczenia", "ćwiczeń")}
      </p>

      {found.length === 0 ? (
        <EmptyState
          title="Nic tu nie pasuje"
          body={
            filters.mine && !hasOwn
              ? "Nie masz jeszcze własnych ćwiczeń. Dodaj pierwsze przyciskiem u góry."
              : "Sprawdź pisownię albo poluzuj filtry. Możesz też szukać po angielsku."
          }
          action={<Button onClick={() => change(NO_FILTERS)}>Wyczyść filtry</Button>}
        />
      ) : (
        <ul
          className="m-0 grid list-none gap-2.5 p-0 md:grid-cols-2 md:gap-3 xl:grid-cols-3"
          style={{ opacity: deferred === filters ? 1 : 0.6, transition: "opacity 120ms" }}
        >
          {found.map((exercise) => (
            <li key={exercise.id}>
              <ExerciseLinkRow exercise={exercise} groupNames={groupNames} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExerciseBrowserPlaceholder() {
  return (
    <div aria-hidden="true" className="grid gap-4">
      <span className="placeholder-block h-14 rounded-[16px]" />
      <div className="flex gap-2">
        <span className="placeholder-block h-11 w-24 rounded-full" />
        <span className="placeholder-block h-11 w-24 rounded-full" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className="placeholder-block h-[76px] rounded-[20px]" />
        ))}
      </div>
    </div>
  );
}
