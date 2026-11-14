/**
 * Bottom app navigation with a pink pill behind the active icon.
 * @startingPoint section="Navigation" subtitle="Bottom tab bar" viewport="390x100"
 */
export interface TabBarItem { id: string; label: string; icon: string; /** Render as a link (Next.js routes). */ href?: string }
export interface TabBarProps extends React.HTMLAttributes<HTMLElement> {
  items: TabBarItem[];
  value?: string;
  onValueChange?: (id: string) => void;
  /** Landmark name; default "Main". */
  label?: string;
}
export function TabBar(props: TabBarProps): React.JSX.Element;
