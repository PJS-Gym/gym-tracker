import { describe, expect, test } from "bun:test";
import { toggleGroup, validateExercise } from "./validation";

describe("validateExercise", () => {
  test("a name has 2 to 80 characters after trimming", () => {
    expect(validateExercise({ name: " P ", primary: ["chest"] }).name).toBe("Nazwa musi mieć od 2 do 80 znaków.");
    expect(validateExercise({ name: "x".repeat(81), primary: ["chest"] }).name).toBeDefined();
    expect(validateExercise({ name: "", primary: ["chest"] }).name).toBe("Wpisz nazwę ćwiczenia.");
    expect(validateExercise({ name: "Dipy", primary: ["chest"] })).toEqual({});
  });

  test("needs a primary muscle group", () => {
    expect(validateExercise({ name: "Dipy", primary: [] }).primary).toBe("Wybierz co najmniej jedną partię główną.");
  });
});

describe("toggleGroup", () => {
  test("a group moves between roles instead of being in both", () => {
    const roles = { primary: ["chest"], secondary: ["triceps"] };
    expect(toggleGroup(roles, "secondary", "chest")).toEqual({ primary: [], secondary: ["triceps", "chest"] });
    expect(toggleGroup(roles, "primary", "triceps")).toEqual({ primary: ["chest", "triceps"], secondary: [] });
    expect(toggleGroup(roles, "primary", "chest")).toEqual({ primary: [], secondary: ["triceps"] });
  });
});
