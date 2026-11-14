"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { DetailBar } from "@/components/screen";
import { Button, Icon, IconButton, ListRow, Sheet, TextField, Toast, ToastRegion } from "@/design-system";
import { ExercisePicker } from "@/features/exercises/exercise-picker";
import { lastSets, saveWorkout } from "@/features/workouts/actions";
import type { Catalogue, LastSet } from "@/lib/exercises";
import { exercisesLabel, formatRelativeDay, formatSet, setsLabel } from "@/lib/format";
import {
  clearDraft,
  type Draft,
  type DraftExercise,
  type DraftSet,
  editDraftKey,
  emptyDraft,
  type Field,
  FIELD_HINT,
  hasContent,
  NEW_DRAFT_KEY,
  newExercise,
  nextSet,
  readDraft,
  summarize,
  toInput,
  writeDraft,
} from "./draft";
import { LogCell } from "./log-cell";
import { useWakeLock } from "./use-wake-lock";

type Props = {
  catalogue: Catalogue;
  today: string;
  /** Editing a finished workout (#13); otherwise a new one. */
  workoutId?: number;
  /** The workout as saved (edit), or the one being repeated ("Powtórz"). */
  initial?: Draft;
  /** "Dodaj do treningu" from an exercise's page. */
  addExerciseId?: number;
};

type Undo = { message: string; restore: (draft: Draft) => Draft };

const COLUMNS = "grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.85fr)_2.75rem]";

/**
 * The logger (#11), the screen used on the gym floor between sets. Everything is typed straight
 * into the rows, a new set starts with the previous one's values, and the workout is kept on the
 * phone after every change until it is finished. The same screen edits a finished workout (#13).
 */
const noopSubscribe = () => () => {};

export function WorkoutLogger(props: Props) {
  // The workout in progress lives in this browser, so the logger renders only once it runs there.
  const inBrowser = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return inBrowser ? <Logger {...props} /> : <LoggerPlaceholder />;
}

type Start = { draft: Draft; conflict: { stored: Draft; incoming: Draft } | null };

/** What was left on this phone, or the server's version; "Powtórz" over an unfinished workout asks first. */
function startingPoint({ catalogue, today, workoutId, initial, addExerciseId }: Props, storageKey: string): Start {
  const stored = readDraft(storageKey);
  let draft = stored ?? initial ?? emptyDraft(today);
  let conflict: Start["conflict"] = null;
  if (workoutId === undefined && initial && stored && hasContent(stored)) {
    conflict = { stored, incoming: initial };
    draft = stored;
  }
  const added = addExerciseId ? catalogue.exercises.find((e) => e.id === addExerciseId) : undefined;
  if (added) draft = { ...draft, exercises: [...draft.exercises, newExercise(added.id, added.name)] };
  return { draft, conflict };
}

/**
 * The logger (#11), the screen used on the gym floor between sets. Everything is typed straight
 * into the rows, a new set starts with the previous one's values, and the workout is kept on the
 * phone after every change until it is finished. The same screen edits a finished workout (#13).
 */
