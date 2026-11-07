/**
 * Bottom sheet: the only dialog.
 */
export interface SheetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Rendered as the dialog's h2 and its accessible name. */
  title?: React.ReactNode;
  /** Where focus goes on close if the opener no longer exists (otherwise the screen's h1). */
  returnFocusRef?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
}
export function Sheet(props: SheetProps): React.JSX.Element | null;
