/**
 * Native checkbox drawn as a rounded square; fills pink when checked.
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "checked" | "defaultChecked" | "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Visible label. Without it, pass aria-label (e.g. "Set 3 done"). */
  label?: React.ReactNode;
  /** Drawn box size; default 32. */
  size?: number;
  /** Touch target; default 48 (logger). */
  hit?: number;
}
export const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
