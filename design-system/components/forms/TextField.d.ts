/**
 * Filled single-line input with label, hint and error.
 */
export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue"> {
  /** Required. Use hideLabel to keep it for screen readers only. */
  label: string;
  hideLabel?: boolean;
  hint?: React.ReactNode;
  /** Shows a danger ring and message, sets aria-invalid. Say what is wrong and how to fix it. */
  error?: React.ReactNode;
  icon?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
export const TextField: React.ForwardRefExoticComponent<TextFieldProps & React.RefAttributes<HTMLInputElement>>;
