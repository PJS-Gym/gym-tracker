import { describe, expect, test } from "bun:test";
import { applyNumberMask, numberSlots } from "./number-mask";

const MASS = { integers: 3, decimals: 1 } as const;
const HEIGHT = { integers: 3, decimals: 0 } as const;

describe("applyNumberMask", () => {
  test("keeps digits and turns either decimal mark into a comma", () => {
    expect(applyNumberMask("72.5", MASS)).toBe("72,5");
    expect(applyNumberMask("72,5", MASS)).toBe("72,5");
    expect(applyNumberMask("7a2 kg", MASS)).toBe("72");
    expect(applyNumberMask("-5", MASS)).toBe("5");
  });

  test("keeps a mark still being typed", () => {
    expect(applyNumberMask("72,", MASS)).toBe("72,");
  });

  test("carries a fourth digit into the decimal slot", () => {
    expect(applyNumberMask("1005", MASS)).toBe("100,5");
  });

  test("allows one decimal only, and a second mark changes nothing", () => {
    expect(applyNumberMask("72,55", MASS)).toBe("72,5");
    expect(applyNumberMask("72,5,", MASS)).toBe("72,5");
  });

  test("whole-number masks stop at their last slot", () => {
    expect(applyNumberMask("1789", HEIGHT)).toBe("178");
    expect(applyNumberMask("178,5", HEIGHT)).toBe("178");
  });

  test("drops leading zeros and fills in a missing whole part", () => {
    expect(applyNumberMask("072", MASS)).toBe("72");
    expect(applyNumberMask(",5", MASS)).toBe("0,5");
  });

  test("empty stays empty", () => {
    expect(applyNumberMask("", MASS)).toBe("");
  });
});

describe("applyNumberMask with a limit", () => {
  const MASS_LIMITED = { integers: 3, decimals: 1, max: 300 } as const;
  const CIRCUMFERENCE = { integers: 3, decimals: 1, max: 200 } as const;

  test("a whole part past the limit gives its last digit to the decimal", () => {
    expect(applyNumberMask("796", MASS_LIMITED)).toBe("79,6");
    expect(applyNumberMask("301", MASS_LIMITED)).toBe("30,1");
    expect(applyNumberMask("965", CIRCUMFERENCE)).toBe("96,5");
  });

  test("possible three-digit values stay whole", () => {
    expect(applyNumberMask("120", MASS_LIMITED)).toBe("120");
    expect(applyNumberMask("300", MASS_LIMITED)).toBe("300");
    expect(applyNumberMask("150", CIRCUMFERENCE)).toBe("150");
  });

  test("typing on keeps one decimal", () => {
    expect(applyNumberMask("7965", MASS_LIMITED)).toBe("79,6");
    expect(applyNumberMask("1205", MASS_LIMITED)).toBe("120,5");
  });

  test("a typed mark is taken as written", () => {
    expect(applyNumberMask("79,6", MASS_LIMITED)).toBe("79,6");
    expect(applyNumberMask("79,", MASS_LIMITED)).toBe("79,");
  });

  test("deleting the decimal leaves the whole part", () => {
    expect(applyNumberMask("79", MASS_LIMITED)).toBe("79");
  });
});

describe("numberSlots", () => {
  test("right-aligns the whole part", () => {
    expect(numberSlots("7", MASS).whole).toEqual([null, null, "7"]);
    expect(numberSlots("72,5", MASS)).toEqual({ whole: [null, "7", "2"], fraction: "5" });
    expect(numberSlots("178", HEIGHT).whole).toEqual(["1", "7", "8"]);
  });

  test("an empty value has empty slots", () => {
    expect(numberSlots("", MASS)).toEqual({ whole: [null, null, null], fraction: null });
  });
});
