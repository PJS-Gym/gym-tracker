"use client";

import { type ReactNode, useSyncExternalStore, ViewTransition } from "react";
import { Wordmark } from "@/design-system";
import { MediaBackdrop } from "@/features/onboarding/media-backdrop";

const noopSubscribe = () => () => {};

/** Training video and the name above the form on a phone, beside it on a wider screen. */
export function AuthShell({ children }: { children: ReactNode }) {
  // The clips depend on browser settings, so they join once the page runs there.
  const inBrowser = useSyncExternalStore(noopSubscribe, () => true, () => false);

  return (
    <div className="flex min-h-dvh flex-col bg-surface-app md:grid md:grid-cols-2">
      <aside
        data-surface="media"
        style={{ background: "var(--media-placeholder)" }}
        className="relative isolate flex h-[30dvh] min-h-48 shrink-0 items-center justify-center px-gutter pb-7 md:sticky md:top-0 md:h-dvh md:items-end md:justify-start md:p-12"
      >
        {inBrowser && (
          <ViewTransition enter="media" default="none">
            <MediaBackdrop clip="welcome" scrim="even" />
          </ViewTransition>
        )}
        <div className="grid justify-items-center gap-4 md:justify-items-start">
          <Wordmark size={30} as="p" />
          <p className="pjs-display m-0 hidden text-display-l md:block">Każdy trening się liczy</p>
        </div>
      </aside>
      <main className="relative z-10 -mt-7 flex flex-1 flex-col overflow-x-clip rounded-t-[28px] bg-surface-app md:mt-0 md:justify-center md:rounded-none">
        <div className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-8 px-gutter py-8">{children}</div>
      </main>
    </div>
  );
}
