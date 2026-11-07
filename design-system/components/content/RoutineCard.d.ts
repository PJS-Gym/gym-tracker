/**
 * Saved routine card with one Start routine button.
 * @startingPoint section="Content" subtitle="Routine card with Start CTA" viewport="390x220"
 */
export interface RoutineCardProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  exercises?: string[];
  meta?: React.ReactNode;
  onStart?: () => void;
  /** Adds an "Options for {title}" button. */
  onMenu?: () => void;
  startLabel?: string;
  /** Title element; default "h3". */
  as?: React.ElementType;
}
export function RoutineCard(props: RoutineCardProps): React.JSX.Element;
