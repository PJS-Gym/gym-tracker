import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, Icon } from "@/design-system";
import type { Exercise } from "@/lib/exercises";

/** "klatka piersiowa · sztanga": the primary groups and the equipment, for a row's second line. */
export function exerciseMeta(exercise: Exercise, groupNames: Map<string, string>): string {
  const groups = exercise.primary.map((key) => groupNames.get(key) ?? key).join(", ");
  return [groups, exercise.equipment_pl].filter(Boolean).join(" · ");
}

// Rows off screen skip layout and paint, so a list of several hundred scrolls smoothly on a phone.
const ROW = "pjs-i flex min-h-[72px] w-full items-center gap-3 border-b border-line py-3 text-left [contain-intrinsic-size:auto_72px] [content-visibility:auto]";

function Body({ exercise, groupNames, trailing }: { exercise: Exercise; groupNames: Map<string, string>; trailing: ReactNode }) {
  return (
    <>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="flex items-center gap-2">
          <span className="line-clamp-2 min-w-0 font-semibold text-fg">{exercise.name}</span>
          {exercise.own && <Badge tone="soft">Moje</Badge>}
        </span>
        <span className="truncate text-body-s text-fg-2 first-letter:uppercase">{exerciseMeta(exercise, groupNames)}</span>
      </span>
      {trailing}
    </>
  );
}

/** Two letters of the name on a tint picked by the main muscle group, so a scan finds groups by colour and shape. */
function Monogram({ exercise }: { exercise: Exercise }) {
  const words = exercise.name.replace(/[()]/g, "").split(/\s+/).filter(Boolean);
  // "Brzuszki na piłce" → "BP": short joining words ("na", "ze", "z") say nothing.
  const second = words.slice(1).find((word) => word.length > 2);
  const letters = (words[0]?.[0] ?? "") + (second?.[0] ?? "");
  const key = exercise.primary[0] ?? exercise.name;
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const strength = [12, 18, 24, 30][hash % 4];
  return (
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-[14px] text-body-s font-extrabold text-[var(--text-on-accent-soft)] uppercase"
      style={{ background: `color-mix(in oklab, var(--accent) ${strength}%, var(--surface-card))` }}
    >
      {letters}
    </span>
  );
}

/** An exercise in the list: a card that opens its page. */
export function ExerciseLinkRow({ exercise, groupNames }: { exercise: Exercise; groupNames: Map<string, string> }) {
  return (
    <Link
      href={`/cwiczenia/${exercise.id}`}
      transitionTypes={["nav-forward"]}
      className="card card-link pjs-i group flex h-full min-h-[76px] items-center gap-3.5 rounded-[20px] p-3 pr-4 text-left no-underline [contain-intrinsic-size:auto_76px] [content-visibility:auto] hover:no-underline"
    >
      <Monogram exercise={exercise} />
      <Body
        exercise={exercise}
        groupNames={groupNames}
        trailing={
          <Icon name="chevron-right" size={18} className="shrink-0 text-fg-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        }
      />
    </Link>
  );
}

/** An exercise in the picker: toggles, with a round check like the design system's picker. */
export function ExercisePickRow({
  exercise,
  groupNames,
  selected,
  onToggle,
}: {
  exercise: Exercise;
  groupNames: Map<string, string>;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" aria-pressed={selected} onClick={onToggle} className={`${ROW} border-x-0 border-t-0 bg-transparent font-[inherit]`}>
      <Body
        exercise={exercise}
        groupNames={groupNames}
        trailing={
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-solid text-on-accent transition-colors duration-200"
            style={{
              background: selected ? "var(--accent)" : "transparent",
              borderColor: selected ? "var(--accent)" : "var(--border-control)",
            }}
          >
            {selected && <Icon name="check" size={16} strokeWidth={3} />}
          </span>
        }
      />
    </button>
  );
}
