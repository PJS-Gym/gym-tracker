"use client";

import { useId, useSyncExternalStore } from "react";
import { AppIcon, type AppIconName } from "@/components/app-icons";
import { readPreference, THEME_EVENT, THEME_KEY, type ThemePreference, writePreference } from "./theme";

const OPTIONS: { value: ThemePreference; label: string; icon: AppIconName }[] = [
  { value: "light", label: "Jasny", icon: "sun" },
  { value: "dark", label: "Ciemny", icon: "moon" },
  { value: "system", label: "Systemowy", icon: "monitor" },
];

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => event.key === THEME_KEY && onChange();
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, readPreference, () => "system");
}

/**
 * Light, dark or follow the system. Native radios, so arrow keys move between them.
 * `compact` shows icons only (labels stay for screen readers), for the side menu.
 */
export function ThemeSwitch({ compact = false }: { compact?: boolean }) {
  const preference = useThemePreference();
  const name = useId();

  return (
    <fieldset className="m-0 flex min-w-0 gap-1 rounded-full border-0 bg-surface-raised p-1">
      <legend className="pjs-vh">Motyw</legend>
      {OPTIONS.map((option) => {
        const active = preference === option.value;
        return (
          <label
            key={option.value}
            title={compact ? option.label : undefined}
            className={`pjs-i relative flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full text-body-s font-bold transition-[background-color,color,box-shadow] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)] ${
              active ? "bg-surface-card text-fg dark:bg-[var(--surface-field)] shadow-[0_1px_2px_rgba(43,27,33,.1),0_4px_12px_-4px_rgba(43,27,33,.25)]" : "text-fg-2"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => writePreference(option.value)}
              className="absolute inset-0 m-0 cursor-pointer opacity-0"
            />
            <AppIcon name={option.icon} size={16} />
            <span className={compact ? "pjs-vh" : undefined}>{option.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
