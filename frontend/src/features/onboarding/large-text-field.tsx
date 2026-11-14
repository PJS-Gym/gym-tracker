"use client";

import type { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  hint?: string;
  error?: string;
};

/**
 * Text in the display face, the same weight of presence as the big number fields. Left-aligned,
 * so typing only extends to the right; a name too long for the box scrolls inside it.
 */
export function LargeTextField({ id, label, value, onValueChange, hint, error, ...input }: Props) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-label font-semibold text-fg-2">
        {label}
      </label>
      <span
        style={{ height: 104, background: "var(--surface-card)" }}
        className="pjs-field__box flex items-center rounded-[14px] px-5"
      >
        <input
          {...input}
          id={id}
          type="text"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="pjs-display w-full min-w-0 border-0 bg-transparent p-0 text-display-m leading-[1.3] text-fg caret-[var(--accent)] placeholder:text-[var(--border-control)]"
        />
      </span>
      {error ? (
        <span id={`${id}-error`} role="alert" className="text-label font-semibold text-fg-danger">
          {error}
        </span>
      ) : (
        hint && (
          <span id={`${id}-hint`} className="text-label text-fg-2">
            {hint}
          </span>
        )
      )}
    </div>
  );
}
