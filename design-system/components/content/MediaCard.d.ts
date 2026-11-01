/**
 * A session or class on a photo; the whole card is one button.
 */
export interface MediaCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  title: React.ReactNode;
  meta?: React.ReactNode;
  image?: string;
  /** Full width, expanded display title, play mark. One per screen. */
  featured?: boolean;
}
export const MediaCard: React.ForwardRefExoticComponent<MediaCardProps & React.RefAttributes<HTMLButtonElement>>;
