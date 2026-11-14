import Link from "next/link";
import { connection } from "next/server";
import { ViewTransition } from "react";
import { Icon } from "@/design-system";
import { nameToAddress } from "@/features/profile/validation";
import {
  exercisesLabel,
  formatLongDay,
  formatNumber,
  formatRange,
  formatRelativeDay,
  formatWeekdayShort,
  setsLabel,
  todayInWarsaw,
  workoutsLabel,
} from "@/lib/format";
import { getProfile } from "@/lib/profile";
import { getHome, type Home, type LastWorkout } from "@/lib/training";

// The primary action as a link: same look as the design system's large primary button.
const PRIMARY_LINK =
  "pjs-i pjs-press inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent-fill px-7 font-bold text-on-accent no-underline shadow-[0_12px_28px_-10px_rgba(255,79,160,.85)] hover:no-underline";

const SHORTCUTS = [
  { href: "/podsumowanie", icon: "chart-no-axes-column", label: "Podsumowanie", hint: "Które partie pracowały najwięcej" },
  { href: "/cwiczenia", icon: "clipboard-list", label: "Ćwiczenia", hint: "Historia i postęp każdego ruchu" },
  { href: "/cialo", icon: "user", label: "Ciało", hint: "Masa i obwody z pomiarów" },
];

