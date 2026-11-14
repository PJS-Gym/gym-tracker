/**
 * Circular icon-only button. `label` is required: it is the accessible name.
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  /** Accessible name, e.g. "Back", "Options for Push day". Required. */
  label: string;
  /** plain (top bars), tonal, overlay (solid chip over photos), accent (big hero play), soft. */
  variant?: "plain" | "tonal" | "overlay" | "accent" | "soft";
  /** Diameter in px; default 44. Smaller sizes get an expanded 44px hit area. */
  size?: number;
  /** Makes it a toggle (aria-pressed) and fills the glyph when true. */
  pressed?: boolean;
}
export const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
