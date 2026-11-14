import { describe, expect, test } from "bun:test";
import type { Exercise } from "@/lib/exercises";
import { filterExercises, NO_FILTERS, normalize, stem } from "./search";

const exercise = (id: number, name: string, name_en: string, overrides: Partial<Exercise> = {}): Exercise => ({
  id,
  name,
  name_en,
  equipment: "barbell",
  equipment_pl: "sztanga",
  own: false,
  primary: ["chest"],
  secondary: [],
  ...overrides,
});

const bench = exercise(1, "Wyciskanie sztangi na ławce płaskiej (chwyt średni)", "Barbell Bench Press - Medium Grip");
const row = exercise(2, "Wiosłowanie hantlem", "One-Arm Dumbbell Row", { equipment: "dumbbell", primary: ["upper_back"] });
const pullover = exercise(3, "Przenoszenie hantla za głowę", "Bent-Arm Dumbbell Pullover", { equipment: "dumbbell", primary: ["chest"], secondary: ["upper_back"] });
const mine = exercise(4, "Pompki na poręczach z plecakiem", "Pompki na poręczach z plecakiem", { equipment: null, own: true, primary: ["chest"] });
const all = [bench, row, pullover, mine];

const ids = (found: Exercise[]) => found.map((e) => e.id);

describe("normalize", () => {
  test("drops case and Polish marks", () => {
    expect(normalize("Ławka ŻÓŁĆ")).toBe("lawka zolc");
  });
});

describe("stem", () => {
  test("drops the ending and undoes the k/c alternation", () => {
    expect(["lawka", "lawki", "lawce"].map(stem)).toEqual(["lawk", "lawk", "lawk"]);
    expect(stem("klatcz")).toBe("klatcz");
  });
});

describe("filterExercises", () => {
  test("finds the bench press in Polish and in English", () => {
    expect(ids(filterExercises(all, { ...NO_FILTERS, query: "wyciskanie" }))).toEqual([1]);
    expect(ids(filterExercises(all, { ...NO_FILTERS, query: "bench" }))).toEqual([1]);
  });

  test("ignores case and Polish marks", () => {
    expect(ids(filterExercises(all, { ...NO_FILTERS, query: "lawce" }))).toEqual([1]);
    expect(ids(filterExercises(all, { ...NO_FILTERS, query: "ŁAWCE" }))).toEqual([1]);
  });

  test("finds a word in another grammatical form", () => {
    // The name says "na ławce"; people type "ławka" or "lawka".
    expect(ids(filterExercises(all, { ...NO_FILTERS, query: "lawka" }))).toEqual([1]);
    expect(ids(filterExercises(all, { ...NO_FILTERS, query: "ławka" }))).toEqual([1]);
    expect(ids(filterExercises(all, { ...NO_FILTERS, query: "hantle" }))).toEqual([2, 3]);
    expect(ids(filterExercises(all, { ...NO_FILTERS, query: "sztangą" }))).toEqual([1]);
  });

  test("matches every word from the start of a word", () => {
    expect(ids(filterExercises(all, { ...NO_FILTERS, query: "wycisk ławce" }))).toEqual([1]);
    expect(ids(filterExercises(all, { ...NO_FILTERS, query: "isk" }))).toEqual([]);
  });

  test("combines the muscle group and equipment filters", () => {
    // Upper back as a primary group and dumbbells: the row, not the pullover where it is secondary.
    expect(ids(filterExercises(all, { ...NO_FILTERS, muscle: "upper_back", equipment: "dumbbell" }))).toEqual([2]);
    expect(ids(filterExercises(all, { ...NO_FILTERS, muscle: "chest", equipment: "dumbbell" }))).toEqual([3]);
  });

  test("names that begin with the query come first", () => {
    const alternating = exercise(5, "Naprzemienne wyciskanie hantli", "Alternating Dumbbell Press");
    expect(ids(filterExercises([alternating, bench], { ...NO_FILTERS, query: "wyciskanie" }))).toEqual([1, 5]);
  });

  test("only mine shows the member's own exercises", () => {
    expect(ids(filterExercises(all, { ...NO_FILTERS, mine: true }))).toEqual([4]);
    expect(ids(filterExercises(all, { ...NO_FILTERS, mine: true, query: "wyciskanie" }))).toEqual([]);
  });
});