/** Everything on Start that depends on the member's data. Reads the session: render inside <Suspense>. */
export async function StartContent() {
  const [home, profile] = await Promise.all([getHome(), getProfile()]);
  // Today is per request, never part of a prerendered page.
  await connection();
  const today = todayInWarsaw();
  const name = nameToAddress(profile.display_name ?? "");

  return (
    <ViewTransition enter="reveal" default="none">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 pt-6 md:gap-8 md:pt-10">
        <Hero name={name} today={today} home={home} />

        {/* #20 adds the weekly report banner here, above everything else. */}

        <div className="grid gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-8">
          {home.last_workout ? (
            <LastWorkoutCard workout={home.last_workout} today={today} />
          ) : (
            <section className="card grid content-start gap-2 p-6 md:p-8">
              <h2 className="m-0 text-title-m font-bold">Czas na pierwszy trening</h2>
              <p className="m-0 max-w-[40ch] text-fg-2">
                Zapisz pierwsze serie, a tutaj zobaczysz ostatni trening i to, jak idzie ci tydzień.
              </p>
            </section>
          )}
          <WeekNumbers week={home.week} />
        </div>

        <section aria-labelledby="start-shortcuts" className="grid gap-4">
          <h2 id="start-shortcuts" className="m-0 text-title-s font-bold">
            Na skróty
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-3 md:gap-4">
            {SHORTCUTS.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="card card-link pjs-i group flex h-full items-center gap-4 p-4 text-fg no-underline hover:no-underline sm:grid sm:content-between sm:gap-8 sm:p-5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--text-on-accent-soft)]">
                    <Icon name={s.icon} size={22} />
                  </span>
                  <span className="grid min-w-0 flex-1 gap-0.5">
                    <span className="flex items-center justify-between gap-2 font-bold">
                      {s.label}
                      <Icon
                        name="chevron-right"
                        size={18}
                        className="shrink-0 text-fg-3 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                    <span className="text-body-s text-fg-2">{s.hint}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ViewTransition>
  );
}

/** The one focal object: greeting, this week at a glance, and the way into the logger. */
function Hero({ name, today, home }: { name: string; today: string; home: Home }) {
  const { week } = home;
  return (
    <section
      data-theme="dark"
      aria-labelledby="start-hello"
      className="grain relative isolate overflow-hidden rounded-[32px] p-6 text-fg sm:p-8 md:rounded-[36px] md:p-10"
      style={{ background: "var(--hero)" }}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <p className="m-0 text-body-s font-semibold text-fg-2 first-letter:uppercase">{formatLongDay(today)}</p>
            <h1 id="start-hello" className="pjs-display m-0 text-display-l md:text-[56px] md:leading-[0.9]">
              {name ? `Cześć, ${name}` : "Cześć"}
            </h1>
            <p className="m-0 max-w-[38ch] text-body text-fg-2">
              {week.workouts > 0
                ? `W tym tygodniu masz już ${workoutsLabel(week.workouts)}. Dorzucimy kolejny?`
                : "W tym tygodniu jeszcze nie było treningu. Dobry moment, żeby zacząć."}
            </p>
          </div>
          <div>
            <Link href="/treningi/nowy" transitionTypes={["nav-forward"]} className={PRIMARY_LINK}>
              <Icon name="plus" size={20} />
              Nowy trening
            </Link>
          </div>
        </div>

        <div className="grid gap-3 rounded-[24px] border border-line bg-white/[0.04] p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="m-0 text-body-s font-bold">Ten tydzień</h2>
            <span className="text-caption text-fg-2 tabular-nums">{formatRange(week.start, week.end)}</span>
          </div>
          <ol aria-label="Dni tygodnia" className="m-0 grid list-none grid-cols-7 gap-1.5 p-0 sm:gap-2">
            {week.days.map((day, index) => {
              const isToday = day.date === today;
              return (
                <li key={day.date} className="grid justify-items-center gap-2">
                  <span className={`text-caption ${isToday ? "font-bold text-fg" : "text-fg-2"}`}>
                    {formatWeekdayShort(day.date)}
                  </span>
                  <span
                    aria-label={`${formatLongDay(day.date)}: ${day.trained ? "trening" : "bez treningu"}`}
                    style={{
                      animationDelay: `${index * 45}ms`,
                      borderColor: day.trained ? "var(--accent)" : isToday ? "var(--border-control)" : "var(--border-strong)",
                    }}
                    className={`flex size-9 items-center justify-center rounded-full border-2 border-solid sm:size-10 ${
                      day.trained ? "pop-in bg-accent-fill text-on-accent shadow-[0_0_18px_-2px_rgba(255,79,160,.6)]" : ""
                    }`}
                  >
                    {day.trained && <Icon name="check" size={18} strokeWidth={2.75} />}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function LastWorkoutCard({ workout, today }: { workout: LastWorkout; today: string }) {
  return (
    <section aria-labelledby="start-last" className="grid grid-rows-[auto_1fr] gap-4">
      <h2 id="start-last" className="m-0 text-title-s font-bold">
        Ostatni trening
      </h2>
      <Link
        href={`/treningi/${workout.id}`}
        transitionTypes={["nav-forward"]}
        className="card card-link pjs-i group grid flex-1 gap-6 p-6 text-fg no-underline hover:no-underline md:p-7"
      >
        <span className="flex items-start justify-between gap-4">
          <span className="grid gap-1">
            <span className="text-title-l font-extrabold first-letter:uppercase">
              {formatRelativeDay(workout.workout_date, today)}
            </span>
            <span className="text-body-s text-fg-2 first-letter:uppercase">{formatLongDay(workout.workout_date)}</span>
          </span>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-raised text-fg transition-transform duration-200 group-hover:translate-x-0.5">
            <Icon name="chevron-right" size={20} />
          </span>
        </span>
        <span className="flex flex-wrap gap-2">
          <Pill icon="dumbbell">{exercisesLabel(workout.exercises)}</Pill>
          <Pill icon="list-plus">{setsLabel(workout.sets)}</Pill>
        </span>
      </Link>
    </section>
  );
}

function Pill({ icon, children }: { icon: string; children: string }) {
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-full bg-surface-raised px-3.5 text-body-s font-semibold tabular-nums">
      <Icon name={icon} size={16} className="text-fg-2" />
      {children}
    </span>
  );
}

function WeekNumbers({ week }: { week: Home["week"] }) {
  return (
    <section aria-labelledby="start-week" className="grid grid-rows-[auto_1fr] gap-4">
      <h2 id="start-week" className="m-0 text-title-s font-bold">
        W liczbach
      </h2>
      <div className="grid flex-1 grid-cols-2 gap-3 md:gap-4">
        <Metric label="Treningi" value={formatNumber(week.workouts)} detail="w tym tygodniu" />
        <Metric label="Serie efektywne" value={formatNumber(week.effective_sets)} detail="w tym tygodniu" accent />
      </div>
    </section>
  );
}

function Metric({ label, value, detail, accent = false }: { label: string; value: string; detail: string; accent?: boolean }) {
  return (
    <div className="card relative grid content-between gap-6 overflow-hidden p-5 md:p-6">
      {accent && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-[var(--accent)] opacity-20 blur-2xl"
        />
      )}
      <span className="text-body-s font-semibold text-fg-2">{label}</span>
      <span className="grid gap-1">
        <span className="text-[44px] leading-none font-extrabold tabular-nums">{value}</span>
        <span className="text-caption text-fg-2">{detail}</span>
      </span>
    </div>
  );
}

/** Start while the data loads: the same shapes, quietly breathing. */
export function StartPlaceholder() {
  return (
    <ViewTransition exit="placeholder" default="none">
      <div aria-hidden="true" className="grid gap-6 pt-6 md:gap-8 md:pt-10">
        <span className="placeholder-block h-[300px] rounded-[32px]" />
        <div className="grid gap-6 md:grid-cols-[7fr_5fr] md:gap-8">
          <span className="placeholder-block h-44 rounded-[24px]" />
          <span className="placeholder-block h-44 rounded-[24px]" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <span className="placeholder-block h-24 rounded-[24px]" />
          <span className="placeholder-block h-24 rounded-[24px]" />
          <span className="placeholder-block h-24 rounded-[24px]" />
        </div>
      </div>
    </ViewTransition>
  );
}
