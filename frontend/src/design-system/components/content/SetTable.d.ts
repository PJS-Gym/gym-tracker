/**
 * The set logger for one exercise. Compound.
 */
export interface SetValues { weight: number | null; reps: number | null }
export interface SetTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Exercise name; names the table. */
  label: string;
  unit?: "kg" | "lb";
  /** Decimals for weights in cells and in Previous; default 1 (80.0 kg). */
  weightDecimals?: number;
}
export function SetTable(props: SetTableProps): React.JSX.Element;
export namespace SetTable {
  function Header(props: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
  function Row(props: {
    /** 1, 2, 3… or a label such as "W" for a warm-up. */
    index: React.ReactNode;
    /** Last time's values; tapping them copies them in. */
    previous?: { weight?: number | null; reps?: number | null } | null;
    /** Planned values; shown as placeholders before last time's. */
    target?: { weight?: number | null; reps?: number | null } | null;
    weight?: number | null;
    reps?: number | null;
    done?: boolean;
    onDoneChange?: (done: boolean) => void;
    onValueChange?: (values: SetValues) => void;
  } & React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
}
