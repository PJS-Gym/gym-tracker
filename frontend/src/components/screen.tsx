import { type ReactNode, ViewTransition } from "react";

// Peers fade through; going deeper or back slides (Link transitionTypes "nav-forward" / "nav-back").
const SCREEN_TRANSITION = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "screen" };

const WIDTH = {
  /** Forms: one comfortable column. */
  narrow: "max-w-2xl",
  /** Reading: charts and single lists. */
  default: "max-w-3xl",
  /** Collections that fill the desktop with a grid: Start, Treningi, Ćwiczenia. */
  wide: "max-w-6xl",
};

type Props = {
  title: string;
  children?: ReactNode;
  /** One line under the title. */
  subtitle?: ReactNode;
  /** The screen's own action, on the right of the title (e.g. "Nowy trening"). */
  actions?: ReactNode;
  /** A deeper screen: its back link (usually <BackLink>). Shows the compact sticky header instead of the large title. */
  back?: ReactNode;
  /** Replaces the header entirely; `false` for none. */
  header?: ReactNode | false;
  /** The children lay out their own column (the logger); no padding or width is added. */
  bare?: boolean;
  width?: keyof typeof WIDTH;
};

/** A signed-in screen: a large title with room to breathe, then the content column. */
export function Screen({ title, subtitle, actions, children, back, header, bare = false, width = "default" }: Props) {
  const column = `mx-auto w-full ${WIDTH[width]} px-gutter md:px-10`;
  return (
    <ViewTransition enter={SCREEN_TRANSITION} exit={SCREEN_TRANSITION} default="none">
      <div>
        {header === undefined && back ? (
          <DetailBar leading={back} title={title} trailing={actions} width={width} />
        ) : header === undefined ? (
          <header className={`${column} flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pt-10 pb-2 md:pt-14`}>
            <div className="grid min-w-0 gap-2">
              <h1 className="pjs-display m-0 text-display-m md:text-display-l">{title}</h1>
              {subtitle && <p className="m-0 text-body text-fg-2">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </header>
        ) : (
          header
        )}
        {bare && children}
        {!bare && children && (
          <div className={`${column} grid grid-cols-[minmax(0,1fr)] gap-10 ${back ? "pt-1" : "pt-6"} pb-16`}>{children}</div>
        )}
      </div>
    </ViewTransition>
  );
}

/**
 * The header of a deeper screen (a workout, an exercise, the logger): back pill, the screen's name
 * and its action. It sticks while the content scrolls under it, frosted and fading out at its foot.
 */
export function DetailBar({
  leading,
  title,
  trailing,
  width = "default",
}: {
  leading: ReactNode;
  title: ReactNode;
  trailing?: ReactNode;
  width?: keyof typeof WIDTH;
}) {
  return (
    <header className="detail-bar sticky top-0 z-[var(--z-sticky)] px-gutter pt-3 pb-6 md:px-10 md:pt-6">
      <div className={`mx-auto flex w-full ${WIDTH[width]} items-center gap-3`}>
        {leading}
        <h1 className="m-0 min-w-0 flex-1 truncate text-title-s font-bold">{title}</h1>
        {trailing && <div className="flex shrink-0 items-center gap-2">{trailing}</div>}
      </div>
    </header>
  );
}
