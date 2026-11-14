/**
 * Photo frame with the dark placeholder until real photography exists.
 */
export interface MediaProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  /** Required when the photo carries information; "" when decorative. */
  alt?: string;
  radius?: number | string;
}
export function Media(props: MediaProps): React.JSX.Element;
