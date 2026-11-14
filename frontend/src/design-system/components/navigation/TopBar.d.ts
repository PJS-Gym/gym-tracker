/**
 * Centered-title top bar with leading and trailing slots.
 */
export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  /** A string becomes the screen's h1; any other node is centered as-is (e.g. a timer). */
  children?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** overMedia: on photography. Actions become solid overlay chips; text uses the on-media palette. */
  tone?: "default" | "overMedia";
  divider?: boolean;
  /** Title element; default "h1". */
  as?: React.ElementType;
}
export function TopBar(props: TopBarProps): React.JSX.Element;
export namespace TopBar {
  /** IconButton whose variant follows the bar's tone. label is required. */
  function Action(props: import("../core/IconButton").IconButtonProps): React.JSX.Element;
}
