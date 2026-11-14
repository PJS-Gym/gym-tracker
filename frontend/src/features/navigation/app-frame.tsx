"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { AppIcon } from "@/components/app-icons";
import { Icon, Sheet, Wordmark } from "@/design-system";
import { ThemeSwitch } from "@/features/theme/theme-switch";
import { activeDestination, type Destination, DESTINATIONS, GROUPS, NEW_WORKOUT_HREF } from "./destinations";
import { SignOut } from "./sign-out";

type Active = { destination: Destination | undefined; logging: boolean };

/**
 * The menus read the address to mark the active screen. On a page with an unknown id (a
 * workout) that is only known per request, so each menu sits in its own boundary and shows
 * itself with nothing marked until then; the rest of the frame stays prerendered.
 */
function WithActive({ children }: { children: (active: Active) => ReactNode }) {
  return (
    <Suspense fallback={children({ destination: undefined, logging: false })}>
      <ActiveFromPath>{children}</ActiveFromPath>
    </Suspense>
  );
}

function ActiveFromPath({ children }: { children: (active: Active) => ReactNode }) {
  const pathname = usePathname();
  return children({ destination: activeDestination(pathname), logging: pathname === NEW_WORKOUT_HREF });
}

/**
 * Signed-in app frame on a warm, textured canvas. Desktop: a side menu grouped into Trening and
 * Postępy, with "Nowy trening" at the top and the theme and account at the bottom. Phone: a floating
 * bar with "Nowy trening" in the middle; the progress screens and settings sit under "Więcej".
 * Every screen is at most two taps from Start.
 */
export function AppFrame({ children, account }: { children: ReactNode; account?: ReactNode }) {
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const dock = useRef<HTMLDivElement>(null);
  const [dockHeight, setDockHeight] = useState(0);

  useEffect(() => {
    for (const d of DESTINATIONS) router.prefetch(d.href);
  }, [router]);

  // The scroll area leaves room for whatever floats at the bottom (resume bar, phone tab bar).
  useEffect(() => {
    const node = dock.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setDockHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-canvas relative flex h-dvh">
      <nav aria-label="Główne" className="hidden w-[272px] shrink-0 flex-col gap-7 px-4 pt-7 pb-5 md:flex">
        <Link href="/" className="px-3 text-fg no-underline hover:no-underline" aria-label="Gym Tracker, Start">
          <Wordmark size={20} as="span" lockup />
        </Link>

        <WithActive>
          {({ logging }) => (
            <Link
              href={NEW_WORKOUT_HREF}
              transitionTypes={["nav-forward"]}
              aria-current={logging ? "page" : undefined}
              className="pjs-i pjs-press flex h-12 items-center justify-center gap-2 rounded-full bg-accent-fill font-bold text-on-accent no-underline shadow-[0_8px_20px_-8px_rgba(255,79,160,.7)] hover:no-underline"
            >
              <Icon name="plus" size={20} />
              Nowy trening
            </Link>
          )}
        </WithActive>

        <WithActive>{({ destination }) => <SideMenu active={destination} />}</WithActive>

        <div className="mt-auto grid gap-3">
          <ThemeSwitch compact />
          {account}
        </div>
      </nav>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div
          className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]"
          style={{ paddingBottom: dockHeight }}
          data-scroll-root=""
        >
          {children}
        </div>

        <div ref={dock} className="pointer-events-none absolute inset-x-0 bottom-0 z-[var(--z-dock)] grid">
          {/* Its own fixed layer during a transition, so moving content always passes beneath it. */}
          <div className="pointer-events-auto md:hidden" style={{ viewTransitionName: "app-tabbar" }}>
            <WithActive>{(active) => <PhoneTabBar active={active} onMore={() => setMoreOpen(true)} />}</WithActive>
          </div>
        </div>
      </div>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen} title="Więcej">
        <WithActive>
          {({ destination }) => <MoreMenu active={destination} onPick={() => setMoreOpen(false)} />}
        </WithActive>
        <div className="mt-5 grid gap-2">
          <p className="m-0 text-label font-semibold text-fg-2">Motyw</p>
          <ThemeSwitch />
        </div>
        <div className="mt-4">
          <SignOut>
            {(signOut) => (
              <button
                type="button"
                onClick={signOut}
                className="pjs-i flex h-12 w-full items-center gap-3 rounded-[16px] border-0 bg-transparent px-3 font-[inherit] text-body font-semibold text-fg-accent"
              >
                <AppIcon name="log-out" size={20} />
                Wyloguj się
              </button>
            )}
          </SignOut>
        </div>
      </Sheet>
    </div>
  );
}

