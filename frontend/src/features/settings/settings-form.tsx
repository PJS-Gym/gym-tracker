"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";
import { Button, Switch, Toast, ToastRegion } from "@/design-system";
import { updateProfile } from "@/features/profile/actions";
import {
  PROFILE_FIELDS,
  type ProfileErrors,
  type ProfileFieldName,
  ProfileFields,
  type ProfileValues,
  useToday,
  validateProfileField,
} from "@/features/profile/profile-fields";
import { parseDecimal, type Sex } from "@/features/profile/validation";
import { ThemeSwitch } from "@/features/theme/theme-switch";
import type { Profile } from "@/lib/profile";

const ID_PREFIX = "settings";

type Notice = { message: string; tone: "neutral" | "danger" };

const SAVE_FAILED = "Nie zapisaliśmy zmian. Sprawdź połączenie i spróbuj ponownie.";

function toValues(profile: Profile): ProfileValues {
  return {
    displayName: profile.display_name ?? "",
    birthDate: profile.birth_date ?? "",
    // Polish decimal comma; the field accepts both marks.
    heightCm: profile.height_cm === null ? "" : String(profile.height_cm).replace(".", ","),
  };
}

/** Settings: edit the profile, switch the weekly email. Both persist on the account. */
export function SettingsForm({ profile }: { profile: Profile }) {
  const today = useToday();
  const [values, setValues] = useState<ProfileValues>(() => toValues(profile));
  const [sex, setSex] = useState<Sex | null>(profile.sex);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [weeklyEmail, setWeeklyEmail] = useState(profile.weekly_report_email);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [saving, startSaving] = useTransition();

  // A toast without an action stays 4 s.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const saved = toValues(profile);
  const isDirty = sex !== profile.sex || PROFILE_FIELDS.some((name) => values[name].trim() !== saved[name]);

  function setValue(name: ProfileFieldName, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: validateProfileField(name, value, today) ?? undefined }));
    }
  }

  function checkField(name: ProfileFieldName) {
    setErrors((current) => ({ ...current, [name]: validateProfileField(name, values[name], today) ?? undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!today) return;
    const next: ProfileErrors = {};
    for (const name of PROFILE_FIELDS) {
      const message = validateProfileField(name, values[name], today);
      if (message) next[name] = message;
    }
    setErrors(next);
    const firstInvalid = PROFILE_FIELDS.find((name) => next[name]);
    if (firstInvalid) {
      document.getElementById(`${ID_PREFIX}-${firstInvalid}`)?.focus();
      return;
    }
    startSaving(async () => {
      const { ok } = await updateProfile({
        displayName: values.displayName.trim() || null,
        birthDate: values.birthDate || null,
        sex,
        heightCm: parseDecimal(values.heightCm),
      });
      setNotice(ok ? { message: "Profil zapisany", tone: "neutral" } : { message: SAVE_FAILED, tone: "danger" });
    });
  }

  // Saves at once; the switch flips back if the save fails.
  async function handleWeeklyEmail(on: boolean) {
    setWeeklyEmail(on);
    const { ok } = await updateProfile({ weeklyReportEmail: on });
    if (ok) {
      setNotice({ message: on ? "Raport tygodniowy włączony" : "Raport tygodniowy wyłączony", tone: "neutral" });
    } else {
      setWeeklyEmail(!on);
      setNotice({ message: SAVE_FAILED, tone: "danger" });
    }
  }

  return (
    <>
      <form noValidate onSubmit={handleSubmit} aria-labelledby="settings-profile" className="card grid gap-6 p-5 sm:p-7">
        <SectionTitle id="settings-profile" title="Profil" />
        <ProfileFields
          idPrefix={ID_PREFIX}
          values={values}
          errors={errors}
          sex={sex}
          today={today}
          onValueChange={setValue}
          onBlur={checkField}
          onSexChange={setSex}
        />
        <div className="border-t border-line pt-5">
          <Button type="submit" disabled={saving || !today || !isDirty} aria-busy={saving || undefined}>
            Zapisz profil
          </Button>
        </div>
      </form>

      <section aria-labelledby="settings-theme" className="card grid gap-5 p-5 sm:p-7">
        <SectionTitle id="settings-theme" title="Wygląd" body="Systemowy podąża za ustawieniem urządzenia." />
        <ThemeSwitch />
      </section>

      <section aria-labelledby="settings-email" className="card grid gap-4 p-5 sm:p-7">
        <SectionTitle id="settings-email" title="Powiadomienia" />
        <Switch
          label="Raport tygodniowy mailem"
          checked={weeklyEmail}
          onCheckedChange={handleWeeklyEmail}
          aria-describedby="settings-email-hint"
        />
        <p id="settings-email-hint" className="m-0 text-body-s text-fg-2">
          W poniedziałek wyślemy podsumowanie poprzedniego tygodnia na adres z konta.
        </p>
      </section>

      <section aria-labelledby="settings-units" className="card grid gap-1.5 p-5 sm:p-7">
        <SectionTitle id="settings-units" title="Jednostki" body="Aplikacja używa kilogramów i centymetrów." />
      </section>

      {/* Above the phone's 84px tab bar. */}
      <ToastRegion offset={100}>
        {notice && <Toast tone={notice.tone} message={notice.message} />}
      </ToastRegion>
    </>
  );
}

function SectionTitle({ id, title, body }: { id: string; title: string; body?: string }) {
  return (
    <div className="grid gap-1">
      <h2 id={id} className="m-0 text-title-m font-extrabold">
        {title}
      </h2>
      {body && <p className="m-0 text-body-s text-fg-2">{body}</p>}
    </div>
  );
}
