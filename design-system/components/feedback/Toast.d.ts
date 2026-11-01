/**
 * Floating confirmation with an optional action; render inside ToastRegion.
 */
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  message: React.ReactNode;
  icon?: string;
  /** One inline action, e.g. Undo. Show such toasts for 8s, others for 4s. */
  action?: { label: string; onAction: () => void };
  tone?: "neutral" | "danger";
}
export function Toast(props: ToastProps): React.JSX.Element;
export interface ToastRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  placement?: "bottom" | "top";
  /** Distance from the edge, above docked bars. */
  offset?: number | string;
}
/** Always-mounted polite live region. One per screen frame. */
export function ToastRegion(props: ToastRegionProps): React.JSX.Element;
