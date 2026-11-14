/**
 * What to do when there is nothing yet.
 */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  body?: React.ReactNode;
  /** One Button. */
  action?: React.ReactNode;
  as?: React.ElementType;
}
export function EmptyState(props: EmptyStateProps): React.JSX.Element;
