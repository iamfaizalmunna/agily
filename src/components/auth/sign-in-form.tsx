"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, type AuthFormState } from "@/lib/auth/actions";
import {
  DEMO_ACCOUNTS,
  DEMO_EMAIL_DOMAIN,
  DEMO_PASSWORD,
} from "@/lib/auth/demo-accounts";
import { demoLoginsEnabledClient } from "@/lib/demo/mode";
import { mobilePrimaryTouchClass } from "@/lib/ui/mobile";
import { cn } from "@/lib/cn";

const initial: AuthFormState = {};

export function SignInForm() {
  const [state, action, pending] = useActionState(signInAction, initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDemoLogins, setShowDemoLogins] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setShowDemoLogins(demoLoginsEnabledClient());
  }, []);

  function signInAs(demoEmail: string) {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    queueMicrotask(() => formRef.current?.requestSubmit());
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-5">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          data-testid="signin-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder={`you@${DEMO_EMAIL_DOMAIN}`}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          data-testid="signin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
          {state.retryAfterSeconds && state.retryAfterSeconds > 0 ? (
            <span className="mt-1 block text-paper/50">
              Retry window: {state.retryAfterSeconds}s
            </span>
          ) : null}
        </p>
      ) : null}
      <Button
        className={cn(mobilePrimaryTouchClass())}
        disabled={pending}
        data-testid="signin-submit"
      >
        {pending ? "Signing in…" : "Enter"}
      </Button>
      <p className="text-center text-sm text-paper/45">
        New here?{" "}
        <Link href="/signup" className="text-copper hover:text-copper-bright">
          Create an account
        </Link>
      </p>
      <p className="text-center text-xs text-paper/35">
        Have a join link? Open it on this phone — no email is sent.
      </p>

      {showDemoLogins ? (
        <div
          className="border-t border-paper/10 pt-5"
          data-testid="demo-accounts"
        >
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-paper/40">
            Demo accounts
          </p>
          <p className="mb-3 text-xs text-paper/35">
            Password for every row:{" "}
            <span className="font-mono text-paper/55">{DEMO_PASSWORD}</span>
          </p>
          <div className="flex flex-col gap-0.5">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                disabled={pending}
                data-testid={`demo-${account.role}`}
                onClick={() => signInAs(account.email)}
                className="flex min-h-11 items-center justify-between rounded-xl px-2 py-2 text-left text-xs transition-colors hover:bg-paper/5 disabled:opacity-40"
              >
                <span className="font-mono text-paper/70">{account.email}</span>
                <span className="uppercase tracking-[0.12em] text-paper/35">
                  {account.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}
