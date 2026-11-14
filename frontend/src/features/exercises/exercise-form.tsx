"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { Button, Chip, TextField } from "@/design-system";
import type { Option } from "@/lib/exercises";
import { capitalize } from "@/lib/format";
import { type ExerciseInput, saveExercise } from "./actions";
import { cleanName, type ExerciseErrors, NAME_MAX, toggleGroup, validateExercise } from "./validation";

type Props = {
  /** Set when editing an existing own exercise. */
  id?: number;
  initial?: ExerciseInput;
  muscleGroups: Option[];
  equipment: Option[];
};

const EMPTY: ExerciseInput = { name: "", equipment: null, primary: [], secondary: [] };

/** Add or edit an own exercise (#10): a name, the equipment and the muscle groups it trains. */
export function ExerciseForm({ id, initial = EMPTY, muscleGroups, equipment }: Props) {
  const router = useRouter();
  const [input, setInput] = useState(initial);
  const [errors, setErrors] = useState<ExerciseErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  function update(next: ExerciseInput) {
    setInput(next);
    // After the first try, errors follow the fields as they are fixed.
    if (submitted) setErrors(validateExercise(next));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    const found = validateExercise(input);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setFailed(false);
    startTransition(async () => {
      const result = await saveExercise(id ?? null, { ...input, name: cleanName(input.name) });
      if (!result.ok) {
        setFailed(true);
        return;
      }
      router.replace(`/cwiczenia/${result.id}`, { transitionTypes: ["nav-forward"] });
    });
  }

  const groups = (role: "primary" | "secondary") =>
    muscleGroups.map((group) => (
      <Chip
        key={group.key}
        selected={input[role].includes(group.key)}
        onClick={() => update({ ...input, ...toggleGroup(input, role, group.key) })}
      >
        {capitalize(group.name_pl)}
      </Chip>
    ));

  return (
    <form noValidate onSubmit={submit} className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <TextField
        label="Nazwa"
        value={input.name}
        onValueChange={(name) => update({ ...input, name })}
        maxLength={NAME_MAX + 20}
        autoComplete="off"
        placeholder="Np. pompki na poręczach z plecakiem…"
        error={errors.name}
        hint={errors.name ? undefined : "Tak zobaczysz je na liście i w treningu."}
      />

      <fieldset className="m-0 grid gap-3 border-0 p-0">
        <legend className="mb-3 p-0 text-title-s font-bold">Sprzęt</legend>
        <div className="flex flex-wrap gap-2">
          <Chip selected={input.equipment === null} onClick={() => update({ ...input, equipment: null })}>
            Bez sprzętu
          </Chip>
          {equipment.map((option) => (
            <Chip
              key={option.key}
              selected={input.equipment === option.key}
              onClick={() => update({ ...input, equipment: option.key })}
            >
              {capitalize(option.name_pl)}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 grid gap-3 border-0 p-0" aria-describedby="primary-help">
        <legend className="mb-1 p-0 text-title-s font-bold">Partie główne</legend>
        <p id="primary-help" className={`m-0 text-body-s ${errors.primary ? "font-semibold text-fg-danger" : "text-fg-2"}`} role={errors.primary ? "alert" : undefined}>
          {errors.primary ?? "Co najmniej jedna. Każda seria liczy się im jako pełna seria."}
        </p>
        <div className="flex flex-wrap gap-2">{groups("primary")}</div>
      </fieldset>

      <fieldset className="m-0 grid gap-3 border-0 p-0">
        <legend className="mb-1 p-0 text-title-s font-bold">Partie pomocnicze</legend>
        <p className="m-0 text-body-s text-fg-2">Opcjonalnie. Liczą się jako pół serii. Partia nie może być jednocześnie główna.</p>
        <div className="flex flex-wrap gap-2">{groups("secondary")}</div>
      </fieldset>

      {failed && (
        <p role="alert" className="m-0 text-body-s font-semibold text-fg-danger">
          Nie udało się zapisać ćwiczenia. Sprawdź połączenie i spróbuj jeszcze raz.
        </p>
      )}
      <Button type="submit" size="lg" fullWidth disabled={pending}>
        {id ? "Zapisz zmiany" : "Dodaj ćwiczenie"}
      </Button>
    </form>
  );
}
