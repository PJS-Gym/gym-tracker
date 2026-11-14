/**
 * Honest bar chart with a hidden data table.
 */
export interface BarChartBar { label: string; fullLabel?: string; value: number }
export interface BarChartProps extends React.HTMLAttributes<HTMLElement> {
  bars: BarChartBar[];
  unit?: string;
  /** Index of the bar that matters; defaults to the largest. */
  highlight?: number;
  caption?: React.ReactNode;
  height?: number;
  format?: (value: number) => string;
}
export function BarChart(props: BarChartProps): React.JSX.Element;
