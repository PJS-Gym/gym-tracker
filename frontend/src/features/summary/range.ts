// The range in Podsumowanie's address: ?zakres=poprzedni-tydzien, or ?zakres=wlasny&od=…&do=…
// Kept in the URL so a reload, the back button or a shared link shows the same range.

import type { RangeKind } from "@/lib/training";

export const RANGES: { slug: string; kind: RangeKind; label: string }[] = [
  { slug: "ten-tydzien", kind: "this_week", label: "Ten tydzień" },
  { slug: "poprzedni-tydzien", kind: "last_week", label: "Poprzedni tydzień" },
  { slug: "4-tygodnie", kind: "last_4_weeks", label: "Ostatnie 4 tygodnie" },
  { slug: "wlasny", kind: "custom", label: "Własne daty" },
];

export type ParsedRange =
  | { kind: Exclude<RangeKind, "custom">; slug: string }
  | { kind: "custom"; slug: "wlasny"; from: string; to: string }
  /** "Własne daty" chosen, but the dates are missing or the end is before the start. */
  | { kind: "custom-incomplete"; slug: "wlasny"; from?: string; to?: string };

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const day = (value: string | string[] | undefined) => {
  const text = one(value);
  return text && ISO_DAY.test(text) && !Number.isNaN(Date.parse(text)) ? text : undefined;
};

export function parseRange(params: Record<string, string | string[] | undefined>): ParsedRange {
  const range = RANGES.find((r) => r.slug === one(params.zakres)) ?? RANGES[0];
  if (range.kind !== "custom") return { kind: range.kind, slug: range.slug };
  const from = day(params.od);
  const to = day(params.do);
  if (from && to && to >= from) return { kind: "custom", slug: "wlasny", from, to };
  return { kind: "custom-incomplete", slug: "wlasny", from, to };
}

/** The address for a range. */
export function rangeHref(slug: string, from?: string, to?: string): string {
  const query = new URLSearchParams({ zakres: slug });
  if (slug === "wlasny" && from) query.set("od", from);
  if (slug === "wlasny" && to) query.set("do", to);
  return `/podsumowanie?${query}`;
}
