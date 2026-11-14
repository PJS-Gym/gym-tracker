import { describe, expect, test } from "bun:test";
import {
  formatDay,
  formatDayMonth,
  formatKg,
  formatMonth,
  formatNumber,
  formatRange,
  formatRelativeDay,
  formatSet,
  formatWeekdayShort,
  formatWeight,
  plural,
  setsLabel,
  todayInWarsaw,
  workoutsLabel,
} from "./format";

describe("plural", () => {
  test("picks the Polish form", () => {
    expect([1, 2, 4, 5, 11, 12, 14, 22, 25, 112].map((n) => plural(n, "a", "b", "c")).join("")).toBe("abbccccbcc");
  });

  test("fractions take the many form", () => {
    expect(setsLabel(12.5)).toBe("12,5 serii");
  });

  test("labels", () => {
    expect(workoutsLabel(1)).toBe("1 trening");
    expect(workoutsLabel(3)).toBe("3 treningi");
    expect(workoutsLabel(0)).toBe("0 treningów");
  });
});

test("numbers use a Polish comma and group thousands", () => {
  expect(formatNumber(84)).toBe("84");
  expect(formatNumber(7.5)).toBe("7,5");
  expect(formatKg(24725.4).replace(/\s/g, " ")).toBe("24 725 kg");
});

describe("dates", () => {
  test("relative days", () => {
    expect(formatRelativeDay("2026-11-13", "2026-11-13")).toBe("Dziś");
    expect(formatRelativeDay("2026-11-12", "2026-11-13")).toBe("Wczoraj");
    expect(formatRelativeDay("2026-11-10", "2026-11-13")).toBe("wtorek, 10 listopada");
  });

  test("ranges", () => {
    expect(formatRange("2026-11-09", "2026-11-15")).toBe("9–15 listopada");
    expect(formatRange("2026-10-27", "2026-11-02")).toBe("27 października – 2 listopada");
    expect(formatRange("2026-11-09", "2026-11-09")).toBe("9 listopada");
  });

  test("short weekdays", () => {
    expect(["2026-11-09", "2026-11-11", "2026-11-15"].map(formatWeekdayShort)).toEqual(["Pn", "Śr", "Nd"]);
  });

  test("today in Warsaw crosses midnight before UTC does", () => {
    expect(todayInWarsaw(new Date("2026-11-15T23:30:00Z"))).toBe("2026-11-16");
    expect(todayInWarsaw(new Date("2026-11-15T22:30:00Z"))).toBe("2026-11-15");
  });
});

describe("weights and short dates", () => {
  test("weights keep up to two decimals with a comma", () => {
    expect(formatWeight(82.25)).toBe("82,25");
    expect(formatWeight(80)).toBe("80");
    expect(formatSet(82.5, 8)).toBe("82,5\u00a0kg × 8");
  });

  test("short and month dates", () => {
    expect(formatDayMonth("2026-11-13")).toBe("13 lis");
    expect(formatDay("2026-11-03")).toBe("3 listopada");
    expect(formatMonth("2026-11-13")).toBe("listopad 2026");
  });
});
