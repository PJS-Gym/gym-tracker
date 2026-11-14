"use client";

import { useEffect, useRef, useState } from "react";
import { formatWeight } from "@/lib/format";
import { type Field, parseValue } from "./draft";

const show = (value: number | null) => (value === null ? "" : formatWeight(value));

type Props = {
  field: Field;
  value: number | null;
  onValueChange: (value: number | null) => void;
  onValidityChange: (valid: boolean) => void;
  /** Accessible name, e.g. "Seria 2, ciężar w kg". */
  label: string;
  placeholder?: string;
};

/**
 * One number in the logger: numeric keypad, everything selected on focus, "," or "." accepted.
 * It commits on blur or Enter, and Enter jumps to the next cell. Invalid text stays visible with a
 * danger edge instead of being thrown away.
 */
export function LogCell({ field, value, onValueChange, onValidityChange, label, placeholder }: Props) {
  const [text, setText] = useState(show(value));
  const [invalid, setInvalid] = useState(false);
  const focused = useRef(false);

  // A new value from outside (a copied set, undo) replaces the text unless the member is typing.
  useEffect(() => {
    if (!focused.current) {
      setText(show(value));
      setInvalid(false);
    }
  }, [value]);

  useEffect(() => onValidityChange(!invalid), [invalid, onValidityChange]);

  function commit(): boolean {
    const parsed = parseValue(text, field);
    if (parsed === "invalid") {
      setInvalid(true);
      return false;
    }
    setInvalid(false);
    setText(show(parsed));
    if (parsed !== value) onValueChange(parsed);
    return true;
  }

  return (
    <input
      className="pjs-cell h-[var(--tap-logger)] w-full min-w-0 rounded-[10px] bg-surface-card p-0 text-center text-[17px] font-bold text-fg tabular-nums [scroll-margin-bottom:160px]"
      type="text"
      inputMode={field === "reps" ? "numeric" : "decimal"}
      enterKeyHint="next"
      autoComplete="off"
      aria-label={label}
      aria-invalid={invalid || undefined}
      placeholder={placeholder}
      value={text}
      data-log-cell=""
      onFocus={(event) => {
        focused.current = true;
        event.target.select();
      }}
      onChange={(event) => setText(event.target.value)}
      onBlur={() => {
        focused.current = false;
        commit();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        if (!commit()) return;
        const cells = [...document.querySelectorAll<HTMLInputElement>("input[data-log-cell]")];
        const next = cells[cells.indexOf(event.currentTarget) + 1];
        if (next) next.focus();
        else event.currentTarget.blur();
      }}
    />
  );
}
