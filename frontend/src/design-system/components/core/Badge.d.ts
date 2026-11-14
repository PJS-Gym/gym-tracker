/**
 * Small sentence-case pill for a real state (new PR, live now, booked).
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** neutral; soft (strawberry, rose-800 text 6.3:1); accent (pink, ink); success; live (flare, white 5.4:1). */
  tone?: "neutral" | "soft" | "accent" | "success" | "live";
}
export function Badge(props: BadgeProps): React.JSX.Element;
