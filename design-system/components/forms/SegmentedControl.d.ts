/**
 * 2–4 option switcher built on native radios.
 */
export interface SegmentedControlProps<T extends string | number = string> extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange" | "defaultValue"> {
  /** Names the group for screen readers. */
  label: string;
  options: (T | { value: T; label: React.ReactNode })[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
}
export function SegmentedControl<T extends string | number = string>(props: SegmentedControlProps<T>): React.JSX.Element;