function SideMenu({ active }: { active: Destination | undefined }) {
  return (
    <div className="grid gap-6">
      {GROUPS.map((group) => {
        const items = DESTINATIONS.filter((d) => d.group === group.id);
        return (
          <section key={group.id} aria-labelledby={`nav-${group.id}`} className="grid gap-1">
            <h2 id={`nav-${group.id}`} className="m-0 px-3 pb-1 text-caption font-semibold text-fg-3">
              {group.label}
            </h2>
            <ul className="m-0 grid list-none gap-0.5 p-0">
              {items.map((d) => {
                const isActive = d.id === active?.id;
                return (
                  <li key={d.id}>
                    <Link
                      href={d.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`pjs-i flex min-h-11 items-center gap-3 rounded-[14px] px-3 font-semibold no-underline transition-[background-color,box-shadow,color] duration-200 hover:no-underline ${
                        isActive ? "bg-surface-card text-fg shadow-[var(--card-shadow)]" : "text-fg-2"
                      }`}
                    >
                      <span
                        // The pink indicator glides between items when the screen changes.
                        style={isActive ? { viewTransitionName: "nav-indicator" } : undefined}
                        className={`flex size-8 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-200 ${
                          isActive ? "bg-accent-fill text-on-accent" : ""
                        }`}
                      >
                        <Icon name={d.icon} size={19} />
                      </span>
                      {d.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function PhoneTabBar({ active, onMore }: { active: Active; onMore: () => void }) {
  const tabs = DESTINATIONS.filter((d) => d.inTabBar);
  const moreActive = active.destination !== undefined && !active.destination.inTabBar;

  const tab = (d: Destination) => {
    const isActive = active.destination?.id === d.id;
    return (
      <Link
        key={d.id}
        href={d.href}
        aria-current={isActive ? "page" : undefined}
        className={`pjs-i flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-[18px] text-caption font-bold no-underline hover:no-underline ${
          isActive ? "text-fg" : "text-fg-2"
        }`}
      >
        <TabIcon icon={d.icon} active={isActive} />
        {d.label}
      </Link>
    );
  };

  return (
    <div className="px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      <nav
        aria-label="Główne"
        data-tabbar=""
        className="chrome mx-auto flex max-w-md items-center gap-1 rounded-[26px] p-1.5 shadow-[var(--shadow-float)]"
      >
        {tab(tabs[0])}
        {tab(tabs[1])}
        <Link
          href={NEW_WORKOUT_HREF}
          transitionTypes={["nav-forward"]}
          aria-label="Nowy trening"
          aria-current={active.logging ? "page" : undefined}
          className="pjs-i pjs-press mx-1 flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-fill text-on-accent no-underline shadow-[0_10px_24px_-8px_rgba(255,79,160,.75)] hover:no-underline"
        >
          <Icon name="plus" size={26} strokeWidth={2.5} />
        </Link>
        {tab(tabs[2])}
        <button
          type="button"
          onClick={onMore}
          aria-haspopup="dialog"
          aria-current={moreActive ? "page" : undefined}
          className={`pjs-i flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-[18px] border-0 bg-transparent font-[inherit] text-caption font-bold ${
            moreActive ? "text-fg" : "text-fg-2"
          }`}
        >
          <TabIcon icon="ellipsis" active={moreActive} />
          Więcej
        </button>
      </nav>
    </div>
  );
}

function TabIcon({ icon, active }: { icon: string; active: boolean }) {
  return (
    <span
      className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-200 ${
        active ? "bg-[var(--accent-soft)] text-[var(--text-on-accent-soft)]" : ""
      }`}
    >
      <Icon name={icon} size={21} />
    </span>
  );
}

function MoreMenu({ active, onPick }: { active: Destination | undefined; onPick: () => void }) {
  return (
    <div className="grid gap-5">
      {GROUPS.map((group) => {
        const items = DESTINATIONS.filter((d) => d.group === group.id && !d.inTabBar);
        if (items.length === 0) return null;
        return (
          <section key={group.id} aria-labelledby={`more-${group.id}`} className="grid gap-2">
            <h3 id={`more-${group.id}`} className="m-0 text-label font-semibold text-fg-2">
              {group.label}
            </h3>
            <ul className="card m-0 grid list-none overflow-hidden p-0">
              {items.map((d, index) => {
                const isActive = d.id === active?.id;
                return (
                  <li key={d.id} className={index > 0 ? "border-t border-line" : undefined}>
                    <Link
                      href={d.href}
                      onClick={onPick}
                      aria-current={isActive ? "page" : undefined}
                      className="pjs-i flex min-h-16 items-center gap-3 px-4 py-3 text-fg no-underline hover:no-underline"
                    >
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] ${
                          isActive ? "bg-accent-fill text-on-accent" : "bg-surface-raised text-fg"
                        }`}
                      >
                        <Icon name={d.icon} size={20} />
                      </span>
                      <span className="grid min-w-0 flex-1 gap-0.5">
                        <span className="font-bold">{d.label}</span>
                        {d.hint && <span className="truncate text-body-s text-fg-2">{d.hint}</span>}
                      </span>
                      <Icon name="chevron-right" size={18} className="shrink-0 text-fg-3" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
