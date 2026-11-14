import { ViewTransition } from "react";
import { EmptyState } from "@/design-system";
import { formatNumber, formatRange, plural } from "@/lib/format";
import { getSummary } from "@/lib/training";
import { MuscleChart } from "./muscle-chart";
import { parseRange } from "./range";

type Params = Promise<Record<string, string | string[] | undefined>>;

/** The numbers for the chosen range. Reads the session: render inside <Suspense>. */
export async function SummaryContent({ searchParams }: { searchParams: Params }) {
  const range = parseRange(await searchParams);
  if (range.kind === "custom-incomplete") {
    return <EmptyState title="Wybierz dwie daty" body="Podaj początek i koniec zakresu, a policzymy treningi z tych dni." />;
  }
  const summary =
    range.kind === "custom" ? await getSummary("custom", range.from, range.to) : await getSummary(range.kind);

  return (
    <ViewTransition enter="reveal" default="none">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
        <div
          data-theme="dark"
          className="grain relative isolate grid gap-2 overflow-hidden rounded-[28px] p-6 text-fg sm:p-8"
          style={{ background: "var(--hero)" }}
        >
          <p className="m-0 text-body-s font-semibold text-fg-2">{formatRange(summary.range.start, summary.range.end)}</p>
          <p className="m-0 flex items-baseline gap-3">
            <span className="text-[length:var(--fs-metric-xl)] leading-none font-extrabold tabular-nums">
              {formatNumber(summary.workouts)}
            </span>
            <span className="text-title-m font-bold text-fg-2">{plural(summary.workouts, "trening", "treningi", "treningów")}</span>
          </p>
        </div>

        {summary.workouts === 0 ? (
          <div className="card p-6 sm:p-8">
            <EmptyState
              title="W tym zakresie nie ma treningów"
              body="Wybierz inny zakres albo zapisz trening, a jego serie pojawią się tutaj."
              style={{ padding: 0 }}
            />
          </div>
        ) : (
          <MuscleChart groups={summary.groups} />
        )}
      </div>
    </ViewTransition>
  );
}

export function SummaryPlaceholder() {
  return (
    <ViewTransition exit="placeholder" default="none">
      <div aria-hidden="true" className="grid gap-8">
        <div className="grid gap-2">
          <span className="placeholder-block h-[136px] rounded-[28px]" />
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className="placeholder-block h-12" />
          ))}
        </div>
      </div>
    </ViewTransition>
  );
}
