/**
 * Labelled icon actions under a hero.
 */
export interface ActionRowItem { id?: string; icon: string; label: string; onClick?: () => void; /** Toggle state; also change the label (Save → Saved). */ pressed?: boolean }
export interface ActionRowProps extends React.HTMLAttributes<HTMLDivElement> { items: ActionRowItem[] }
export function ActionRow(props: ActionRowProps): React.JSX.Element;
