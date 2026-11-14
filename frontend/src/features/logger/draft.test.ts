import { describe, expect, test } from "bun:test";
import { type Draft, type DraftExercise, emptyDraft, fromWorkout, hasContent, nextSet, parseValue, summarize, toInput } from "./draft";

const set = (weight: number | null, reps: number | null, rpe: number | null = null) => ({ key: "s", weight, reps, rpe });
const exercise = (exerciseId: number, sets: ReturnType<typeof set>[]): DraftExercise => ({ key: `e${exerciseId}`, exerciseId, name: `E${exerciseId}`, sets });

describe("parseValue", () => {
  test("accepts a comma or a dot", () => {
    expect(parseValue("82,5", "weight")).toBe(82.5);
    expect(parseValue("82.25", "weight")).toBe(82.25);
    expect(parseValue(" 8 ", "reps")).toBe(8);
  });

  test("empty means no value", () => {
    expect(parseValue("", "rpe")).toBeNull();
  });

  test("keeps to each field's range and step", () => {
    expect(parseValue("0", "weight")).toBe(0);
    expect(parseValue("1000", "weight")).toBe(1000);
    expect(parseValue("1000,25", "weight")).toBe("invalid");
    expect(parseValue("82,3", "weight")).toBe("invalid");
    expect(parseValue("0", "reps")).toBe("invalid");
    expect(parseValue("101", "reps")).toBe("invalid");
    expect(parseValue("8,5", "reps")).toBe("invalid");
    expect(parseValue("7,5", "rpe")).toBe(7.5);
    expect(parseValue("7,3", "rpe")).toBe("invalid");
    expect(parseValue("10,5", "rpe")).toBe("invalid");
    expect(parseValue("abc", "reps")).toBe("invalid");
  });
});

describe("nextSet", () => {
  test("copies the previous set", () => {
    const next = nextSet(exercise(1, [set(60, 8, 8)]));
    expect([next.weight, next.reps, next.rpe]).toEqual([60, 8, 8]);
  });

  test("the first set starts from last time, or empty the first time", () => {
    const fromLast = nextSet(exercise(1, []), { exercise_id: 1, workout_date: "2026-11-10", reps: 8, weight_kg: 80 });
    expect([fromLast.weight, fromLast.reps, fromLast.rpe]).toEqual([80, 8, null]);
    const first = nextSet(exercise(1, []));
    expect([first.weight, first.reps]).toEqual([null, null]);
  });
});

describe("a draft becoming a workout", () => {
  const draft: Draft = {
    version: 1,
    date: "2026-11-14",
    note: "  ",
    exercises: [exercise(1, [set(60, 8), set(null, 8)]), exercise(2, [set(40, null)]), exercise(1, [set(50, 10, 7.5)])],
  };

  test("only complete sets are sent, and exercises without one are dropped", () => {
    expect(toInput(draft)).toEqual({
      workout_date: "2026-11-14",
      note: null,
      exercises: [
        { exercise_id: 1, sets: [{ reps: 8, weight_kg: 60, rpe: null }] },
        { exercise_id: 1, sets: [{ reps: 10, weight_kg: 50, rpe: 7.5 }] },
      ],
    });
  });

  test("the summary counts what will be saved and what will not", () => {
    expect(summarize(draft)).toEqual({ exercises: 2, sets: 2, incomplete: 2 });
  });

  test("an empty draft has nothing to keep", () => {
    expect(hasContent(emptyDraft("2026-11-14"))).toBe(false);
    expect(hasContent(draft)).toBe(true);
  });
});

describe("fromWorkout", () => {
  const workout = {
    note: "Dobrze",
    exercises: [{ exercise_id: 3, name: "Przysiad", sets: [{ reps: 5, weight_kg: 100, rpe: 8 }] }],
  };

  test("Powtórz takes the exercises and sets with a new date and no note", () => {
    const draft = fromWorkout(workout, "2026-11-14", false);
    expect(draft.date).toBe("2026-11-14");
    expect(draft.note).toBe("");
    expect(draft.exercises[0].sets.map((s) => [s.weight, s.reps, s.rpe])).toEqual([[100, 5, 8]]);
  });

  test("editing keeps the note", () => {
    expect(fromWorkout(workout, "2026-11-01", true).note).toBe("Dobrze");
  });
});
