/**
 * The Gym Tracker name in Archivo Expanded Black. One colour by default.
 */
export interface WordmarkProps extends React.HTMLAttributes<HTMLElement> {
  /** s 22, m 40, l 96, or a px number. */
  size?: "s" | "m" | "l" | number;
  /** Sets "GYM" in pink. Only on dark or media surfaces, at 28px or larger. */
  lockup?: boolean;
  /** Element to render, e.g. "p" in an app header or "h1" on a splash. */
  as?: React.ElementType;
}
export function Wordmark(props: WordmarkProps): React.JSX.Element;
