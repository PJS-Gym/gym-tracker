/**
 * Minimized workout bar above the TabBar.
 */
export interface ResumeBarProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  title: React.ReactNode;
  /** e.g. "3 of 5 sets · started 28 min ago" or the rest countdown. */
  detail?: React.ReactNode;
  onResume?: () => void;
}
export function ResumeBar(props: ResumeBarProps): React.JSX.Element;
