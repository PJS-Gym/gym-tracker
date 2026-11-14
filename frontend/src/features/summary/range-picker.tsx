"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { Chip, TextField } from "@/design-system";
import { todayInWarsaw } from "@/lib/format";
import { parseRange, RANGES, rangeHref } from "./range";

/**
 * Ranges as chips, scrolling sideways on a narrow phone, and two date fields for "Własne daty".
 * The choice lives in the address, so the screen re-renders on the server with the new range
 * while the old numbers stay visible.
 */
export function RangePicker() {
  const router = useRouter();
  const params = useSearchParams();
  const current = parseRange(Object.fromEntries(params));
  const [pending, startTransition] = useTransition();
  // The chip lights up at once, before the new numbers arrive.
  const [selected, setSelected] = useOptimistic(current.slug);
  const today = todayInWarsaw();

  const [from, setFrom] = useState(current.kind === "custom" || current.kind === "custom-incomplete" ? current.from ?? "" : "");
  const [to, setTo] = useState(current.kind === "custom" || current.kind === "custom-incomplete" ? current.to ?? "" : "");
  const endBeforeStart = Boolean(from && to && to < from);

  function go(slug: string, nextFrom?: string, nextTo?: string) {
    startTransition(() => {
      setSelected(slug);
      router.replace(rangeHref(slug, nextFrom, nextTo), { scroll: false });
    });
  }

  function changeDates(nextFrom: string, nextTo: string) {
    setFrom(nextFrom);
    setTo(nextTo);
    if (nextFrom && nextTo && nextTo >= nextFrom) go("wlasny", nextFrom, nextTo);
  }

  return (
    <div className="grid gap-4" aria-busy={pending || undefined}>
      <div role="group" aria-label="Zakres" className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 [scrollbar-width:none]">
        {RANGES.map((range) => (
          <Chip key={range.slug} selected={selected === range.slug} onClick={() => go(range.slug, from, to)}>
            {range.label}
          </Chip>
        ))}
      </div>

      {selected === "wlasny" && (
        <div className="step-in grid grid-cols-2 items-start gap-3">
          <TextField
            id="range-from"
            label="Od"
            type="date"
            max={to || today}
            value={from}
            onValueChange={(value) => changeDates(value, to)}
          />
          <TextField
            id="range-to"
            label="Do"
            type="date"
            min={from || undefined}
            max={today}
            value={to}
            onValueChange={(value) => changeDates(from, value)}
            error={endBeforeStart ? "Koniec nie może być przed początkiem." : undefined}
          />
        </div>
      )}
    </div>
  );
}
