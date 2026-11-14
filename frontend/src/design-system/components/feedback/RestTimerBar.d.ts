/**
 * Docked, non-modal rest countdown.
 */
export interface RestTimerBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When rest ends, ms since epoch. */
  endsAt: number;
  /** Rest length in seconds, for the progress line. */
  total: number;
  /** What comes next, e.g. "Bench press, set 3". */
  next?: string;
  onAdjust?: (deltaSeconds: number) => void;
  onSkip?: () => void;
  /** Called once when the countdown reaches zero while the member is here: vibrate, play the sound, announce.
   *  Not called if rest already ended while the screen was off; the bar just shows "Rest over". */
  onEnd?: () => void;
}
export function RestTimerBar(props: RestTimerBarProps): React.JSX.Element;
