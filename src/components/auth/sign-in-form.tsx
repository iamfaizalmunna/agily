"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, type AuthFormState } from "@/lib/auth/actions";

const initial: AuthFormState = {};

export function SignInForm() {
  const [state, action, pending] = useActionState(signInAction, initial);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="you@studio.local"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button className="min-h-12 w-full" disabled={pending}>
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
    </form>
  );
}
