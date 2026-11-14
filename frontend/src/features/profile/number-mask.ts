export type NumberMask = {
  integers: number;
  decimals: 0 | 1;
  /** The largest value allowed. A whole part above it cannot be meant, so its last digit is a decimal. */
  max?: number;
};

/**
 * Keeps typed text inside a mask: digits only, one decimal mark (a comma, whichever key was pressed),
 * no leading zeros. A digit past the last integer slot carries on into the decimal slot, and so does
 * the last one when the whole part would go past `max`: with a 300 kg limit, typing 7 9 6 gives 79,6.
 */
export function applyNumberMask(raw: string, { integers, decimals, max }: NumberMask): string {
  const [first, ...rest] = raw.replace(/\./g, ",").replace(/[^\d,]/g, "").split(",");
  let whole = first.replace(/^0+(?=\d)/, "");
  let fraction = rest.join("");
  let hasMark = rest.length > 0;
  // Without a typed mark, the digits fill the whole part as far as a possible value allows.
  const wholeDigits =
    !hasMark && decimals > 0 && max !== undefined && Number(whole.slice(0, integers)) > max ? integers - 1 : integers;
  if (whole.length > wholeDigits) {
    fraction = whole.slice(wholeDigits) + fraction;
    whole = whole.slice(0, wholeDigits);
    hasMark = true;
  }
  if (decimals === 0 || !hasMark) return whole;
  return `${whole || "0"},${fraction.slice(0, decimals)}`;
}

export type NumberSlots = {
  /** One entry per integer slot, right-aligned; `null` is an empty slot. */
  whole: (string | null)[];
  fraction: string | null;
};

/** Which digit sits in which slot. The slots never change, so nothing moves as digits arrive. */
export function numberSlots(value: string, { integers }: NumberMask): NumberSlots {
  const [whole = "", fraction = ""] = value.split(",");
  const padding = Array<null>(Math.max(0, integers - whole.length)).fill(null);
  return { whole: [...padding, ...whole.slice(0, integers)], fraction: fraction.charAt(0) || null };
}
