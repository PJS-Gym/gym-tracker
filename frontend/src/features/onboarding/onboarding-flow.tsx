"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addTransitionType,
  type FormEvent,
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  ViewTransition,
} from "react";
import { Button, Icon, ProgressBar, Sheet, Toast, ToastRegion, TopBar } from "@/design-system";
import type { NumberMask } from "@/features/profile/number-mask";
import { rangeHint, SEX_OPTIONS, useToday } from "@/features/profile/profile-fields";
import {
  ageOn,
  birthDateBounds,
  formatAge,
  LIMITS,
  nameToAddress,
  parseDecimal,
  type Sex,
  todayIso,
  validateBirthDate,
  validateCircumference,
  validateDisplayName,
  validateHeight,
  validateMass,
} from "@/features/profile/validation";
import { completeOnboarding, type OnboardingData } from "./actions";
import { BirthDateWheels } from "./birth-date-wheels";
import { LargeTextField } from "./large-text-field";
import { MaskedNumberField } from "./masked-number-field";
import { MediaBackdrop } from "./media-backdrop";
import { clearDraft, markCameFromTutorial, readDraft, readProgress, saveDraft, saveProgress } from "./draft";

const STEPS = ["witaj", "imie", "urodziny", "plec", "wzrost", "masa", "obwody", "jak-to-dziala"] as const;
type Step = (typeof STEPS)[number];

// The questions, without the welcome screen and the tutorial.
const QUESTIONS = STEPS.slice(1, -1);

type FieldName = "displayName" | "birthDate" | "heightCm" | "massKg" | "chestCm" | "hipsCm";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Values = { displayName: "", birthDate: "", heightCm: "", massKg: "", chestCm: "", hipsCm: "" };

const STEP_FIELDS: Partial<Record<Step, FieldName[]>> = {
  imie: ["displayName"],
  urodziny: ["birthDate"],
  wzrost: ["heightCm"],
  masa: ["massKg"],
  obwody: ["chestCm", "hipsCm"],
};

const fieldId = (name: FieldName) => `onboarding-${name}`;

function validate(name: FieldName, value: string, today: string): string | null {
  switch (name) {
    case "displayName":
      return validateDisplayName(value);
    case "birthDate":
      return validateBirthDate(value, today);
    case "heightCm":
      return validateHeight(value);
    case "massKg":
      return validateMass(value);
    case "chestCm":
    case "hipsCm":
      return validateCircumference(value);
  }
}

function toData(values: Values, sex: Sex | null): OnboardingData {
  const massKg = parseDecimal(values.massKg);
  const chestCm = parseDecimal(values.chestCm);
  const hipsCm = parseDecimal(values.hipsCm);
  const hasMeasurement = massKg !== null || chestCm !== null || hipsCm !== null;
  return {
    displayName: values.displayName.trim() || null,
    birthDate: values.birthDate || null,
    sex,
    heightCm: parseDecimal(values.heightCm),
    firstMeasurement: hasMeasurement ? { date: todayIso(), massKg, chestCm, hipsCm } : null,
  };
}

function stepFromUrl(): Step {
  const hash = window.location.hash.slice(1);
  return STEPS.find((step) => step === hash) ?? "witaj";
}

const urlFor = (step: Step) => (step === "witaj" ? "/onboarding" : `/onboarding#${step}`);

// "cross-media" is listed first when a move goes between a video screen and the form.
const STEP_TRANSITION = {
  "cross-media": "step-cross",
  "step-forward": "step-forward",
  "step-back": "step-back",
  default: "none",
};

const clipFor = (step: Step) => (step === "witaj" ? "welcome" : step === "jak-to-dziala" ? "tutorial" : null);

const HEIGHT_MASK: NumberMask = { integers: 3, decimals: 1, max: LIMITS.heightCm.max };
const MASS_MASK: NumberMask = { integers: 3, decimals: 1, max: LIMITS.massKg.max };
const CIRCUMFERENCE_MASK: NumberMask = { integers: 3, decimals: 1, max: LIMITS.circumferenceCm.max };

// The part the member acts on, centred in the space between the question and the button.
const ANSWER = "grid grid-cols-[minmax(0,1fr)] content-center gap-6";

const noopSubscribe = () => () => {};

type Mode = "guest" | "member";

/**
 * Welcome, one question per step, a short tutorial, then the account. A guest's answers wait in
 * this browser until sign-up (/sign-up, then /onboarding/zapisz); a member who is signed in but
 * has not onboarded saves straight to their account.
 */
