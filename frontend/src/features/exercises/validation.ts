// Rules for an own exercise, the same as the backend's (backend/app/exercises.py).

export const NAME_MIN = 2;
export const NAME_MAX = 80;

export type ExerciseErrors = Partial<Record<"name" | "primary", string>>;

export const cleanName = (name: string) => name.split(/\s+/).filter(Boolean).join(" ");

export function validateExercise(input: { name: string; primary: string[] }): ExerciseErrors {
  const errors: ExerciseErrors = {};
  const name = cleanName(input.name);
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.name = name.length === 0 ? "Wpisz nazwę ćwiczenia." : `Nazwa musi mieć od ${NAME_MIN} do ${NAME_MAX} znaków.`;
  }
  if (input.primary.length === 0) errors.primary = "Wybierz co najmniej jedną partię główną.";
  return errors;
}

/** Tapping a group: in one role it leaves the other, so a group is never primary and secondary at once. */
export function toggleGroup(
  roles: { primary: string[]; secondary: string[] },
  role: "primary" | "secondary",
  key: string,
): { primary: string[]; secondary: string[] } {
  const other = role === "primary" ? "secondary" : "primary";
  const has = roles[role].includes(key);
  return {
    [role]: has ? roles[role].filter((k) => k !== key) : [...roles[role], key],
    [other]: roles[other].filter((k) => k !== key),
  } as { primary: string[]; secondary: string[] };
}
