/**
 * Full-bleed photo header with the screen's one display title.
 * @startingPoint section="Content" subtitle="Full-bleed workout hero" viewport="390x560"
 */
export interface WorkoutHeroProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Photo URL; omitted = dark placeholder. */
  image?: string;
  alt?: string;
  /** Small line above the title, e.g. "Thursday, June 27 · 28 min". */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  /** Grows with content (zoom-safe); default 520. */
  minHeight?: number;
  as?: React.ElementType;
  children?: React.ReactNode;
}
export function WorkoutHero(props: WorkoutHeroProps): React.JSX.Element;
