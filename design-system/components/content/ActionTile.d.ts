/**
 * Quick-action tile; dashed for an empty slot.
 */
export interface ActionTileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: React.ReactNode;
  /** Empty "add" slot: dashed border, deep-rose label. */
  dashed?: boolean;
}
export const ActionTile: React.ForwardRefExoticComponent<ActionTileProps & React.RefAttributes<HTMLButtonElement>>;
