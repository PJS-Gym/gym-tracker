import Link from "next/link";
import { Icon } from "@/design-system";

const ICON_LINK =
  "pjs-i pjs-press pjs-press--icon flex size-11 items-center justify-center rounded-full text-fg no-underline hover:no-underline";

/**
 * Back to where the member came from, sliding back. A frosted pill that stays readable over
 * content scrolling beneath the sticky header; `text` names the destination ("Treningi").
 */
export function BackLink({ href, label, text }: { href: string; label: string; text?: string }) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-back"]}
      aria-label={label}
      className={`chrome pjs-i pjs-press flex h-11 shrink-0 items-center rounded-full text-fg no-underline shadow-[var(--card-shadow)] hover:no-underline ${
        text ? "gap-1 pr-4 pl-2.5 text-body-s font-bold" : "w-11 justify-center"
      }`}
    >
      <Icon name="chevron-left" size={22} />
      {text}
    </Link>
  );
}

/** An icon action in a top bar that opens a deeper screen. */
export function IconLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link href={href} transitionTypes={["nav-forward"]} aria-label={label} className={ICON_LINK}>
      <Icon name={icon} size={22} />
    </Link>
  );
}

// The design system's buttons as links, for actions that open another screen.
export const LINK_BUTTON = {
  primary:
    "pjs-i pjs-press flex h-[60px] items-center justify-center gap-2 rounded-full bg-accent-fill px-6 font-bold text-on-accent no-underline hover:no-underline",
  tonal:
    "pjs-i pjs-press flex h-12 items-center justify-center gap-2 rounded-full bg-surface-raised px-5 font-bold text-fg no-underline hover:no-underline",
  /** A screen header's action: compact, pink, with a soft glow. */
  header:
    "pjs-i pjs-press flex h-11 items-center justify-center gap-2 rounded-full bg-accent-fill pr-5 pl-4 text-body-s font-bold text-on-accent no-underline shadow-[0_8px_20px_-8px_rgba(255,79,160,.7)] hover:no-underline",
  /** A quieter header action next to the screen's main one. */
  headerQuiet:
    "pjs-i pjs-press flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--card-edge)] bg-surface-card pr-5 pl-4 text-body-s font-bold text-fg no-underline shadow-[var(--card-shadow)] hover:no-underline",
};

/** A screen header's action that opens a deeper screen. */
export function HeaderLink({ href, icon, children, quiet = false }: { href: string; icon: string; children: string; quiet?: boolean }) {
  return (
    <Link href={href} transitionTypes={["nav-forward"]} className={quiet ? LINK_BUTTON.headerQuiet : LINK_BUTTON.header}>
      <Icon name={icon} size={18} />
      {children}
    </Link>
  );
}
