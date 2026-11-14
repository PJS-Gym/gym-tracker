import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { DarkPanel } from "@/components/dark-panel";
import { LINK_BUTTON } from "@/components/top-bar-link";
import { Badge, EmptyState, Icon, StatTile } from "@/design-system";
import { getCatalogue, getExercise, getHistory, type History, type HistoryWorkout } from "@/lib/exercises";
import { formatDay, formatLongDay, formatNumber, formatSet, formatWeight } from "@/lib/format";
import { getProfile } from "@/lib/profile";
import { DeleteExercise } from "./delete-exercise";
import { ProgressChart } from "./progress-chart";

/** An exercise's page: what it trains, then the member's own history with it (#9, #15). */
export async function ExerciseContent({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const exercise = Number.isInteger(id) && id > 0 ? await getExercise(id) : null;
  if (!exercise) notFound();
  const [history, catalogue, profile] = await Promise.all([getHistory(id), getCatalogue(), getProfile()]);
  const groupName = new Map(catalogue.muscle_groups.map((g) => [g.key, g.name_pl]));
  const names = (keys: string[]) => keys.map((key) => groupName.get(key) ?? key).join(", ");
  const kind = exercise.own ? "Twoje ćwiczenie" : exercise.category_pl ? `Ćwiczenie ${exercise.category_pl}` : null;

  return (
    <ViewTransition enter="reveal" default="none">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
        <header className="grid gap-2">
          {kind && <p className="m-0 text-body-s font-semibold text-fg-2">{kind}</p>}
          <h2 className="pjs-display m-0 text-display-m [overflow-wrap:anywhere] md:text-display-l">{exercise.name}</h2>
          {exercise.name_en !== exercise.name && <p className="m-0 text-body-s text-fg-2">{exercise.name_en}</p>}
          {exercise.deleted && (
            <p className="m-0 flex items-center gap-2 text-body-s text-fg-2">
              <Badge>Usunięte</Badge> Zostaje w starych treningach, ale nie ma go już na liście.
            </p>
          )}
        </header>

        <dl className="card m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3.5 p-5 sm:p-6">
          <Term label="Partie główne" value={names(exercise.primary)} strong />
          {exercise.secondary.length > 0 && <Term label="Pomocnicze" value={names(exercise.secondary)} />}
          {exercise.equipment_pl && <Term label="Sprzęt" value={exercise.equipment_pl} />}
        </dl>

        {!exercise.deleted && (
          <Link href={`/treningi/nowy?cwiczenie=${exercise.id}`} transitionTypes={["nav-forward"]} className={LINK_BUTTON.primary}>
            <Icon name="plus" size={20} />
            Dodaj do treningu
          </Link>
        )}

        <MyHistory history={history} female={profile.sex === "female"} />

        {exercise.own && !exercise.deleted && (
          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <Link href={`/cwiczenia/${exercise.id}/edytuj`} transitionTypes={["nav-forward"]} className={LINK_BUTTON.tonal}>
              <Icon name="pencil" size={18} />
              Edytuj ćwiczenie
            </Link>
            <DeleteExercise id={exercise.id} name={exercise.name} used={history.workouts > 0} />
          </div>
        )}
      </div>
    </ViewTransition>
  );
}

function Term({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <>
      <dt className="text-body-s text-fg-2">{label}</dt>
      <dd className={`m-0 first-letter:uppercase ${strong ? "font-bold" : ""}`}>{value}</dd>
    </>
  );
}

function MyHistory({ history, female }: { history: History; female: boolean }) {
  return (
    <section aria-labelledby="exercise-history" className="grid gap-4">
      <h2 id="exercise-history" className="m-0 text-title-m font-extrabold">
        Moja historia
      </h2>

      {history.workouts === 0 ? (
        <div className="card p-6 sm:p-8">
          <EmptyState
            as="h3"
            title={female ? "Jeszcze nie wykonywałaś tego ćwiczenia" : "Jeszcze nie wykonywałeś tego ćwiczenia"}
            body="Dodaj je do treningu, a tutaj zobaczysz swoje serie, rekordy i wykres siły."
            style={{ padding: 0 }}
          />
        </div>
      ) : (
        <>
          <DarkPanel aria-label="Najlepszy e1RM" className="grid gap-4">
            <div className="grid gap-1">
              <p className="m-0 text-body-s font-semibold text-fg-2">Najlepszy e1RM</p>
              {history.best_e1rm ? (
                <>
                  <p className="m-0 flex items-baseline gap-2">
                    <span className="text-[length:var(--fs-metric-xl)] leading-none font-extrabold tabular-nums">
                      {formatNumber(history.best_e1rm.value)}
                    </span>
                    <span className="text-title-s font-bold text-fg-2">kg</span>
                  </p>
                  <p className="m-0 text-body-s text-fg-2">{formatLongDay(history.best_e1rm.workout_date)}</p>
                </>
              ) : (
                <p className="m-0 text-fg-2">
                  e1RM liczymy z serii z ciężarem, od 1 do 12 powtórzeń i z RPE co najmniej 7 albo bez RPE.
                </p>
              )}
            </div>
            {history.points.length >= 2 && <ProgressChart points={history.points} />}
            {history.points.length === 1 && (
              <p className="m-0 text-body-s text-fg-2">Po kolejnym treningu zobaczysz tu wykres siły.</p>
            )}
          </DarkPanel>

          <div className="grid grid-cols-2 gap-3 md:gap-4 [&>*]:rounded-[24px] [&>*]:border [&>*]:border-[var(--card-edge)] [&>*]:bg-surface-card [&>*]:p-5 [&>*]:shadow-[var(--card-shadow)]">
            <StatTile
              label="Największy ciężar"
              value={history.heaviest ? formatWeight(history.heaviest.value) : "–"}
              unit={history.heaviest ? "kg" : undefined}
              detail={history.heaviest ? formatDay(history.heaviest.workout_date) : "Tylko serie bez ciężaru"}
            />
            <StatTile label="Treningi z nim" value={formatNumber(history.workouts)} />
          </div>

          <div className="grid gap-3">
            <h3 className="m-0 text-title-s font-bold">Ostatnie treningi</h3>
            <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {history.recent.map((workout) => (
                <li key={workout.id}>
                  <RecentWorkout workout={workout} />
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </section>
  );
}

function RecentWorkout({ workout }: { workout: HistoryWorkout }) {
  return (
    <Link
      href={`/treningi/${workout.id}`}
      transitionTypes={["nav-forward"]}
      className="card card-link pjs-i grid h-full content-start gap-3 rounded-[20px] p-4 text-fg no-underline hover:no-underline md:p-5"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-bold first-letter:uppercase">{formatLongDay(workout.workout_date)}</span>
        {workout.best_e1rm !== null && (
          <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-caption font-bold text-[var(--text-on-accent-soft)] tabular-nums">
            e1RM {formatNumber(workout.best_e1rm)} kg
          </span>
        )}
      </span>
      <span className="grid gap-1 text-body-s tabular-nums">
        {workout.sets.map((set, index) => (
          <span key={index} className={set.e1rm !== null && set.e1rm === workout.best_e1rm ? "font-bold" : "text-fg-2"}>
            {formatSet(set.weight_kg, set.reps)}
            {set.rpe !== null && ` · RPE ${formatNumber(set.rpe)}`}
          </span>
        ))}
      </span>
    </Link>
  );
}

export function ExercisePlaceholder() {
  return (
    <ViewTransition exit="placeholder" default="none">
      <div aria-hidden="true" className="grid gap-8">
        <div className="grid gap-2">
          <span className="placeholder-block h-4 w-28" />
          <span className="placeholder-block h-20" />
        </div>
        <span className="placeholder-block h-16" />
        <span className="placeholder-block h-[60px] rounded-full" />
        <span className="placeholder-block h-56 rounded-[28px]" />
      </div>
    </ViewTransition>
  );
}
