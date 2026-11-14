"use client";

import { useSignIn } from "@clerk/nextjs";
import { type FormEvent, type ReactNode, useState } from "react";
import { Button, ProgressBar, TextField, Toast, ToastRegion } from "@/design-system";
import { type AuthProblem, describeAuthError } from "./auth-errors";

type Navigate = NonNullable<NonNullable<Parameters<ReturnType<typeof useSignIn>["signIn"]["finalize"]>[0]>["navigate"]>;

/** What `finalize()` calls once the session is active: opens `target` inside the app. */
export function navigateTo(push: (url: string) => void, target: string): Navigate {
  return ({ decorateUrl }) => {
    const url = decorateUrl(target);
    if (url.startsWith("http")) window.location.href = url;
    else push(url);
  };
}

export function AuthHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="grid gap-2">
      <h1 className="pjs-display m-0 text-display-m">{title}</h1>
      {children && <p className="m-0 text-fg-2">{children}</p>}
    </header>
  );
}

/** One screen of an auth flow. The key restarts the arrival motion when the screen changes. */
export function AuthStep({ children }: { children: ReactNode }) {
  return <div className="step-in grid w-full grid-cols-[minmax(0,1fr)] gap-6">{children}</div>;
}

/** Problems that belong to no single field. */
export function AuthNotice({ message }: { message: string | null }) {
  return <ToastRegion className="fixed!" offset={24}>{message && <Toast tone="danger" message={message} />}</ToastRegion>;
}

type PasswordFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  label?: string;
  hint?: string;
  autoComplete: "current-password" | "new-password";
  /** Sits next to "Pokaż hasło", e.g. the password reset link. */
  aside?: ReactNode;
  /** Shows how far the password is towards this length. */
  minLength?: number;
};

// The password policy set for this app in Clerk.
export const PASSWORD_MIN_LENGTH = 15;

export function PasswordField({ value, onValueChange, error, label = "Hasło", hint, autoComplete, aside, minLength }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="grid gap-1">
      <TextField
        id="auth-password"
        label={label}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onValueChange={onValueChange}
        hint={hint}
        error={error}
      />
      {minLength && (
        <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <ProgressBar
            value={Math.min(value.length, minLength)}
            max={minLength}
            label="Długość hasła"
            valueText={`${value.length} z ${minLength} znaków`}
            height={4}
          />
          <span aria-hidden="true" className="text-caption text-fg-2 tabular-nums">
            {value.length}/{minLength}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" className="-ml-4" onClick={() => setVisible(!visible)} aria-pressed={visible}>
          {visible ? "Ukryj hasło" : "Pokaż hasło"}
        </Button>
        {aside}
      </div>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-caption text-fg-2">
      <span className="border-t border-line" />
      lub
      <span className="border-t border-line" />
    </div>
  );
}

/** Google sign-in. Signs up too, when Clerk does not know the account yet. */
export function GoogleButton({ getNext, onProblem }: { getNext: () => string; onProblem: (problem: AuthProblem) => void }) {
  const { signIn, fetchStatus } = useSignIn();

  async function start() {
    const next = getNext();
    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: next,
      redirectCallbackUrl: `/sso-callback?next=${encodeURIComponent(next)}`,
    });
    if (error) onProblem(describeAuthError(error));
  }

  return (
    <Button variant="outline" size="lg" fullWidth onClick={start} disabled={fetchStatus === "fetching"}>
      Kontynuuj z Google
    </Button>
  );
}

type CodeStepProps = {
  email: string;
  /** Resolves to the problem, or to null when the code was accepted. */
  onVerify: (code: string) => Promise<AuthProblem | null>;
  onResend: () => Promise<AuthProblem | null>;
  onBack: () => void;
  busy: boolean;
};

const CODE_LENGTH = 6;

/** Enter the six-digit code from the email: one big box per digit, sent as soon as the last one is in. */
export function CodeStep({ email, onVerify, onResend, onBack, busy }: CodeStepProps) {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(true);
  const [problem, setProblem] = useState<AuthProblem | null>(null);
  const [resent, setResent] = useState(false);
  const fieldError = problem?.field === "code" ? problem.message : undefined;

  async function verify(value: string) {
    setProblem(await onVerify(value));
  }

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digits);
    setResent(false);
    if (problem) setProblem(null);
    if (digits.length === CODE_LENGTH && !busy) verify(digits);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.length < CODE_LENGTH) {
      setProblem({ field: "code", message: "Wpisz wszystkie 6 cyfr z maila." });
      return;
    }
    verify(code);
  }

  async function handleResend() {
    setCode("");
    const result = await onResend();
    setProblem(result);
    setResent(result === null);
  }

  const activeBox = Math.min(code.length, CODE_LENGTH - 1);
  const edge = (box: number) =>
    fieldError ? "var(--status-danger)" : focused && box === activeBox ? "var(--focus)" : "var(--border-control)";

  return (
    <AuthStep>
      <AuthHeading title="Sprawdź maila">{email ? `Wysłaliśmy kod na ${email}.` : "Wysłaliśmy ci kod."}</AuthHeading>
      <form noValidate onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-1.5">
          <label htmlFor="auth-code" className="pjs-vh">
            Kod z maila
          </label>
          <div className="relative grid grid-cols-6 gap-2">
            {Array.from({ length: CODE_LENGTH }, (_, box) => (
              <span
                key={box}
                aria-hidden="true"
                style={{ borderColor: edge(box), transition: "border-color var(--dur-fast) var(--ease-standard)" }}
                className="flex h-16 items-center justify-center rounded-[14px] border-2 border-solid text-title-l font-extrabold tabular-nums"
              >
                {code[box] ?? ""}
              </span>
            ))}
            <input
              id="auth-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              enterKeyHint="done"
              autoFocus
              value={code}
              onChange={(event) => handleChange(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-invalid={fieldError ? true : undefined}
              aria-describedby={fieldError ? "auth-code-error" : undefined}
              className="absolute inset-0 size-full cursor-text opacity-0"
            />
          </div>
          {fieldError && (
            <span id="auth-code-error" role="alert" className="text-label font-semibold text-fg-danger">
              {fieldError}
            </span>
          )}
          {resent && !fieldError && <span className="text-label text-fg-2">Nowy kod jest już w drodze.</span>}
        </div>
        <Button type="submit" size="lg" fullWidth disabled={busy} aria-busy={busy || undefined}>
          {busy ? "Sprawdzamy…" : "Potwierdź"}
        </Button>
      </form>
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" className="-ml-4" onClick={onBack} disabled={busy}>
          Zmień adres
        </Button>
        <Button variant="ghost" size="sm" className="-mr-4" onClick={handleResend} disabled={busy}>
          Wyślij nowy kod
        </Button>
      </div>
      <AuthNotice message={problem && problem.field === null ? problem.message : null} />
    </AuthStep>
  );
}
