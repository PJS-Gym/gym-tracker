import { describe, expect, test } from "bun:test";
import {
  nameToAddress,
  ageOn,
  birthDateBounds,
  formatAge,
  parseDecimal,
  validateBirthDate,
  validateCircumference,
  validateDisplayName,
  validateHeight,
  validateMass,
} from "./validation";

describe("parseDecimal", () => {
  test("accepts both decimal marks", () => {
    expect(parseDecimal("82,5")).toBe(82.5);
    expect(parseDecimal(" 82.5 ")).toBe(82.5);
    expect(parseDecimal("80")).toBe(80);
    expect(parseDecimal("82,")).toBe(82);
  });

  test("treats empty as skipped and junk as NaN", () => {
    expect(parseDecimal("  ")).toBeNull();
    expect(parseDecimal("abc")).toBeNaN();
    expect(parseDecimal("-5")).toBeNaN();
    expect(parseDecimal("1,2,3")).toBeNaN();
  });
});

describe("number fields", () => {
  test("height is 100 to 250 cm", () => {
    expect(validateHeight("")).toBeNull();
    expect(validateHeight("100")).toBeNull();
    expect(validateHeight("250")).toBeNull();
    expect(validateHeight("99,9")).toContain("od 100 do 250");
    expect(validateHeight("251")).toContain("od 100 do 250");
    expect(validateHeight("wysoki")).toBe("Wpisz liczbę, np. 178");
  });

  test("mass is 30 to 300 kg", () => {
    expect(validateMass("72,5")).toBeNull();
    expect(validateMass("29")).toContain("od 30 do 300");
    expect(validateMass("301")).toContain("od 30 do 300");
  });

  test("circumference is 40 to 200 cm", () => {
    expect(validateCircumference("40")).toBeNull();
    expect(validateCircumference("201")).toContain("od 40 do 200");
  });

  test("display name is at most 40 characters", () => {
    expect(validateDisplayName("Ola")).toBeNull();
    expect(validateDisplayName("x".repeat(41))).toContain("40");
  });
});

describe("birth date", () => {
  const today = "2026-11-07";

  test("age counts full years", () => {
    expect(ageOn("2000-11-07", today)).toBe(26);
    expect(ageOn("2000-11-08", today)).toBe(25);
    expect(ageOn("2008-02-29", "2026-02-28")).toBe(17);
    expect(ageOn("2008-02-29", "2026-03-01")).toBe(18);
  });

  test("accepts ages from 13 to 100", () => {
    expect(validateBirthDate("", today)).toBeNull();
    expect(validateBirthDate("2013-11-07", today)).toBeNull();
    expect(validateBirthDate("2013-11-08", today)).toContain("od 13 do 100");
    expect(validateBirthDate("1925-11-08", today)).toBeNull();
    expect(validateBirthDate("1925-11-07", today)).toContain("od 13 do 100");
    expect(validateBirthDate("2030-01-01", today)).toContain("od 13 do 100");
    expect(validateBirthDate("2001-02-30", today)).toContain("dd.mm.rrrr");
  });

  test("picker bounds match the rule", () => {
    const { min, max } = birthDateBounds(today);
    expect(max).toBe("2013-11-07");
    expect(min).toBe("1925-11-08");
    expect(validateBirthDate(min, today)).toBeNull();
    expect(validateBirthDate(max, today)).toBeNull();
  });

  test("formats age in Polish", () => {
    expect(formatAge(13)).toBe("13 lat");
    expect(formatAge(22)).toBe("22 lata");
    expect(formatAge(24)).toBe("24 lata");
    expect(formatAge(25)).toBe("25 lat");
    expect(formatAge(100)).toBe("100 lat");
  });
});

describe("nameToAddress", () => {
  test("uses the first word", () => {
    expect(nameToAddress("  Ola Nowak ")).toBe("Ola");
    expect(nameToAddress("Ola")).toBe("Ola");
  });

  test("gives nothing for an empty or very long name", () => {
    expect(nameToAddress("   ")).toBe("");
    expect(nameToAddress("Brzęczyszczykiewicz")).toBe("");
  });
});
