"use client";

import { type KeyboardEvent, type PointerEvent, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconButton } from "@/design-system";

const ROW = 44;
const VISIBLE_ROWS = 3;
const SPACER = ROW * Math.floor(VISIBLE_ROWS / 2);
const COLUMNS = "grid-cols-[1fr_1.7fr_1.2fr]";

const MONTHS = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

// A press that moves less than this is a tap on a row, not a drag.
const DRAG_THRESHOLD = 4;
// How far ahead (ms) a released drag carries on at its last speed.
const FLING_MS = 140;
// Fastest counted speed (px/ms), so a flick carries a few rows and never the whole list.
const MAX_FLING_SPEED = 2;

type Option = { value: number; label: string };

type WheelProps = {
  id?: string;
  label: string;
  options: Option[];
  value: number | null;
  onSelect: (value: number | null) => void;
};

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

/** One scrolling column. Keyboard: arrows, Page Up/Down, Home/End, or type the number. */
function Wheel({ id, label, options, value, onSelect }: WheelProps) {
  const rows: { value: number | null; label: string }[] = [{ value: null, label: "–" }, ...options];
  const index = Math.max(0, rows.findIndex((row) => row.value === value));
  const [centered, setCentered] = useState(index);
  const ref = useRef<HTMLDivElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  const typed = useRef("");
  const typedReset = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Set while the wheel glides to a value chosen by tap or key, so rows it passes are not picked.
  const glidingTo = useRef<number | null>(null);
  const drag = useRef({ active: false, moved: false, startY: 0, startTop: 0, lastY: 0, lastTime: 0, speed: 0 });

  useLayoutEffect(() => {
    if (ref.current) ref.current.scrollTop = index * ROW;
    // Only the starting position: after that the effect below animates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (element && Math.round(element.scrollTop / ROW) !== index) {
      glidingTo.current = index;
      element.scrollTo({ top: index * ROW, behavior: scrollBehavior() });
    }
  }, [index]);

  useEffect(
    () => () => {
      clearTimeout(settle.current);
      clearTimeout(typedReset.current);
    },
    [],
  );

  function handleScroll() {
    const element = ref.current;
    if (!element) return;
    const next = Math.min(rows.length - 1, Math.max(0, Math.round(element.scrollTop / ROW)));
    setCentered(next);
    clearTimeout(settle.current);
    // The value changes when the wheel comes to rest, not for every row it passes.
    settle.current = setTimeout(() => {
      if (drag.current.active) return;
      if (glidingTo.current !== null) {
        if (glidingTo.current === next) glidingTo.current = null;
        return;
      }
      if (rows[next].value !== value) onSelect(rows[next].value);
    }, 120);
  }

  function selectRow(next: number) {
    const clamped = Math.min(rows.length - 1, Math.max(0, next));
    onSelect(rows[clamped].value);
  }

  // Touch scrolls natively; a mouse has to be told to grab the wheel.
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    glidingTo.current = null;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = {
      active: true,
      moved: false,
      startY: event.clientY,
      startTop: event.currentTarget.scrollTop,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      speed: 0,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state.active) return;
    const element = event.currentTarget;
    const distance = event.clientY - state.startY;
    if (!state.moved) {
      if (Math.abs(distance) < DRAG_THRESHOLD) return;
      state.moved = true;
      element.setPointerCapture(event.pointerId);
      // Snapping would fight the hand; it comes back on release.
      element.style.scrollSnapType = "none";
      element.dataset.dragging = "true";
    }
    element.scrollTop = state.startTop - distance;
    const elapsed = event.timeStamp - state.lastTime;
    if (elapsed > 0) {
      const speed = Math.min(MAX_FLING_SPEED, Math.max(-MAX_FLING_SPEED, (state.lastY - event.clientY) / elapsed));
      state.speed = state.speed * 0.3 + speed * 0.7;
    }
    state.lastY = event.clientY;
    state.lastTime = event.timeStamp;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state.active) return;
    state.active = false;
    if (!state.moved) return;
    const element = event.currentTarget;
    element.style.scrollSnapType = "";
    delete element.dataset.dragging;
    // A hand held still before letting go should not fling.
    const speed = event.timeStamp - state.lastTime > 80 ? 0 : state.speed;
    const landing = Math.round((element.scrollTop + speed * FLING_MS) / ROW);
    const target = Math.min(rows.length - 1, Math.max(0, landing));
    glidingTo.current = target;
    element.scrollTo({ top: target * ROW, behavior: scrollBehavior() });
    if (rows[target].value !== value) onSelect(rows[target].value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      PageDown: index + 5,
      PageUp: index - 5,
      Home: 1,
      End: rows.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      selectRow(moves[event.key]);
    } else if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.closest("form")?.requestSubmit();
    } else if (/^\d$/.test(event.key)) {
      // Typing "1996" walks to it, one digit at a time.
      const text = typed.current + event.key;
      typed.current = text;
      clearTimeout(typedReset.current);
      typedReset.current = setTimeout(() => (typed.current = ""), 900);
      const match = rows.findIndex((row) => row.value !== null && String(row.value).startsWith(text));
      if (match > 0) selectRow(match);
    }
  }

  return (
    <div
      ref={ref}
      id={id}
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={Math.min(...options.map((option) => option.value))}
      aria-valuemax={Math.max(...options.map((option) => option.value))}
      aria-valuenow={value ?? undefined}
      aria-valuetext={value === null ? "Nie wybrano" : rows[index].label}
      onScroll={handleScroll}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={() => (glidingTo.current = null)}
      onKeyDown={handleKeyDown}
      style={{ height: ROW * VISIBLE_ROWS, paddingBlock: SPACER }}
      className="relative cursor-grab snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-[14px] outline-none select-none data-[dragging=true]:cursor-grabbing [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] [&::-webkit-scrollbar]:hidden"
    >
      {rows.map((row, position) => (
        <button
          key={row.label}
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => {
            if (!drag.current.moved) selectRow(position);
          }}
          style={{ height: ROW, transition: "color var(--dur-fast) var(--ease-standard)" }}
          className={`flex w-full cursor-[inherit] snap-center items-center justify-center border-0 bg-transparent p-0 text-title-s tabular-nums ${
            position === centered ? "font-extrabold text-fg" : "font-semibold text-fg-3"
          }`}
        >
          {row.label}
        </button>
      ))}
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

