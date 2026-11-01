/**
 * Body-activity row on a shared label / bar / value grid.
 */
export interface MuscleRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  percent: number;
  /** The largest value in the set, so every row shares one scale. */
  max?: number;
  /** The row that matters: pink bar, bold label and value. */
  highlight?: boolean;
  divider?: boolean;
}
export function MuscleRow(props: MuscleRowProps): React.JSX.Element;
