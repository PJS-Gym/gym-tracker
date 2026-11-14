"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Icon } from "@/design-system";
import { formatLongDay, formatMonth, formatRelativeDay, formatWeekdayShort, plural, setsLabel, workoutsLabel } from "@/lib/format";
import type { WorkoutListItem, WorkoutPage } from "@/lib/workouts";
import { loadWorkouts } from "./actions";

/** "Wyciskanie sztangi, Przysiad i 2 więcej": the first exercises of a workout. */
function exerciseSummary(names: string[]): string {
  const shown = [...new Set(names)];
  if (shown.length <= 3) return shown.join(", ");
  return `${shown.slice(0, 2).join(", ")} i ${shown.length - 2} więcej`;
}

/**
 * Treningi (#12): every workout, newest first. The next 20 load as the end of the list comes into
 * view, and workouts are grouped under their month.
 */
export function WorkoutHistory({ first, today }: { first: WorkoutPage; today: string }) {
  const [items, setItems] = useState(first.items);
  const [next, setNext] = useState(first.next);
  const [failed, setFailed] = useState(false);
  const [loading, startLoading] = useTransition();
  const sentinel = useRef<HTMLDivElement>(null);

  function loadMore() {
    if (!next || loading) return;
    startLoading(async () => {
      try {
        const page = await loadWorkouts(next);
        setItems((current) => [...current, ...page.items.filter((item) => !current.some((c) => c.id === item.id))]);
        setNext(page.next);
        setFailed(false);
      } catch {
        setFailed(true);
      }
    });
  }

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !next || failed) return;
    // Starts a screen early, so scrolling rarely meets the end.
    const observer = new IntersectionObserver((entries) => entries[0]?.isIntersecting && loadMore(), { rootMargin: "800px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  });

  const months: { key: string; items: WorkoutListItem[] }[] = [];
  for (const item of items) {
    const key = item.workout_date.slice(0, 7);
    if (months.at(-1)?.key !== key) months.push({ key, items: [] });
    months.at(-1)!.items.push(item);
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-12">
      {months.map((month, monthIndex) => (
        <section key={month.key} aria-labelledby={`month-${month.key}`} className="grid gap-5">
          <div className="flex items-baseline gap-3">
            <h2 id={`month-${month.key}`} className="m-0 text-title-m font-extrabold first-letter:uppercase">
              {formatMonth(`${month.key}-01`)}
            </h2>
            <span className="text-body-s text-fg-2 tabular-nums">{workoutsLabel(month.items.length)}</span>
            <span aria-hidden="true" className="h-px flex-1 self-center bg-[var(--card-edge)]" />
          </div>
          <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 md:gap-4 xl:grid-cols-3">
            {month.items.map((item, index) => {
              const featured = monthIndex === 0 && index === 0;
              return (
                <li key={item.id} className={featured ? "sm:col-span-full" : undefined}>
                  {featured ? <FeaturedCard item={item} today={today} /> : <WorkoutCard item={item} today={today} />}
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <div ref={sentinel} aria-live="polite" className="grid justify-items-center">
        {next && !failed && (
          <span className="flex items-center gap-2 text-body-s text-fg-2">
            <span className="placeholder-block size-4 rounded-full" aria-hidden="true" />
            Wczytuję starsze treningi…
          </span>
        )}
        {failed && (
          <button type="button" onClick={loadMore} className="pjs-i h-11 rounded-full px-4 font-bold text-fg-accent">
            Nie udało się wczytać. Spróbuj jeszcze raz
          </button>
        )}
        {!next && items.length > 20 && <p className="m-0 text-body-s text-fg-2">To już wszystkie treningi.</p>}
      </div>
    </div>
  );
}

/** "11" over "śr": the day of a workout, so a month reads like a calendar. */
function DateTile({ iso, emphasis = false }: { iso: string; emphasis?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-14 shrink-0 place-content-center rounded-[16px] text-center leading-none ${
        emphasis ? "bg-accent-fill text-on-accent" : "bg-surface-raised text-fg"
      }`}
    >
      <span className="text-[22px] font-extrabold tabular-nums">{Number(iso.slice(8, 10))}</span>
      <span className={`mt-1 text-caption font-semibold ${emphasis ? "" : "text-fg-2"}`}>{formatWeekdayShort(iso)}</span>
    </span>
  );
}

function GroupChips({ groups, max }: { groups: string[]; max: number }) {
  if (groups.length === 0) return null;
  const shown = groups.slice(0, max);
  return (
    <span className="flex flex-wrap gap-1.5">
      {shown.map((group) => (
        <span key={group} className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-caption font-semibold text-[var(--text-on-accent-soft)] first-letter:uppercase">
          {group}
        </span>
      ))}
      {groups.length > max && (
        <span className="rounded-full bg-surface-raised px-2.5 py-1 text-caption font-semibold text-fg-2">+{groups.length - max}</span>
      )}
    </span>
  );
}

function WorkoutCard({ item, today }: { item: WorkoutListItem; today: string }) {
  const relative = formatRelativeDay(item.workout_date, today);
  return (
    <Link
      href={`/treningi/${item.id}`}
      transitionTypes={["nav-forward"]}
      // Off-screen cards skip layout and paint. The containment sits on the card itself: on the list
      // item it would clip the card's shadow at the item's edge, showing a pale square at the corners.
      className="card card-link pjs-i group grid h-full content-start gap-4 p-4 text-fg no-underline [contain-intrinsic-size:auto_180px] [content-visibility:auto] hover:no-underline md:p-5"
    >
      <span className="flex items-center gap-3.5">
        <DateTile iso={item.workout_date} />
        <span className="grid min-w-0 flex-1 gap-0.5">
          <span className="truncate font-bold first-letter:uppercase">{relative}</span>
          <span className="text-body-s text-fg-2 tabular-nums">{setsLabel(item.sets)}</span>
        </span>
        <Icon name="chevron-right" size={18} className="shrink-0 text-fg-3 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
      <span className="line-clamp-2 text-body-s text-fg">{exerciseSummary(item.exercises)}</span>
      <GroupChips groups={item.primary_groups} max={3} />
    </Link>
  );
}

/** The newest workout: the one focal object of the screen, on the plum surface. */
function FeaturedCard({ item, today }: { item: WorkoutListItem; today: string }) {
  const relative = formatRelativeDay(item.workout_date, today);
  return (
    <Link
      href={`/treningi/${item.id}`}
      transitionTypes={["nav-forward"]}
      data-theme="dark"
      style={{ background: "var(--hero)" }}
      className="grain card-link pjs-i group relative isolate grid gap-5 overflow-hidden rounded-[28px] p-5 text-fg no-underline shadow-[var(--card-shadow)] hover:no-underline md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-8 md:p-7"
    >
      <span className="flex items-center gap-4">
        <DateTile iso={item.workout_date} emphasis />
        <span className="grid gap-0.5 md:hidden">
          <span className="text-title-m font-extrabold first-letter:uppercase">{relative}</span>
          <span className="text-body-s text-fg-2 tabular-nums">{setsLabel(item.sets)}</span>
        </span>
      </span>
      <span className="grid min-w-0 gap-3">
        <span className="hidden items-baseline gap-3 md:flex">
          <span className="text-title-l font-extrabold first-letter:uppercase">{relative}</span>
          <span className="text-body-s text-fg-2 first-letter:uppercase">{formatLongDay(item.workout_date)}</span>
        </span>
        <span className="line-clamp-2 text-body">{exerciseSummary(item.exercises)}</span>
        <GroupChips groups={item.primary_groups} max={5} />
      </span>
      <span className="hidden items-center gap-3 md:flex">
        <span className="grid justify-items-end">
          <span className="text-[36px] leading-none font-extrabold tabular-nums">{item.sets}</span>
          <span className="text-caption text-fg-2">{plural(item.sets, "seria", "serie", "serii")}</span>
        </span>
        <span className="flex size-11 items-center justify-center rounded-full bg-white/10 transition-transform duration-200 group-hover:translate-x-0.5">
          <Icon name="chevron-right" size={20} />
        </span>
      </span>
    </Link>
  );
}

export function WorkoutHistoryPlaceholder() {
  return (
    <div aria-hidden="true" className="grid gap-4">
      <span className="placeholder-block h-7 w-48" />
      <span className="placeholder-block h-40 rounded-[28px]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="placeholder-block h-44 rounded-[24px]" />
        ))}
      </div>
    </div>
  );
}
