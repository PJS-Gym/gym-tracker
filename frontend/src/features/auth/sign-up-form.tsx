"use client";

import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";
import { Button, TextField } from "@/design-system";
import { type AuthProblem, describeAuthError, isEmail } from "./auth-errors";
import { AuthHeading, AuthNotice, AuthStep, CodeStep, GoogleButton, navigateTo, OrDivider, PASSWORD_MIN_LENGTH, PasswordField } from "./auth-ui";

// Saves answers given during onboarding, or opens onboarding when there are none.
const AFTER_SIGN_UP = "/onboarding/zapisz";

type Props = { title: string; intro: ReactNode };

/** Email and password, then the code that proves the address. */
export function SignUpForm({ title, intro }: Props) {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [problem, setProblem] = useState<AuthProblem | null>(null);
  const busy = fetchStatus === "fetching";

  async function enterApp(): Promise<AuthProblem | null> {
    const { error } = await signUp.finalize({ navigate: navigateTo(router.push, AFTER_SIGN_UP) });
    return error ? describeAuthError(error) : null;
  }

  async function sendCode(): Promise<AuthProblem | null> {
    const { error } = await signUp.verifications.sendEmailCode();
    return error ? describeAuthError(error) : null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEmail(email)) {
      setProblem({ field: "email", message: "Wpisz poprawny adres, np. maciej@przyklad.pl" });
      return;
    }
    if (password === "") {
      setProblem({ field: "password", message: "Wpisz hasło." });
      return;
    }
    setProblem(null);
    const { error } = await signUp.password({ emailAddress: email.trim(), password });
    if (error) {
      setProblem(describeAuthError(error));
      return;
    }
    setProblem(signUp.status === "complete" ? await enterApp() : await sendCode());
  }

  async function verifyCode(code: string): Promise<AuthProblem | null> {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return describeAuthError(error);
    if (signUp.status === "complete") return enterApp();
    return describeAuthError(null);
  }

  // Read from Clerk rather than kept here, so a reload returns to the code screen.
  const awaitingCode =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  if (awaitingCode) {
    return (
      <CodeStep
        key="code"
        email={email || signUp.emailAddress || ""}
        busy={busy}
        onVerify={verifyCode}
        onResend={sendCode}
        onBack={() => {
          setPassword("");
          signUp.reset();
        }}
      />
    );
  }

  return (
    <AuthStep key="credentials">
      <AuthHeading title={title}>{intro}</AuthHeading>
      <form noValidate onSubmit={handleSubmit} className="grid gap-5">
        <TextField
          id="auth-email"
          label="Adres e-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          enterKeyHint="next"
          placeholder="Np. maciej@przyklad.pl…"
          value={email}
          onValueChange={setEmail}
          error={problem?.field === "email" ? problem.message : undefined}
        />
        <PasswordField
          value={password}
          onValueChange={setPassword}
          autoComplete="new-password"
          hint="Co najmniej 15 znaków. Wystarczy kilka słów."
          minLength={PASSWORD_MIN_LENGTH}
          error={problem?.field === "password" ? problem.message : undefined}
        />
        {/* Clerk mounts its bot check here when the instance has one turned on. */}
        <div id="clerk-captcha" />
        <Button type="submit" size="lg" fullWidth disabled={busy} aria-busy={busy || undefined}>
          {busy ? "Zakładamy konto…" : "Załóż konto"}
        </Button>
      </form>
      <OrDivider />
      <GoogleButton getNext={() => AFTER_SIGN_UP} onProblem={setProblem} />
      <p className="m-0 text-center text-body-s text-fg-2">
        Masz już konto? <Link href="/sign-in">Zaloguj się</Link>
      </p>
      <AuthNotice message={problem && problem.field === null ? problem.message : null} />
    </AuthStep>
  );
}
