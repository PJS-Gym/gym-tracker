import type { Metadata } from "next";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { EmptyState, StatTile } from "@/design-system";
import { getMeasurements, type Measurement } from "@/lib/profile";

export const metadata: Metadata = { title: "Ciało" };

// Numbers hold still: always one decimal, Polish decimal comma.
const oneDecimal = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const longDate = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

const formatDay = (iso: string) => longDate.format(new Date(`${iso}T12:00:00`));

const VALUES = [
  { key: "mass_kg", label: "Masa", unit: "kg" },
  { key: "chest_cm", label: "Obwód klatki", unit: "cm" },
  { key: "hips_cm", label: "Obwód bioder", unit: "cm" },
] as const;

export default function CialoPage() {
  return (
    <Screen title="Ciało" subtitle="Masa i obwody z kolejnych pomiarów.">
      <Suspense>
        <Measurements />
      </Suspense>
    </Screen>
  );
}

// The latest measurement and the ones before it. Charts and adding measurements come with #17.
async function Measurements() {
  const [latest, ...earlier] = await getMeasurements();
  if (!latest) {
    return (
      <div className="card p-6 sm:p-8">
        <EmptyState
          title="Nie masz jeszcze pomiarów"
          body="Tu zobaczysz masę i obwody z kolejnych pomiarów."
          style={{ padding: 0 }}
        />
      </div>
    );
  }

  return (
    <>
      <section aria-labelledby="cialo-latest" className="grid gap-4">
        <div className="grid gap-1">
          <h2 id="cialo-latest" className="m-0 text-title-m font-extrabold">
            Ostatni pomiar
          </h2>
          <p className="m-0 text-body-s text-fg-2">{formatDay(latest.measured_on)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {VALUES.map(({ key, label, unit }) =>
            latest[key] === null ? null : (
              <div key={key} className="card p-5">
                <StatTile label={label} value={oneDecimal.format(latest[key])} unit={unit} />
              </div>
            ),
          )}
        </div>
      </section>

      {earlier.length > 0 && (
        <section aria-labelledby="cialo-earlier" className="grid gap-2">
          <h2 id="cialo-earlier" className="m-0 text-title-m font-extrabold">
            Wcześniejsze pomiary
          </h2>
          <ol className="card m-0 grid list-none p-2 sm:p-3">
            {earlier.map((m, index) => (
              <li key={m.id} className="relative grid grid-cols-[20px_minmax(0,1fr)] gap-3 rounded-[16px] px-3 py-3.5">
                {/* A thread through the dates, so the list reads as a timeline. */}
                <span aria-hidden="true" className="relative flex justify-center">
                  <span className="mt-1.5 size-2.5 rounded-full bg-[var(--accent)]" />
                  {index < earlier.length - 1 && <span className="absolute top-5 -bottom-5 w-px bg-[var(--card-edge)]" />}
                </span>
                <span className="grid gap-0.5">
                  <span className="font-semibold">{formatDay(m.measured_on)}</span>
                  <span className="text-body-s text-fg-2 tabular-nums">{summary(m)}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}

function summary(m: Measurement) {
  return VALUES.filter(({ key }) => m[key] !== null)
    .map(({ key, label, unit }) => `${label} ${oneDecimal.format(m[key]!)} ${unit}`)
    .join(" · ");
}
