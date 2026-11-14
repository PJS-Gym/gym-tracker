"use client";

import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button, TextField } from "@/design-system";
import { type AuthProblem, describeAuthError, isEmail, safeRedirect } from "./auth-errors";
import { AuthHeading, AuthNotice, AuthStep, CodeStep, GoogleButton, navigateTo, OrDivider, PasswordField } from "./auth-ui";

/** Email and password, then a code from the email when Clerk does not recognise the device. */
export function SignInForm() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [problem, setProblem] = useState<AuthProblem | null>(null);
  const busy = fetchStatus === "fetching";

  // Back to the page the guest asked for, or to Start.
  const target = () => safeRedirect(params.get("redirect_url"), window.location.origin);

  async function enterApp(): Promise<AuthProblem | null> {
    const { error } = await signIn.finalize({ navigate: navigateTo(router.push, target()) });
    return error ? describeAuthError(error) : null;
  }

  async function sendDeviceCode(): Promise<AuthProblem | null> {
    const { error } = await signIn.mfa.sendEmailCode();
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
    const { error } = await signIn.password({ emailAddress: email.trim(), password });
    if (error) {
      setProblem(describeAuthError(error));
      return;
    }
    setProblem(signIn.status === "complete" ? await enterApp() : await sendDeviceCode());
  }

  async function verifyDeviceCode(code: string): Promise<AuthProblem | null> {
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) return describeAuthError(error);
    return enterApp();
  }

  if (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") {
    return (
      <CodeStep
        key="code"
        email={email}
        busy={busy}
        onVerify={verifyDeviceCode}
        onResend={sendDeviceCode}
        onBack={() => {
          setPassword("");
          signIn.reset();
        }}
      />
    );
  }

  return (
    <AuthStep key="credentials">
      <AuthHeading title="Dobrze cię widzieć">Zaloguj się i wracaj do treningu.</AuthHeading>
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
          autoComplete="current-password"
          error={problem?.field === "password" ? problem.message : undefined}
          aside={
            <Link href="/sign-in/reset" className="text-body-s font-bold">
              Nie pamiętasz hasła?
            </Link>
          }
        />
        <Button type="submit" size="lg" fullWidth disabled={busy} aria-busy={busy || undefined}>
          {busy ? "Logujemy…" : "Zaloguj się"}
        </Button>
      </form>
      <OrDivider />
      <GoogleButton getNext={target} onProblem={setProblem} />
      <p className="m-0 text-center text-body-s text-fg-2">
        Nie masz konta? <Link href="/onboarding">Zacznij tutaj</Link>
      </p>
      <AuthNotice message={problem && problem.field === null ? problem.message : null} />
    </AuthStep>
  );
}
