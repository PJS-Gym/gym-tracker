/**
 * Big-number −/+ control for a single value.
 */
export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Names the group and both buttons ("Decrease rest time"). */
  label: string;
  value: number;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  /** Fixed decimals for display; defaults to the step's decimals (step 2.5 → "135.0"). */
  decimals?: number;
  /** Display format, e.g. seconds → "1:30". Overrides decimals. */
  format?: (value: number) => React.ReactNode;
  onValueChange?: (value: number) => void;
}
export function Stepper(props: StepperProps): React.JSX.Element;
