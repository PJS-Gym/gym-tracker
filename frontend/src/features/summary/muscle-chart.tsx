"use client";

import { startTransition, useState, ViewTransition } from "react";
import { SegmentedControl } from "@/design-system";
import { formatKg, formatNumber, setsLabel } from "@/lib/format";
import type { MuscleGroupTotal } from "@/lib/training";

type Metric = "sets" | "tonnage";

const METRICS: { value: Metric; label: string }[] = [
  { value: "sets", label: "Serie efektywne" },
  { value: "tonnage", label: "Tonaż" },
];

const valueOf = (group: MuscleGroupTotal, metric: Metric) => (metric === "sets" ? group.effective_sets : group.tonnage_kg);

/**
 * Effective sets and tonnage for all 17 muscle groups, one shared scale per view and no bar for
 * a zero. Switching the view re-sorts the rows, and each row glides to its new place.
 * Groups with no sets stay at the end, greyed out.
 */
export function MuscleChart({ groups }: { groups: MuscleGroupTotal[] }) {
  const [metric, setMetric] = useState<Metric>("sets");

  const sorted = [...groups].sort((a, b) => {
    const aEmpty = a.effective_sets === 0;
    const bEmpty = b.effective_sets === 0;
    if (aEmpty !== bEmpty) return aEmpty ? 1 : -1;
    return valueOf(b, metric) - valueOf(a, metric) || b.effective_sets - a.effective_sets || a.name_pl.localeCompare(b.name_pl, "pl");
  });
  const max = Math.max(...groups.map((group) => valueOf(group, metric)), 0);

  return (
    <section aria-labelledby="summary-groups" className="card grid gap-5 p-5 sm:p-7">
      <h2 id="summary-groups" className="m-0 text-title-m font-extrabold">
        Partie mięśniowe
      </h2>
      <SegmentedControl<Metric>
        label="Pokaż"
        options={METRICS}
        value={metric}
        onValueChange={(next) => startTransition(() => setMetric(next))}
      />

      <ol className="m-0 grid list-none p-0">
        {sorted.map((group, index) => {
          const value = valueOf(group, metric);
          const empty = group.effective_sets === 0;
          const focal = index === 0 && value > 0;
          return (
            <ViewTransition key={group.key} name={`muscle-${group.key}`} update="reorder" default="none">
              <li className="grid gap-2 border-b border-line py-3.5 last:border-b-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className={`font-semibold first-letter:uppercase ${empty ? "text-fg-3" : ""}`}>{group.name_pl}</span>
                  <span className={`shrink-0 tabular-nums ${empty ? "text-fg-3" : focal ? "font-extrabold" : "font-bold"}`}>
                    {metric === "sets" ? setsLabel(group.effective_sets) : formatKg(group.tonnage_kg)}
                  </span>
                </div>
                {value > 0 && (
                  <span aria-hidden="true" className="block h-2">
                    <span
                      className="bar-grow block h-full rounded-full"
                      style={{
                        width: `${(value / max) * 100}%`,
                        minWidth: 4,
                        background: focal ? "var(--data-1)" : "var(--data-context)",
                        animationDelay: `${index * 30}ms`,
                      }}
                    />
                  </span>
                )}
                {!empty && (
                  <span className="text-caption text-fg-2 tabular-nums">
                    {metric === "sets" ? `${formatKg(group.tonnage_kg)} tonażu` : `${formatNumber(group.effective_sets)} serii efektywnych`}
                  </span>
                )}
              </li>
            </ViewTransition>
          );
        })}
      </ol>
    </section>
  );
}
