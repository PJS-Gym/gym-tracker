/**
 * Linear or segmented progress with progressbar semantics.
 */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  /** 100 by default; for segmented, the number of segments. */
  max?: number;
  variant?: "continuous" | "segmented";
  /** Accessible name, e.g. "Sets logged". */
  label: string;
  /** e.g. "3 of 5 sets". */
  valueText?: string;
  height?: number;
}
export function ProgressBar(props: ProgressBarProps): React.JSX.Element;
