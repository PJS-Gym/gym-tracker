/**
 * Pill action button. `primary` (pink, ink label) is the one main action on a screen.
 * @startingPoint section="Core" subtitle="Pill buttons: pink, inverse, tonal, outline" viewport="700x260"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = pink with ink label (one per screen); secondary = plum inverse; tonal = raised fill; outline; ghost = text only (deep rose); danger = flare. */
  variant?: "primary" | "secondary" | "tonal" | "outline" | "ghost" | "danger";
  /** sm 40 (hit area expanded to 44), md 48, lg 60. */
  size?: "sm" | "md" | "lg";
  /** Leading icon name (see Icon.names). */
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  /** Defaults to "button"; pass "submit" inside forms. */
  type?: "button" | "submit" | "reset";
}
export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
