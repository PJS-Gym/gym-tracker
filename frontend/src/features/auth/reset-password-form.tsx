"use client";

import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button, TextField } from "@/design-system";
import { type AuthProblem, describeAuthError, isEmail } from "./auth-errors";
import { AuthHeading, AuthNotice, AuthStep, CodeStep, navigateTo, PASSWORD_MIN_LENGTH, PasswordField } from "./auth-ui";

/** Email, then the code sent there, then a new password. */
export function ResetPasswordForm() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [password, setPassword] = useState("");
  const [problem, setProblem] = useState<AuthProblem | null>(null);
  const busy = fetchStatus === "fetching";

  async function sendCode(): Promise<AuthProblem | null> {
    const { error } = await signIn.resetPasswordEmailCode.sendCode();
    return error ? describeAuthError(error) : null;
  }

  async function handleEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEmail(email)) {
      setProblem({ field: "email", message: "Wpisz poprawny adres, np. maciej@przyklad.pl" });
      return;
    }
    setProblem(null);
    const { error } = await signIn.create({ identifier: email.trim() });
    if (error) {
      setProblem(describeAuthError(error));
      return;
    }
    const sendProblem = await sendCode();
    setProblem(sendProblem);
    setCodeSent(sendProblem === null);
  }

  async function verifyCode(code: string): Promise<AuthProblem | null> {
    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    return error ? describeAuthError(error) : null;
  }

  async function handleNewPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === "") {
      setProblem({ field: "password", message: "Wpisz nowe hasło." });
      return;
    }
    setProblem(null);
    const { error } = await signIn.resetPasswordEmailCode.submitPassword({ password, signOutOfOtherSessions: true });
    if (error) {
      setProblem(describeAuthError(error));
      return;
    }
    if (signIn.status !== "complete") {
      setProblem(describeAuthError(null));
      return;
    }
    const { error: finalizeError } = await signIn.finalize({ navigate: navigateTo(router.push, "/") });
    if (finalizeError) setProblem(describeAuthError(finalizeError));
  }

  if (signIn.status === "needs_new_password") {
    return (
      <AuthStep key="password">
        <AuthHeading title="Ustaw nowe hasło">Co najmniej 15 znaków. Wystarczy kilka słów.</AuthHeading>
        <form noValidate onSubmit={handleNewPassword} className="grid gap-5">
          <PasswordField
            label="Nowe hasło"
            value={password}
            onValueChange={setPassword}
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            error={problem?.field === "password" ? problem.message : undefined}
          />
          <Button type="submit" size="lg" fullWidth disabled={busy} aria-busy={busy || undefined}>
            {busy ? "Zapisujemy…" : "Zapisz hasło"}
          </Button>
        </form>
        <AuthNotice message={problem && problem.field === null ? problem.message : null} />
      </AuthStep>
    );
  }

  if (codeSent) {
    return (
      <CodeStep
        key="code"
        email={email}
        busy={busy}
        onVerify={verifyCode}
        onResend={sendCode}
        onBack={() => {
          setCodeSent(false);
          signIn.reset();
        }}
      />
    );
  }

  return (
    <AuthStep key="email">
      <AuthHeading title="Ustawmy nowe hasło">Podaj adres konta, a wyślemy na niego kod.</AuthHeading>
      <form noValidate onSubmit={handleEmail} className="grid gap-5">
        <TextField
          id="auth-email"
          label="Adres e-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Np. maciej@przyklad.pl…"
          value={email}
          onValueChange={setEmail}
          error={problem?.field === "email" ? problem.message : undefined}
        />
        <Button type="submit" size="lg" fullWidth disabled={busy} aria-busy={busy || undefined}>
          {busy ? "Wysyłamy…" : "Wyślij kod"}
        </Button>
      </form>
      <p className="m-0 text-center text-body-s text-fg-2">
        Pamiętasz hasło? <Link href="/sign-in">Zaloguj się</Link>
      </p>
      <AuthNotice message={problem && problem.field === null ? problem.message : null} />
    </AuthStep>
  );
}
