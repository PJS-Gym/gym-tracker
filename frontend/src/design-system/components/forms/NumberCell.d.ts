/**
 * Inline-editable number for the set logger.
 */
export interface NumberCellProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "placeholder"> {
  value: number | null;
  onValueChange?: (value: number | null) => void;
  /** Accessible name, e.g. "Set 2 weight, kg". */
  label: string;
  /** Shown in an empty cell: the target, or last time's value. */
  placeholder?: number | string;
  /** decimal (weight) or integer (reps). */
  mode?: "decimal" | "integer";
  /** Fixed decimals when not editing: default 1 for decimal (135.0), 0 for integer. Keeps the width stable as values change. */
  decimals?: number;
  max?: number;
  /** Called after a valid commit with Enter; SetTable uses it to move to the next cell. */
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
export const NumberCell: React.ForwardRefExoticComponent<NumberCellProps & React.RefAttributes<HTMLInputElement>>;