export function OnboardingFlow({ mode }: { mode: Mode }) {
  // Answers and the step come from this browser, so the flow renders only once it runs there.
  const inBrowser = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return inBrowser ? <Flow mode={mode} /> : <div className="h-dvh bg-surface-app" />;
}

function Flow({ mode }: { mode: Mode }) {
  const router = useRouter();
  const today = useToday() ?? todayIso();
  const [step, setStep] = useState<Step>(stepFromUrl);
  const [values, setValues] = useState<Values>(() => ({ ...EMPTY, ...readProgress()?.values }));
  const [sex, setSex] = useState<Sex | null>(() => readProgress()?.sex ?? null);
  const [errors, setErrors] = useState<Errors>({});
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Steps this page added to the browser history, so "back" never leaves onboarding by accident.
  const historyDepth = useRef(0);

  const index = STEPS.indexOf(step);
  const questionNumber = QUESTIONS.indexOf(step) + 1;
  const name = nameToAddress(values.displayName);
  // The first and last screens play over video.
  const clip = clipFor(step);
  const isDirty = sex !== null || Object.values(values).some((value) => value.trim() !== "");
  const answered = step === "plec" ? sex !== null : (STEP_FIELDS[step] ?? []).some((field) => values[field].trim() !== "");

  useEffect(() => {
    saveProgress({ values, sex });
  }, [values, sex]);

  // Filled in as a guest, then signed in to an existing account instead of signing up: save that.
  useEffect(() => {
    if (mode === "member" && readDraft()) router.replace("/onboarding/zapisz");
  }, [mode, router]);

  // The answer field takes focus, so typing can start at once; otherwise the question does.
  useEffect(() => {
    const field = STEP_FIELDS[step]?.[0];
    const target = field && field !== "birthDate" ? document.getElementById(fieldId(field)) : headingRef.current;
    target?.focus({ preventScroll: true });
  }, [step]);

  // The browser's own back and forward buttons walk the steps too.
  useEffect(() => {
    function onPopState() {
      const next = stepFromUrl();
      const goingBack = STEPS.indexOf(next) < STEPS.indexOf(step);
      historyDepth.current = Math.max(0, historyDepth.current + (goingBack ? -1 : 1));
      show(next, goingBack ? "step-back" : "step-forward");
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- show only depends on step
  }, [step]);

  function show(next: Step, direction: "step-forward" | "step-back") {
    setErrors({});
    startTransition(() => {
      if (clipFor(next) !== clipFor(step)) addTransitionType("cross-media");
      addTransitionType(direction);
      setStep(next);
    });
  }

  function goForward(next: Step) {
    historyDepth.current += 1;
    window.history.pushState(window.history.state, "", urlFor(next));
    show(next, "step-forward");
  }

  function goBack() {
    if (historyDepth.current > 0) {
      window.history.back();
      return;
    }
    const previous = STEPS[index - 1];
    window.history.replaceState(window.history.state, "", urlFor(previous));
    show(previous, "step-back");
  }

  function setValue(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Once a field shows an error, re-check it as the member types so the message clears on fix.
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validate(field, value, today) ?? undefined }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === "jak-to-dziala") {
      finish();
      return;
    }
    const fields = STEP_FIELDS[step] ?? [];
    const next: Errors = {};
    for (const field of fields) {
      const message = validate(field, values[field], today);
      if (message) next[field] = message;
    }
    setErrors(next);
    const firstInvalid = fields.find((field) => next[field]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    goForward(STEPS[index + 1]);
  }

  function skipEverything() {
    setConfirmSkip(false);
    setValues(EMPTY);
    setSex(null);
    goForward("jak-to-dziala");
  }

  function finish() {
    const data = toData(values, sex);
    if (mode === "guest") {
      saveDraft(data);
      markCameFromTutorial();
      startTransition(() => {
        addTransitionType("cross-media");
        addTransitionType("step-forward");
        router.push("/sign-up");
      });
      return;
    }
    setSaveError(null);
    startSaving(async () => {
      clearDraft();
      // Opens the app on success; only a failure comes back.
      const result = await completeOnboarding(data);
      saveProgress({ values, sex });
      setSaveError(result.error);
    });
  }

  const numberField = (field: FieldName, label: string, unit: string, mask: NumberMask, hint: string, size?: "l") => (
    <MaskedNumberField
      id={fieldId(field)}
      label={label}
      unit={unit}
      mask={mask}
      value={values[field]}
      onValueChange={(value) => setValue(field, value)}
      hint={hint}
      error={errors[field]}
      size={size}
    />
  );

  const question = (text: string, intro?: string) => (
    <header className="grid gap-3">
      <h1 ref={headingRef} tabIndex={-1} className="pjs-display m-0 text-display-m outline-none md:text-display-l">
        {text}
      </h1>
      {intro && <p className="m-0 text-fg-2">{intro}</p>}
    </header>
  );

  // Address the member by name once they have given one.
  const askByName = (text: string) => (name ? `${name}, ${text.charAt(0).toLowerCase()}${text.slice(1)}` : text);

  function renderStep() {
    switch (step) {
      case "witaj":
        return question("Każdy trening się liczy", "Zapisuj serie, a co tydzień dostaniesz raport z tego, co naprawdę urosło. Najpierw kilka pytań. Każde możesz pominąć.");
      case "imie":
        return (
          <>
            {question("Jak mamy się do ciebie zwracać?")}
            <div className={ANSWER}>
              <LargeTextField
                id={fieldId("displayName")}
                label="Imię lub pseudonim"
                autoComplete="nickname"
                autoCapitalize="words"
                spellCheck={false}
                enterKeyHint="next"
                maxLength={LIMITS.displayName.max}
                placeholder="Maciej…"
                value={values.displayName}
                onValueChange={(value) => setValue("displayName", value)}
                hint="Pokażemy je na raporcie, jeśli go udostępnisz."
                error={errors.displayName}
              />
            </div>
          </>
        );
      case "urodziny": {
        const bounds = birthDateBounds(today);
        const problem = errors.birthDate ?? (values.birthDate ? validateBirthDate(values.birthDate, today) : null);
        const age = values.birthDate && !problem ? ageOn(values.birthDate, today) : null;
        return (
          <>
            {question(askByName("Kiedy masz urodziny?"))}
            <div className={ANSWER}>
              <BirthDateWheels
                id={fieldId("birthDate")}
                value={values.birthDate}
                min={bounds.min}
                max={bounds.max}
                onValueChange={(value) => setValue("birthDate", value)}
              >
                <div aria-live="polite" className="grid min-h-5 justify-items-center text-center">
                  {problem && (
                    <p role="alert" className="m-0 text-label font-semibold text-fg-danger">
                      {problem}
                    </p>
                  )}
                  {!problem && (
                    <p className="m-0 text-body-s text-fg-2 tabular-nums">
                      {age !== null ? `Masz ${formatAge(age)}.` : "Wiek policzymy sami."}
                    </p>
                  )}
                </div>
              </BirthDateWheels>
            </div>
          </>
        );
      }
      case "plec":
        return (
          <>
            {question("Jak się określasz?", "Nie pokażemy tego na publicznym raporcie.")}
            <div className={ANSWER}>
              <fieldset className="m-0 grid gap-3 border-0 p-0">
                <legend className="pjs-vh">Płeć</legend>
                {SEX_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      borderColor: sex === option.value ? "var(--focus)" : "var(--border-control)",
                      background: sex === option.value ? "var(--accent-soft)" : "var(--surface-card)",
                      color: sex === option.value ? "var(--text-on-accent-soft)" : "var(--text-1)",
                    }}
                    className="pjs-i flex min-h-14 items-center justify-between gap-3 rounded-[14px] border-2 border-solid px-4 font-bold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]"
                  >
                    <input
                      type="radio"
                      name="sex"
                      className="pjs-vh"
                      value={option.value}
                      checked={sex === option.value}
                      onChange={() => setSex(option.value)}
                    />
                    {option.label}
                    {sex === option.value && <Icon name="check" size={20} />}
                  </label>
                ))}
              </fieldset>
            </div>
          </>
        );
      case "wzrost":
        return (
          <>
            {question("Ile masz wzrostu?")}
            <div className={ANSWER}>
              {numberField("heightCm", "Wzrost", "cm", HEIGHT_MASK, rangeHint(LIMITS.heightCm, "cm"))}
            </div>
          </>
        );
      case "masa":
        return (
          <>
            {question(askByName("Ile dziś ważysz?"), "To twój punkt startu. Masy nie pokażemy na publicznym raporcie.")}
            <div className={ANSWER}>
              {numberField("massKg", "Masa", "kg", MASS_MASK, rangeHint(LIMITS.massKg, "kg"))}
            </div>
          </>
        );
      case "obwody":
        return (
          <>
            {question("A jak wyglądają obwody?", "Zmierz w najszerszym miejscu. Zmiany zobaczysz na ekranie Ciało.")}
            <div className={ANSWER}>
              <div className="grid grid-cols-2 items-start gap-3">
                {numberField("chestCm", "Klatka", "cm", CIRCUMFERENCE_MASK, rangeHint(LIMITS.circumferenceCm, "cm"), "l")}
                {numberField("hipsCm", "Biodra", "cm", CIRCUMFERENCE_MASK, rangeHint(LIMITS.circumferenceCm, "cm"), "l")}
              </div>
            </div>
          </>
        );
      case "jak-to-dziala":
        // Placeholder until the real tutorial exists.
        return (
          <>
            {question(name ? `${name}, tak to działa` : "Tak to działa")}
            <ol className="m-0 grid list-none content-start gap-6 p-0">
              {[
                ["Zapisuj treningi", "Ciężar i powtórzenia, seria po serii."],
                ["Śledź postępy", "Zobaczysz, które partie pracują najwięcej."],
                ["Odbieraj raport", "Co tydzień podsumujemy twoje wyniki."],
              ].map(([title, body]) => (
                <li key={title} className="grid gap-1">
                  <span className="text-title-m font-bold">{title}</span>
                  <span className="text-fg-2">{body}</span>
                </li>
              ))}
            </ol>
          </>
        );
    }
  }

  const isQuestion = questionNumber > 0;
  const submitLabel =
    step === "witaj"
      ? "Zaczynamy"
      : step === "jak-to-dziala"
        ? mode === "guest"
          ? "Załóż konto"
          : "Zapisz i zacznij"
        : answered
          ? "Dalej"
          : "Pomiń";

  return (
    <div data-surface={clip ? "media" : undefined} className="relative isolate flex h-dvh flex-col bg-surface-app">
      {clip && (
        <ViewTransition key={clip} enter="media" exit="media" default="none">
          <MediaBackdrop clip={clip} />
        </ViewTransition>
      )}
      <TopBar
        tone={clip ? "overMedia" : "default"}
        leading={
          step === "witaj" ? undefined : (
            <TopBar.Action icon="chevron-left" label="Wróć do poprzedniego kroku" onClick={goBack} />
          )
        }
        trailing={
          isQuestion ? (
            <Button variant="ghost" size="sm" onClick={() => (isDirty ? setConfirmSkip(true) : skipEverything())}>
              Pomiń wszystko
            </Button>
          ) : undefined
        }
      />

      <div className="mx-auto grid h-5 w-full max-w-[560px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-gutter">
        {isQuestion && (
          <>
            <ProgressBar variant="segmented" value={questionNumber} max={QUESTIONS.length} label="Postęp onboardingu" valueText={`Pytanie ${questionNumber} z ${QUESTIONS.length}`} />
            <span aria-hidden="true" className="text-caption text-fg-2 tabular-nums">
              {questionNumber}/{QUESTIONS.length}
            </span>
          </>
        )}
      </div>

      <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <ViewTransition key={step} enter={STEP_TRANSITION} exit={STEP_TRANSITION} default="none">
            <div className={`mx-auto grid min-h-full w-full max-w-[560px] grid-cols-[minmax(0,1fr)] gap-6 px-gutter pt-10 pb-6 ${
                clip ? "content-end" : "grid-rows-[auto_1fr]"
              }`}>
              {renderStep()}
            </div>
          </ViewTransition>
        </main>

        <footer className="mx-auto grid w-full max-w-[560px] gap-4 px-gutter pt-3 pb-[calc(20px+env(safe-area-inset-bottom))]">
          <Button
            type="submit"
            size="lg"
            fullWidth
            variant={isQuestion && !answered ? "tonal" : "primary"}
            iconRight={isQuestion && !answered ? undefined : "chevron-right"}
            disabled={saving}
            aria-busy={saving || undefined}
          >
            {submitLabel}
          </Button>
          {step === "witaj" && mode === "guest" && (
            <p className="m-0 text-center text-body-s text-fg-2">
              Masz już konto? <Link href="/sign-in">Zaloguj się</Link>
            </p>
          )}
        </footer>
      </form>

      <ToastRegion offset={110}>{saveError && <Toast tone="danger" message={saveError} />}</ToastRegion>

      <Sheet open={confirmSkip} onOpenChange={setConfirmSkip} title="Pominąć wszystko?">
        <p className="m-0 text-center text-fg-2">Wpisanych danych nie zapiszemy. Uzupełnisz je później w Ustawieniach.</p>
        <Button size="lg" fullWidth onClick={skipEverything}>
          Pomiń wszystko
        </Button>
        <Button variant="tonal" size="lg" fullWidth onClick={() => setConfirmSkip(false)}>
          Wróć do pytań
        </Button>
      </Sheet>
    </div>
  );
}