function Logger(props: Props) {
  const { catalogue, today, workoutId, initial, addExerciseId } = props;
  const router = useRouter();
  const editing = workoutId !== undefined;
  const storageKey = editing ? editDraftKey(workoutId) : NEW_DRAFT_KEY;
  const [start] = useState(() => startingPoint(props, storageKey));
  const [draft, setDraft] = useState<Draft>(start.draft);
  const [conflict, setConflict] = useState(start.conflict);
  const [last, setLast] = useState<Map<number, LastSet>>(new Map());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [finishOpen, setFinishOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [undo, setUndo] = useState<Undo | null>(null);
  const [invalid, setInvalid] = useState<Map<string, Field>>(new Map());
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  useWakeLock();

  // The added exercise or repeated workout is in the draft now; a reload must not add it again.
  useEffect(() => {
    if (addExerciseId || (initial && !editing)) window.history.replaceState(null, "", window.location.pathname);
  }, [addExerciseId, initial, editing]);

  // Kept on the phone after every change.
  useEffect(() => {
    if (!conflict) writeDraft(storageKey, draft);
  }, [draft, storageKey, conflict]);

  // "Ostatnio" for every exercise, from the latest workout before this one's date.
  const exerciseIds = useMemo(() => [...new Set(draft.exercises.map((e) => e.exerciseId))].sort().join(","), [draft]);
  const date = draft.date;
  useEffect(() => {
    if (!exerciseIds) return;
    let cancelled = false;
    lastSets(exerciseIds.split(",").map(Number), date, workoutId ?? null).then((sets) => {
      if (cancelled) return;
      const found = new Map(sets.map((set) => [set.exercise_id, set]));
      setLast(found);
      // An exercise added before last time was known starts with an untouched set: fill it in now.
      setDraft((current) => fillUntouched(current, found));
    });
    return () => {
      cancelled = true;
    };
  }, [exerciseIds, date, workoutId]);

  // An undo toast stays 8 seconds.
  useEffect(() => {
    if (!undo) return;
    const timer = setTimeout(() => setUndo(null), 8000);
    return () => clearTimeout(timer);
  }, [undo]);

  const update = useCallback((change: (draft: Draft) => Draft) => setDraft(change), []);
  const updateExercise = (key: string, change: (exercise: DraftExercise) => DraftExercise) =>
    update((d) => ({ ...d, exercises: d.exercises.map((e) => (e.key === key ? change(e) : e)) }));
  const updateSet = (exerciseKey: string, setKey: string, patch: Partial<DraftSet>) =>
    updateExercise(exerciseKey, (e) => ({ ...e, sets: e.sets.map((s) => (s.key === setKey ? { ...s, ...patch } : s)) }));

  const setValidity = useCallback((cell: string, field: Field, valid: boolean) => {
    setInvalid((current) => {
      if (valid === !current.has(cell)) return current;
      const next = new Map(current);
      if (valid) next.delete(cell);
      else next.set(cell, field);
      return next;
    });
  }, []);

  const summary = summarize(draft);
  const futureDate = draft.date > today;
  const menuExercise = draft.exercises.find((e) => e.key === menuFor);
  const menuIndex = menuExercise ? draft.exercises.indexOf(menuExercise) : -1;
  const backHref = editing ? `/treningi/${workoutId}` : "/";

  function removeSet(exercise: DraftExercise, set: DraftSet) {
    const index = exercise.sets.indexOf(set);
    updateExercise(exercise.key, (e) => ({ ...e, sets: e.sets.filter((s) => s.key !== set.key) }));
    setUndo({
      message: `Seria ${index + 1} usunięta`,
      restore: (d) => ({
        ...d,
        exercises: d.exercises.map((e) =>
          e.key === exercise.key && !e.sets.some((s) => s.key === set.key) ? { ...e, sets: [...e.sets.slice(0, index), set, ...e.sets.slice(index)] } : e,
        ),
      }),
    });
  }

  function removeExercise(exercise: DraftExercise) {
    const index = draft.exercises.indexOf(exercise);
    update((d) => ({ ...d, exercises: d.exercises.filter((e) => e.key !== exercise.key) }));
    setMenuFor(null);
    setUndo({
      message: `${exercise.name} usunięte`,
      restore: (d) => (d.exercises.some((e) => e.key === exercise.key) ? d : { ...d, exercises: [...d.exercises.slice(0, index), exercise, ...d.exercises.slice(index)] }),
    });
  }

  function move(exercise: DraftExercise, by: -1 | 1) {
    update((d) => {
      const index = d.exercises.findIndex((e) => e.key === exercise.key);
      const target = index + by;
      if (target < 0 || target >= d.exercises.length) return d;
      const exercises = [...d.exercises];
      [exercises[index], exercises[target]] = [exercises[target], exercises[index]];
      return { ...d, exercises };
    });
  }

  function finish() {
    setSaveError(null);
    startSaving(async () => {
      const result = await saveWorkout(workoutId ?? null, toInput(draft));
      if (!result.ok) {
        setSaveError(result.message);
        return;
      }
      clearDraft(storageKey);
      router.replace(`/treningi/${result.id}`, { transitionTypes: ["nav-forward"] });
    });
  }

  function discard() {
    clearDraft(storageKey);
    router.replace(backHref, { transitionTypes: ["nav-back"] });
  }

  return (
    <div className="pb-6">
      <DetailBar
        width="narrow"
        leading={
          <Link
            href={backHref}
            transitionTypes={["nav-back"]}
            aria-label={editing ? "Wróć do treningu, zmiany zostaną zachowane" : "Wróć, trening poczeka na dokończenie"}
            className="chrome pjs-i pjs-press pjs-press--icon flex size-11 shrink-0 items-center justify-center rounded-full text-fg no-underline shadow-[var(--card-shadow)] hover:no-underline"
          >
            <Icon name="chevron-left" size={22} />
          </Link>
        }
        title={editing ? "Edycja treningu" : "Nowy trening"}
        trailing={
          <Button size="sm" onClick={() => setFinishOpen(true)}>
            {editing ? "Zapisz" : "Zakończ"}
          </Button>
        }
      />

      <div className="mx-auto grid w-full max-w-2xl grid-cols-[minmax(0,1fr)] gap-5 px-gutter pt-1 md:px-10">
        <div className="grid gap-1">
          <TextField
            label="Data treningu"
            type="date"
            max={today}
            value={draft.date}
            onValueChange={(value) => value && update((d) => ({ ...d, date: value }))}
            error={futureDate ? "Trening nie może mieć daty z przyszłości." : undefined}
            hint={futureDate ? undefined : formatRelativeDay(draft.date, today) === "Dziś" ? "Dziś. Zaległy trening? Cofnij datę." : undefined}
          />
          <p className="m-0 text-body-s text-fg-2 tabular-nums" aria-live="polite">
            {exercisesLabel(draft.exercises.length)} · {setsLabel(summary.sets)}
          </p>
        </div>

        {draft.exercises.length === 0 && (
          <div className="grid justify-items-center gap-3 rounded-[24px] border-[1.5px] border-dashed border-[var(--border-dashed)] bg-surface-card/60 px-5 py-10 text-center">
            <p className="m-0 text-title-s font-bold">Jeszcze nie ma ćwiczeń</p>
            <p className="m-0 text-fg-2">Dodaj pierwsze ćwiczenie, a potem wpisuj serie między podejściami.</p>
          </div>
        )}

        {draft.exercises.map((exercise) => {
          const lastTime = last.get(exercise.exerciseId);
          return (
            <section key={exercise.key} aria-labelledby={`ex-${exercise.key}`} className="card row-in grid gap-3 p-4 sm:p-5">
              <div className="flex items-start gap-2">
                <div className="grid min-w-0 flex-1 gap-0.5 pt-2">
                  <h2 id={`ex-${exercise.key}`} className="m-0 text-title-s font-bold">
                    {exercise.name}
                  </h2>
                  {lastTime && (
                    <p className="m-0 text-body-s text-fg-2 tabular-nums">Ostatnio: {formatSet(lastTime.weight_kg, lastTime.reps)}</p>
                  )}
                </div>
                <IconButton icon="ellipsis" label={`Opcje: ${exercise.name}`} onClick={() => setMenuFor(exercise.key)} />
              </div>

              {exercise.sets.length > 0 && (
                <div role="table" aria-label={`${exercise.name}, serie`} className="grid gap-1.5">
                  <div role="row" className={`grid ${COLUMNS} items-center gap-1.5 text-label font-semibold text-fg-2`}>
                    <span role="columnheader" className="text-center">
                      <span aria-hidden="true">#</span>
                      <span className="pjs-vh">Seria</span>
                    </span>
                    <span role="columnheader" className="text-center">kg</span>
                    <span role="columnheader" className="text-center">Powt.</span>
                    <span role="columnheader" className="text-center">RPE</span>
                    <span role="columnheader">
                      <span className="pjs-vh">Usuń</span>
                    </span>
                  </div>
                  {exercise.sets.map((set, setIndex) => {
                    const name = `Seria ${setIndex + 1}`;
                    return (
                      <div key={set.key} role="row" className={`row-in grid ${COLUMNS} items-center gap-1.5`}>
                        <span role="cell" className="text-center font-bold tabular-nums">
                          {setIndex + 1}
                        </span>
                        {(["weight", "reps", "rpe"] as const).map((field) => (
                          <span role="cell" key={field}>
                            <LogCell
                              field={field}
                              value={set[field]}
                              label={`${name}, ${field === "weight" ? "ciężar w kg" : field === "reps" ? "powtórzenia" : "RPE, opcjonalnie"}`}
                              placeholder={field === "rpe" ? "–" : undefined}
                              onValueChange={(value) => updateSet(exercise.key, set.key, { [field]: value })}
                              onValidityChange={(valid) => setValidity(`${set.key}:${field}`, field, valid)}
                            />
                          </span>
                        ))}
                        <span role="cell" className="flex justify-center">
                          <IconButton icon="x" label={`Usuń serię ${setIndex + 1}`} size={40} onClick={() => removeSet(exercise, set)} className="text-fg-2" />
                        </span>
                      </div>
                    );
                  })}
                  <InvalidHint cells={invalid} setKeys={exercise.sets.map((s) => s.key)} />
                </div>
              )}

              <Button
                variant="tonal"
                size="sm"
                icon="plus"
                className="justify-self-start"
                onClick={() => updateExercise(exercise.key, (e) => ({ ...e, sets: [...e.sets, nextSet(e, lastTime)] }))}
                aria-label={`Dodaj serię: ${exercise.name}`}
              >
                Dodaj serię
              </Button>
            </section>
          );
        })}

        <Button variant="outline" icon="plus" fullWidth onClick={() => setPickerOpen(true)}>
          Dodaj ćwiczenie
        </Button>

        <label className="grid gap-2">
          <span className="text-label font-semibold text-fg-2">Notatka (opcjonalnie)</span>
          <textarea
            value={draft.note}
            onChange={(event) => {
              const note = event.target.value;
              update((d) => ({ ...d, note }));
            }}
            rows={3}
            maxLength={2000}
            placeholder="Jak poszło? Np. ostatnia seria ciężko, ale czysto…"
            className="pjs-field__box min-h-28 w-full resize-y rounded-[16px] px-[18px] py-3.5 font-[inherit] text-body text-fg outline-none"
          />
        </label>

        <Button size="lg" fullWidth onClick={() => setFinishOpen(true)}>
          {editing ? "Zapisz zmiany" : "Zakończ trening"}
        </Button>
      </div>

      <ExercisePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        catalogue={catalogue}
        onPick={(picked) =>
          update((d) => ({ ...d, exercises: [...d.exercises, ...picked.map((e) => newExercise(e.id, e.name, last.get(e.id)))] }))
        }
      />

      <Sheet open={!!menuExercise} onOpenChange={(open) => !open && setMenuFor(null)} title={menuExercise?.name}>
        {menuExercise && (
          <div className="-mx-2 grid">
            <ListRow icon="arrow-up" label="Przesuń w górę" disabled={menuIndex === 0} onClick={() => move(menuExercise, -1)} />
            <ListRow icon="arrow-down" label="Przesuń w dół" disabled={menuIndex === draft.exercises.length - 1} onClick={() => move(menuExercise, 1)} />
            <ListRow
              icon="plus"
              label="Dodaj to samo jeszcze raz"
              onClick={() => {
                update((d) => ({ ...d, exercises: [...d.exercises, newExercise(menuExercise.exerciseId, menuExercise.name, last.get(menuExercise.exerciseId))] }));
                setMenuFor(null);
              }}
            />
            <ListRow icon="trash-2" label="Usuń ćwiczenie" destructive onClick={() => removeExercise(menuExercise)} />
          </div>
        )}
      </Sheet>

      <Sheet open={finishOpen && !discardOpen} onOpenChange={setFinishOpen} title={editing ? "Zapisać zmiany?" : "Zakończyć trening?"}>
        <p className="m-0 text-center text-fg-2 tabular-nums">
          {exercisesLabel(summary.exercises)} · {setsLabel(summary.sets)}
        </p>
        {summary.incomplete > 0 && (
          <p className="m-0 text-center text-body-s font-semibold">
            {summary.incomplete === 1 ? "1 seria bez ciężaru albo powtórzeń nie zostanie zapisana." : `${setsLabel(summary.incomplete)} bez ciężaru albo powtórzeń nie zostanie zapisanych.`}
          </p>
        )}
        {summary.sets === 0 && (
          <p className="m-0 text-center text-body-s font-semibold text-fg-danger">Wpisz co najmniej jedną serię z ciężarem i powtórzeniami.</p>
        )}
        {futureDate && <p className="m-0 text-center text-body-s font-semibold text-fg-danger">Zmień datę: trening nie może być z przyszłości.</p>}
        {invalid.size > 0 && <p className="m-0 text-center text-body-s font-semibold text-fg-danger">Popraw pola zaznaczone na czerwono.</p>}
        {saveError && (
          <p role="alert" className="m-0 text-center text-body-s font-semibold text-fg-danger">
            {saveError}
          </p>
        )}
        <Button size="lg" fullWidth disabled={saving || summary.sets === 0 || futureDate || invalid.size > 0} onClick={finish}>
          {saving ? "Zapisuję…" : editing ? "Zapisz zmiany" : "Zakończ trening"}
        </Button>
        <Button variant="tonal" fullWidth onClick={() => setFinishOpen(false)}>
          {editing ? "Edytuj dalej" : "Trenuj dalej"}
        </Button>
        <Button variant="ghost" fullWidth className="text-fg-danger" onClick={() => setDiscardOpen(true)}>
          {editing ? "Odrzuć zmiany" : "Odrzuć trening"}
        </Button>
      </Sheet>

      <Sheet open={discardOpen} onOpenChange={setDiscardOpen} title={editing ? "Odrzucić zmiany?" : "Odrzucić ten trening?"}>
        <p className="m-0 text-center text-fg-2">
          {editing
            ? "Trening zostanie taki, jak był przed edycją."
            : `${summary.sets === 1 ? "1 seria zostanie usunięta" : `${setsLabel(summary.sets)} zostanie usuniętych`}. Tego nie da się cofnąć.`}
        </p>
        <Button variant="danger" size="lg" fullWidth onClick={discard}>
          {editing ? "Odrzuć zmiany" : "Odrzuć trening"}
        </Button>
        <Button
          variant="tonal"
          fullWidth
          onClick={() => {
            setDiscardOpen(false);
            setFinishOpen(false);
          }}
        >
          {editing ? "Zostaw zmiany" : "Zostaw trening"}
        </Button>
      </Sheet>

      <Sheet open={!!conflict} onOpenChange={() => {}} title="Masz niedokończony trening">
        {conflict && (
          <>
            <p className="m-0 text-center text-fg-2">
              Zacząć powtórkę? Niedokończony trening ({exercisesLabel(conflict.stored.exercises.length)}, {setsLabel(summarize(conflict.stored).sets)}) zostanie odrzucony.
            </p>
            <Button
              size="lg"
              fullWidth
              onClick={() => {
                setDraft(conflict.incoming);
                setConflict(null);
              }}
            >
              Zacznij powtórkę
            </Button>
            <Button variant="tonal" fullWidth onClick={() => setConflict(null)}>
              Wróć do niedokończonego
            </Button>
          </>
        )}
      </Sheet>

      <ToastRegion offset={96}>
        {undo && (
          <Toast
            message={undo.message}
            action={{
              label: "Cofnij",
              onAction: () => {
                update(undo.restore);
                setUndo(null);
              },
            }}
          />
        )}
      </ToastRegion>
    </div>
  );
}

function fillUntouched(draft: Draft, last: Map<number, LastSet>): Draft {
  let changed = false;
  const exercises = draft.exercises.map((exercise) => {
    const lastTime = last.get(exercise.exerciseId);
    const only = exercise.sets.length === 1 ? exercise.sets[0] : null;
    if (!lastTime || !only || only.weight !== null || only.reps !== null || only.rpe !== null) return exercise;
    changed = true;
    return { ...exercise, sets: [{ ...only, weight: lastTime.weight_kg, reps: lastTime.reps }] };
  });
  return changed ? { ...draft, exercises } : draft;
}

/** Says what a red cell needs, once per exercise. */
function InvalidHint({ cells, setKeys }: { cells: Map<string, Field>; setKeys: string[] }) {
  const field = setKeys.map((key) => (["weight", "reps", "rpe"] as const).find((f) => cells.has(`${key}:${f}`))).find(Boolean);
  if (!field) return null;
  return (
    <p role="alert" className="m-0 text-label font-semibold text-fg-danger">
      {FIELD_HINT[field]}
    </p>
  );
}

export function LoggerPlaceholder() {
  return (
    <div aria-hidden="true" className="mx-auto grid w-full max-w-2xl gap-6 px-gutter pt-16">
      <span className="placeholder-block h-14 rounded-[14px]" />
      <span className="placeholder-block h-40" />
      <span className="placeholder-block h-12 rounded-full" />
    </div>
  );
}
