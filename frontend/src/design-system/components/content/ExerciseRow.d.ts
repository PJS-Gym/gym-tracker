/**
 * Exercise row: thumbnail, name, sets or duration.
 */
export interface ExerciseRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  meta?: React.ReactNode;
  image?: string;
  /** Makes the row a button. */
  onClick?: () => void;
  /** Picker mode: the row toggles (aria-pressed) and shows a round check. */
  selectable?: boolean;
  selected?: boolean;
  /** Adds an "Options for {name}" button. */
  onMenu?: () => void;
}
export function ExerciseRow(props: ExerciseRowProps): React.JSX.Element;
