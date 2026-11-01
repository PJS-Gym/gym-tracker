/**
 * Unboxed metric with label and detail line.
 */
export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: string;
  /** Neutral context, e.g. "Up 8% on last week". */
  detail?: React.ReactNode;
}
export function StatTile(props: StatTileProps): React.JSX.Element;
