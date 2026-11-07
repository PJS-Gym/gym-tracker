/**
 * 56px menu or settings row.
 */
export interface ListRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  label: React.ReactNode;
  detail?: React.ReactNode;
  destructive?: boolean;
  /** Unavailable right now (e.g. Move up on the first exercise). */
  disabled?: boolean;
  trailing?: React.ReactNode;
}
export const ListRow: React.ForwardRefExoticComponent<ListRowProps & React.RefAttributes<HTMLButtonElement>>;
