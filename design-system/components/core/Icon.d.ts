/**
 * Lucide outline icon (2px stroke) as inline SVG, tinted with currentColor.
 */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** One of Icon.names. Unknown names render a circle and log an error in development. */
  name: string;
  size?: number;
  strokeWidth?: number;
}
export function Icon(props: IconProps): React.JSX.Element;
export namespace Icon { const names: string[]; }
