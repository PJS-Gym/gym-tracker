export type ThemePreference = "light" | "dark" | "system";

export const THEME_KEY = "gym-tracker-motyw";
export const THEME_EVENT = "gym-tracker-motyw";

/**
 * Runs in <head> before the first paint, so a dark-theme member never sees a white flash. It also
 * keeps following the system setting while the preference is "system", and re-applies when the
 * switch changes the preference (THEME_EVENT) or another tab does (storage).
 */
export const THEME_SCRIPT = `(function(){
var k=${JSON.stringify(THEME_KEY)},d=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");
function pref(){try{var v=localStorage.getItem(k);return v==="light"||v==="dark"?v:"system"}catch(e){return "system"}}
function apply(){var p=pref(),dark=p==="dark"||(p==="system"&&m.matches);if(dark)d.setAttribute("data-theme","dark");else d.removeAttribute("data-theme");d.style.colorScheme=dark?"dark":"light"}
apply();m.addEventListener("change",apply);window.addEventListener(${JSON.stringify(THEME_EVENT)},apply);window.addEventListener("storage",function(e){if(e.key===k)apply()});
})();`;

export function readPreference(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function writePreference(preference: ThemePreference) {
  try {
    if (preference === "system") window.localStorage.removeItem(THEME_KEY);
    else window.localStorage.setItem(THEME_KEY, preference);
  } catch {
    // Private mode: the switch still works for this page view.
    document.documentElement.toggleAttribute("data-theme", preference === "dark");
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}
