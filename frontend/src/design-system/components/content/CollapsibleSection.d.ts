/**
 * Folder-style disclosure group.
 */
export interface CollapsibleSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  count?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trailing?: React.ReactNode;
  as?: React.ElementType;
}
export function CollapsibleSection(props: CollapsibleSectionProps): React.JSX.Element;
