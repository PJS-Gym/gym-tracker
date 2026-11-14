"use client";

import { useId, useState } from "react";
import { Chip, Icon, TextField } from "@/design-system";
import type { Option } from "@/lib/exercises";
import { capitalize } from "@/lib/format";
import { type Filters, hasFilters, NO_FILTERS } from "./search";

type Panel = "muscle" | "equipment" | null;

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  muscleGroups: Option[];
  equipment: Option[];
  /** Hides "Tylko moje" when the member has no own exercises yet. */
  showMine?: boolean;
};

const nameOf = (options: Option[], key: string | null) => options.find((o) => o.key === key)?.name_pl;

/**
 * Search plus three filters that work together: primary muscle group, equipment and "Tylko moje".
 * A filter's choices open in place under the chips, so the bar also works inside the picker sheet.
 */
export function ExerciseFilters({ filters, onChange, muscleGroups, equipment, showMine = true }: Props) {
  const [panel, setPanel] = useState<Panel>(null);
  const panelId = useId();
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const toggle = (next: Panel) => setPanel((open) => (open === next ? null : next));
  const options = panel === "muscle" ? muscleGroups : equipment;
  const chosen = panel === "muscle" ? filters.muscle : filters.equipment;

  return (
    <div className="grid gap-3">
      <TextField
        label="Szukaj ćwiczenia"
        hideLabel
        icon="search"
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        placeholder="Szukaj, np. wyciskanie albo bench…"
        value={filters.query}
        onValueChange={(query) => set({ query })}
      />

      <div className="-mx-gutter flex gap-2 overflow-x-auto px-gutter [scrollbar-width:none]">
        <FilterChip
          label={nameOf(muscleGroups, filters.muscle) ?? "Partia"}
          active={filters.muscle !== null}
          open={panel === "muscle"}
          controls={panelId}
          onClick={() => toggle("muscle")}
        />
        <FilterChip
          label={nameOf(equipment, filters.equipment) ?? "Sprzęt"}
          active={filters.equipment !== null}
          open={panel === "equipment"}
          controls={panelId}
          onClick={() => toggle("equipment")}
        />
        {showMine && (
          <Chip selected={filters.mine} onClick={() => set({ mine: !filters.mine })}>
            Tylko moje
          </Chip>
        )}
        {hasFilters(filters) && (
          <button
            type="button"
            onClick={() => {
              setPanel(null);
              onChange(NO_FILTERS);
            }}
            className="pjs-i h-11 shrink-0 rounded-full px-3 text-body-s font-bold text-fg-accent"
          >
            Wyczyść
          </button>
        )}
      </div>

      {/* Grows open from zero height; the chips inside wrap. */}
      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-200 ease-[var(--ease-standard)]"
        style={{ gridTemplateRows: panel ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden" inert={!panel}>
          <div role="group" aria-label={panel === "muscle" ? "Partia główna" : "Sprzęt"} className="flex flex-wrap gap-2 pt-1 pb-2">
            {panel &&
              [{ key: null, name_pl: panel === "muscle" ? "Wszystkie partie" : "Każdy sprzęt" }, ...options].map((option) => (
                <Chip
                  key={option.key ?? "all"}
                  selected={chosen === option.key}
                  onClick={() => {
                    set(panel === "muscle" ? { muscle: option.key } : { equipment: option.key });
                    setPanel(null);
                  }}
                >
                  {capitalize(option.name_pl)}
                </Chip>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  open,
  controls,
  onClick,
}: {
  label: string;
  active: boolean;
  open: boolean;
  controls: string;
  onClick: () => void;
}) {
  return (
    <Chip selected={active} aria-pressed={undefined} aria-expanded={open} aria-controls={controls} onClick={onClick}>
      <span>{capitalize(label)}</span>
      <Icon
        name="chevron-down"
        size={16}
        className="transition-transform duration-200"
        style={{ transform: open ? "rotate(180deg)" : undefined }}
      />
    </Chip>
  );
}
