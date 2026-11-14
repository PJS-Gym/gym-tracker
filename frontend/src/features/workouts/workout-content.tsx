import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ViewTransition } from "react";
import { DarkPanel } from "@/components/dark-panel";
import { LINK_BUTTON } from "@/components/top-bar-link";
import { Icon } from "@/design-system";
import { MuscleChart } from "@/features/summary/muscle-chart";
import { formatLongDay, formatNumber, formatRelativeDay, formatWeight, todayInWarsaw } from "@/lib/format";
import { getWorkout } from "@/lib/workouts";
import { DeleteWorkout } from "./delete-workout";

const wholeKg = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });

/**
 * A workout (#12): its totals, the muscle groups it trained, every exercise with its sets and the
 * note. From here it can be repeated, edited (#13) or deleted. Reads the session: render inside <Suspense>.
 */
export async function WorkoutContent({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const workout = Number.isInteger(id) && id > 0 ? await getWorkout(id) : null;
  if (!workout) notFound();
  await connection();
  const today = todayInWarsaw();
  const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const relative = formatRelativeDay(workout.workout_date, today);

  return (
    <ViewTransition enter="reveal" default="none">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
        <DarkPanel className="grid gap-8 pt-7">
          <header className="grid gap-1">
            {relative !== formatLongDay(workout.workout_date) && (
              <p className="m-0 text-body-s font-semibold text-fg-2 first-letter:uppercase">{formatLongDay(workout.workout_date)}</p>
            )}
            <h2 className="pjs-display m-0 text-display-m first-letter:uppercase md:text-display-l">{relative}</h2>
          </header>
          <dl className="m-0 grid grid-cols-3 gap-2 sm:gap-3">
            <Total label="Serie" value={formatNumber(totalSets)} />
            <Total label="Efektywne" value={formatNumber(workout.effective_sets)} />
            <Total label="Tonaż" value={wholeKg.format(workout.tonnage_kg)} unit="kg" />
          </dl>
        </DarkPanel>

        <div className="grid grid-cols-2 gap-3">
          <Link href={`/treningi/nowy?powtorz=${workout.id}`} transitionTypes={["nav-forward"]} className={`${LINK_BUTTON.primary} !h-12 px-4`}>
            <Icon name="copy" size={18} />
            Powtórz
          </Link>
          <Link href={`/treningi/${workout.id}/edytuj`} transitionTypes={["nav-forward"]} className={LINK_BUTTON.tonal}>
            <Icon name="pencil" size={18} />
            Edytuj
          </Link>
        </div>

        {workout.groups.length > 0 && <MuscleChart groups={workout.groups} />}

        <section aria-labelledby="workout-exercises" className="grid gap-4">
          <h2 id="workout-exercises" className="m-0 text-title-m font-extrabold">
            Ćwiczenia
          </h2>
          <ol className="m-0 grid list-none gap-3 p-0">
            {workout.exercises.map((exercise, index) => (
              <li key={index} className="card grid gap-1 p-2 sm:p-3">
                <Link
                  href={`/cwiczenia/${exercise.exercise_id}`}
                  transitionTypes={["nav-forward"]}
                  className="pjs-i group flex items-center gap-3 rounded-[16px] p-2 text-title-s font-bold text-fg no-underline hover:no-underline"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-body-s font-extrabold text-[var(--text-on-accent-soft)] tabular-nums">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">{exercise.name}</span>
                  <Icon name="chevron-right" size={20} className="shrink-0 text-fg-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <ol className="m-0 grid list-none px-2 pb-1">
                  {exercise.sets.map((set, setIndex) => (
                    <li
                      key={setIndex}
                      className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-3 border-t border-line py-2.5 tabular-nums"
                    >
                      <span className="text-center text-body-s text-fg-2">{setIndex + 1}</span>
                      <span className="font-bold">
                        {formatWeight(set.weight_kg)}&nbsp;kg × {set.reps}
                      </span>
                      <span className="text-body-s text-fg-2">{set.rpe !== null ? `RPE ${formatNumber(set.rpe)}` : ""}</span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </section>

        {workout.note && (
          <section aria-labelledby="workout-note" className="card grid gap-2 p-5 sm:p-6">
            <h2 id="workout-note" className="m-0 text-title-s font-bold">
              Notatka
            </h2>
            <p className="m-0 whitespace-pre-line text-fg-2">{workout.note}</p>
          </section>
        )}

        <div className="border-t border-line pt-6">
          <DeleteWorkout id={workout.id} day={formatLongDay(workout.workout_date)} sets={totalSets} />
        </div>
      </div>
    </ViewTransition>
  );
}

function Total({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="grid gap-2 rounded-[18px] border border-line bg-white/[0.04] p-3 sm:p-4">
      <dt className="text-label text-fg-2">{label}</dt>
      <dd className="m-0 flex items-baseline gap-1">
        <span className="text-[length:var(--fs-metric-m)] leading-none font-extrabold tabular-nums sm:text-[28px]">{value}</span>
        {unit && <span className="text-body-s font-bold text-fg-2">{unit}</span>}
      </dd>
    </div>
  );
}

export function WorkoutPlaceholder() {
  return (
    <ViewTransition exit="placeholder" default="none">
      <div aria-hidden="true" className="grid gap-8">
        <span className="placeholder-block h-48 rounded-[28px]" />
        <span className="placeholder-block h-12 rounded-full" />
        <span className="placeholder-block h-32" />
        <span className="placeholder-block h-32" />
      </div>
    </ViewTransition>
  );
}
