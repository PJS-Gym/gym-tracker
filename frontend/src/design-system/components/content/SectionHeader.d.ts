/**
 * Section title with one optional trailing action.
 */
export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  /** Heading element; default "h2". */
  as?: React.ElementType;
  /** One action: <Button variant="ghost" size="sm">, a labelled IconButton, or plain meta text. */
  trailing?: React.ReactNode;
}
export function SectionHeader(props: SectionHeaderProps): React.JSX.Element;
