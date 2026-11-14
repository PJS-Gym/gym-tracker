"use client";

import { useSyncExternalStore } from "react";
import { SegmentedControl, TextField } from "@/design-system";
import {
  ageOn,
  birthDateBounds,
  formatAge,
  LIMITS,
  type Sex,
  todayIso,
  validateBirthDate,
  validateDisplayName,
  validateHeight,
} from "./validation";

export type ProfileFieldName = "displayName" | "birthDate" | "heightCm";
export type ProfileValues = Record<ProfileFieldName, string>;
export type ProfileErrors = Partial<Record<ProfileFieldName, string>>;

/** Top to bottom, so the first invalid field in this order gets focus on submit. */
export const PROFILE_FIELDS: ProfileFieldName[] = ["displayName", "birthDate", "heightCm"];

export const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "female", label: "Kobieta" },
  { value: "male", label: "Mężczyzna" },
  { value: "undisclosed", label: "Nie podaję" },
];

export const rangeHint = (range: { min: number; max: number }, unit: string) =>
  `Od ${range.min} do ${range.max} ${unit}.`;

export function validateProfileField(name: ProfileFieldName, value: string, today: string | null): string | null {
  switch (name) {
    case "displayName":
      return validateDisplayName(value);
    case "birthDate":
      return today ? validateBirthDate(value, today) : null;
    case "heightCm":
      return validateHeight(value);
  }
}

const noopSubscribe = () => () => {};

/** Today's date, known only in the browser (the server prerenders without a clock or time zone). */
export function useToday() {
  return useSyncExternalStore(noopSubscribe, () => todayIso(), () => null);
}

type Props = {
  /** Prefixes input ids, so a form can focus a field with `${idPrefix}-${name}`. */
  idPrefix: string;
  values: ProfileValues;
  errors: ProfileErrors;
  sex: Sex | null;
  today: string | null;
  onValueChange: (name: ProfileFieldName, value: string) => void;
  onBlur: (name: ProfileFieldName) => void;
  onSexChange: (sex: Sex | null) => void;
};

/** Name or nickname, birth date (age is computed, never typed), sex and height. Shared by onboarding and Settings. */
export function ProfileFields({ idPrefix, values, errors, sex, today, onValueChange, onBlur, onSexChange }: Props) {
  const bounds = today ? birthDateBounds(today) : undefined;
  const age = today && values.birthDate && !errors.birthDate ? ageOn(values.birthDate, today) : null;

  return (
    <>
      <TextField
        id={`${idPrefix}-displayName`}
        label="Imię lub pseudonim"
        autoComplete="nickname"
        enterKeyHint="next"
        placeholder="Np. Maciej…"
        value={values.displayName}
        onValueChange={(value) => onValueChange("displayName", value)}
        onBlur={() => onBlur("displayName")}
        hint="Pokażemy je na publicznym raporcie."
        error={errors.displayName}
      />
      <TextField
        id={`${idPrefix}-birthDate`}
        label="Data urodzenia"
        type="date"
        autoComplete="bday"
        min={bounds?.min}
        max={bounds?.max}
        value={values.birthDate}
        onValueChange={(value) => onValueChange("birthDate", value)}
        onBlur={() => onBlur("birthDate")}
        hint={age !== null ? `Masz ${formatAge(age)}.` : "Wiek policzymy z daty, nie trzeba go wpisywać."}
        error={errors.birthDate}
      />
      <div className="grid gap-1.5">
        <span aria-hidden="true" className="text-label font-semibold text-fg-2">
          Płeć
        </span>
        <SegmentedControl<Sex | "">
          label="Płeć"
          options={SEX_OPTIONS}
          value={sex ?? ""}
          onValueChange={(value) => onSexChange(value === "" ? null : value)}
        />
      </div>
      <TextField
        id={`${idPrefix}-heightCm`}
        label="Wzrost (cm)"
        inputMode="decimal"
        enterKeyHint="next"
        autoComplete="off"
        value={values.heightCm}
        onValueChange={(value) => onValueChange("heightCm", value)}
        onBlur={() => onBlur("heightCm")}
        hint={rangeHint(LIMITS.heightCm, "cm")}
        error={errors.heightCm}
      />
    </>
  );
}
