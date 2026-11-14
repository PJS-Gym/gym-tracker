/**
 * Filter or choice pill with aria-pressed.
 */
export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected chips invert to blush-on-plum and set aria-pressed. */
  selected?: boolean;
  icon?: string;
}
export const Chip: React.ForwardRefExoticComponent<ChipProps & React.RefAttributes<HTMLButtonElement>>;