type Parts = { year: number | null; month: number | null; day: number | null };

function parse(iso: string): Parts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return match ? { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) } : { year: null, month: null, day: null };
}

// 29 stays available until a non-leap year is chosen.
const daysIn = (month: number | null, year: number | null) =>
  month === null ? 31 : new Date(Date.UTC(year ?? 2000, month, 0)).getUTCDate();

type Props = {
  /** The first wheel's id, so a form can move focus here. */
  id: string;
  value: string;
  /** Range for the year wheel, as YYYY-MM-DD. */
  min: string;
  max: string;
  /** A full YYYY-MM-DD, or "" until all three wheels have been set. */
  onValueChange: (value: string) => void;
  /** Shown between the wheels and the calendar button, e.g. the resulting age. */
  children?: ReactNode;
};

/**
 * Day, month and year on three wheels. Nothing counts as chosen until each one has been set.
 * The calendar button is another way to set them: a picked date glides the wheels into place.
 */
export function BirthDateWheels({ id, value, min, max, onValueChange, children }: Props) {
  const [parts, setParts] = useState<Parts>(() => parse(value));
  const calendar = useRef<HTMLInputElement>(null);

  function openCalendar() {
    try {
      calendar.current?.showPicker();
    } catch {
      // A browser without showPicker keeps the wheels, which do the same job.
    }
  }

  function pickFromCalendar(date: string) {
    setParts(parse(date));
    onValueChange(date);
  }

  function update(change: Partial<Parts>) {
    const next: Parts = { ...parts, ...change };
    // 31 March becomes 30 when the month changes to April.
    if (next.day !== null) next.day = Math.min(next.day, daysIn(next.month, next.year));
    setParts(next);
    const { year, month, day } = next;
    onValueChange(year !== null && month !== null && day !== null ? `${year}-${pad(month)}-${pad(day)}` : "");
  }

  const lastYear = Number(max.slice(0, 4));
  const firstYear = Number(min.slice(0, 4));
  const days = Array.from({ length: daysIn(parts.month, parts.year) }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
  const months = MONTHS.map((label, i) => ({ value: i + 1, label }));
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => ({
    value: lastYear - i,
    label: String(lastYear - i),
  }));

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        {/* Still headers: each wheel also carries its name for screen readers. */}
        <div aria-hidden="true" className={`grid ${COLUMNS} text-center text-label font-semibold text-fg-2`}>
          <span>Dzień</span>
          <span>Miesiąc</span>
          <span>Rok</span>
        </div>
        <div className={`relative grid ${COLUMNS}`}>
          {/* The row in the middle is the chosen one. */}
          <div
            aria-hidden="true"
            style={{ top: SPACER, height: ROW, background: "var(--accent-soft)" }}
            className="pointer-events-none absolute inset-x-0 rounded-[14px]"
          />
          <Wheel id={id} label="Dzień" options={days} value={parts.day} onSelect={(day) => update({ day })} />
          <Wheel label="Miesiąc" options={months} value={parts.month} onSelect={(month) => update({ month })} />
          <Wheel label="Rok" options={years} value={parts.year} onSelect={(year) => update({ year })} />
        </div>
      </div>
      {children}
      <div className="relative mx-auto">
        {/* Never seen or reached directly: it only supplies the browser's calendar, opening next to the button. */}
        <input
          ref={calendar}
          type="date"
          tabIndex={-1}
          aria-hidden="true"
          min={min}
          max={max}
          value={value}
          onChange={(event) => pickFromCalendar(event.target.value)}
          className="pointer-events-none absolute inset-0 size-full opacity-0"
        />
        <IconButton icon="calendar-days" variant="tonal" label="Wybierz z kalendarza" title="Wybierz z kalendarza" onClick={openCalendar} />
      </div>
    </div>
  );
}
