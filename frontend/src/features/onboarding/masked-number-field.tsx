"use client";

import type { SyntheticEvent } from "react";
import { applyNumberMask, type NumberMask, numberSlots } from "@/features/profile/number-mask";

type Props = {
  id: string;
  label: string;
  unit: string;
  mask: NumberMask;
  value: string;
  onValueChange: (value: string) => void;
  hint?: string;
  error?: string;
  /** "xl" alone on a screen, "l" for two side by side. */
  size?: "xl" | "l";
};

const SIZES = {
  xl: { height: 104, digits: "var(--fs-metric-xl)" },
  l: { height: 76, digits: "var(--fs-metric-l)" },
};

const Digit = ({ digit }: { digit: string | null }) => (
  <span style={{ color: digit === null ? "var(--border-control)" : "var(--text-1)" }}>{digit ?? "0"}</span>
);

/**
 * A big number in fixed slots. Every digit, the comma and the unit always occupy the same place;
 * empty slots show a pale zero. The real input lies invisibly on top, so the keyboard, paste and
 * screen readers work as usual, with the caret kept at the end.
 */
export function MaskedNumberField({ id, label, unit, mask, value, onValueChange, hint, error, size = "xl" }: Props) {
  const slots = numberSlots(value, mask);
  const { height, digits } = SIZES[size];
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  function keepCaretAtEnd(event: SyntheticEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    if (input.selectionStart !== input.value.length) input.setSelectionRange(input.value.length, input.value.length);
  }

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-label font-semibold text-fg-2">
        {label}
      </label>
      <span
        style={{ height, background: "var(--surface-card)" }}
        className="pjs-field__box relative flex items-center justify-center rounded-[14px]"
      >
        <span aria-hidden="true" className="flex items-baseline gap-1.5">
          <span
            style={{ fontSize: digits, fontWeight: "var(--weight-heavy)", lineHeight: 1, transition: "color var(--dur-fast) var(--ease-standard)" }}
            className="flex tabular-nums"
          >
            {slots.whole.map((digit, slot) => (
              <Digit key={slot} digit={digit} />
            ))}
            {mask.decimals > 0 && (
              <>
                <span style={{ color: slots.fraction === null ? "var(--border-control)" : "var(--text-1)" }}>,</span>
                <Digit digit={slots.fraction} />
              </>
            )}
          </span>
          <span className="text-body font-semibold text-fg-2">{unit}</span>
        </span>
        <input
          id={id}
          type="text"
          inputMode={mask.decimals > 0 ? "decimal" : "numeric"}
          autoComplete="off"
          enterKeyHint="next"
          value={value}
          onChange={(event) => onValueChange(applyNumberMask(event.target.value, mask))}
          onSelect={keepCaretAtEnd}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="absolute inset-0 size-full cursor-text opacity-0"
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
