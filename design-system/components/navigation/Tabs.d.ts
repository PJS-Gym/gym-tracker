/**
 * Underline tabs with tablist semantics. Compound.
 */
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
export function Tabs(props: TabsProps): React.JSX.Element;
export namespace Tabs {
  /** role="tablist"; pass aria-label. Arrow keys, Home and End move between tabs. */
  function List(props: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
  function Tab(props: { value: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element;
  function Panel(props: { value: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
}
