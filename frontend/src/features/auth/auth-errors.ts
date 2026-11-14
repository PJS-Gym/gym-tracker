// Clerk's error messages are in English, so the forms show these, chosen by Clerk's error code.

export type AuthField = "email" | "password" | "code";
export type AuthProblem = { field: AuthField | null; message: string };

const SOMETHING_WENT_WRONG = "Nie udało się. Sprawdź połączenie i spróbuj ponownie.";
const BAD_EMAIL = "Wpisz poprawny adres, np. maciej@przyklad.pl";

const PROBLEMS: Record<string, AuthProblem> = {
  form_identifier_not_found: { field: "email", message: "Nie znamy tego adresu. Sprawdź go albo załóż konto." },
  form_identifier_exists: { field: "email", message: "Konto z tym adresem już istnieje. Zaloguj się." },
  form_password_incorrect: { field: "password", message: "To hasło się nie zgadza. Spróbuj ponownie albo ustaw nowe." },
  form_password_length_too_short: { field: "password", message: "Hasło jest za krótkie. Użyj co najmniej 15 znaków." },
  form_password_not_strong_enough: { field: "password", message: "To hasło jest za słabe. Dodaj więcej znaków." },
  form_password_pwned: { field: "password", message: "To hasło wyciekło w innym serwisie. Ustaw inne." },
  strategy_for_user_invalid: { field: "password", message: "To konto nie ma hasła. Zaloguj się przez Google albo ustaw hasło." },
  form_code_incorrect: { field: "code", message: "Ten kod się nie zgadza. Sprawdź maila i wpisz go ponownie." },
  verification_expired: { field: "code", message: "Ten kod wygasł. Wyślij nowy." },
  verification_failed: { field: "code", message: "Za dużo prób z tym kodem. Wyślij nowy." },
  too_many_requests: { field: null, message: "Za dużo prób naraz. Odczekaj chwilę i spróbuj ponownie." },
  user_locked: { field: null, message: "Konto jest chwilowo zablokowane po kilku nieudanych próbach. Spróbuj później." },
};

type ClerkErrorShape = { errors?: { code?: string; meta?: { paramName?: string } }[] } | null | undefined;

/** Turns whatever Clerk reported into one Polish message, attached to the field it is about. */
export function describeAuthError(error: unknown): AuthProblem {
  const first = (error as ClerkErrorShape)?.errors?.[0];
  const code = first?.code ?? "";
  if (Object.hasOwn(PROBLEMS, code)) return PROBLEMS[code];

  if (code === "form_param_format_invalid" || code === "form_param_nil") {
    const param = first?.meta?.paramName ?? "";
    if (param === "email_address" || param === "identifier") return { field: "email", message: BAD_EMAIL };
    if (param === "password") return { field: "password", message: "Wpisz hasło." };
    if (param === "code") return { field: "code", message: "Wpisz kod z maila." };
  }
  return { field: null, message: SOMETHING_WENT_WRONG };
}

/**
 * Where to go after signing in. Only ever a page of this app: `redirect_url` comes from the
 * address bar, so a link to another site must not be able to send someone there.
 */
export function safeRedirect(value: string | null, origin: string, fallback = "/"): string {
  if (!value) return fallback;
  try {
    const url = new URL(value, origin);
    return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch {
    return fallback;
  }
}

export const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());
