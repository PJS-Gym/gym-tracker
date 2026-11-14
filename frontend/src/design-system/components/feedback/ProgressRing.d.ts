/**
 * Circular progress with the readable value inside.
 */
export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  label: string;
  valueText?: string;
  /** CSS transition for the arc; a 1s countdown should pass "stroke-dashoffset 1s linear". */
  transition?: string;
  children?: React.ReactNode;
}
export function ProgressRing(props: ProgressRingProps): React.JSX.Element;
