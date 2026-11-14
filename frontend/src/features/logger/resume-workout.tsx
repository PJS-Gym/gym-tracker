"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Icon } from "@/design-system";
import { exercisesLabel, setsLabel } from "@/lib/format";
import { DRAFT_EVENT, hasContent, NEW_DRAFT_KEY, readDraft, summarize } from "./draft";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(DRAFT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(DRAFT_EVENT, onChange);
  };
}

const readRaw = () => {
  try {
    return window.localStorage.getItem(NEW_DRAFT_KEY);
  } catch {
    return null;
  }
};

/**
 * An unfinished workout follows the member around the app: a bar above the tab bar brings the
 * logger back, like the design system's ResumeBar. Hidden in the logger itself.
 */
export function ResumeWorkout() {
  const router = useRouter();
  const pathname = usePathname();
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const draft = raw ? readDraft(NEW_DRAFT_KEY) : null;
  if (!hasContent(draft) || pathname === "/treningi/nowy" || /^\/treningi\/\d+\/edytuj$/.test(pathname)) return null;
  const summary = summarize(draft!);

  return (
    <div className="px-3 pt-2 pb-2 md:px-6 md:pb-4">
      <button
        type="button"
        onClick={() => router.push("/treningi/nowy", { transitionTypes: ["nav-forward"] })}
        className="pjs-i row-in mx-auto flex min-h-14 w-full max-w-2xl items-center gap-3 rounded-[14px] border-0 bg-[var(--surface-inverse)] px-4 py-2 text-left font-[inherit] text-[var(--text-inverse)] shadow-[var(--shadow-float)]"
      >
        <span className="grid min-w-0 flex-1 gap-0.5">
          <span className="truncate font-bold">Niedokończony trening</span>
          <span className="truncate text-body-s tabular-nums">
            {exercisesLabel(draft!.exercises.length)} · {setsLabel(summary.sets)}
          </span>
        </span>
        <span className="flex items-center gap-1 text-body-s font-bold">
          Wróć do niego
          <Icon name="chevron-up" size={20} />
        </span>
      </button>
    </div>
  );
}
