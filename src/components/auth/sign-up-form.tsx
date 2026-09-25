"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction, type AuthFormState } from "@/lib/auth/actions";
import { ROLE_BLURB, type TeamRole } from "@/lib/rbac/roles";
import { cn } from "@/lib/cn";

const initial: AuthFormState = {};

const CHOICES: { id: TeamRole; label: string; enabled: boolean }[] = [
  { id: "owner", label: "Owner", enabled: true },
  { id: "admin", label: "Admin", enabled: false },
  { id: "member", label: "Member", enabled: true },
  { id: "viewer", label: "Viewer", enabled: true },
];

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpAction, initial);
  const [access, setAccess] = useState<TeamRole>("owner");

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Your name"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          inputMode="email"
          placeholder="you@agily.com"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>

      <fieldset>
        <legend className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.16em] text-paper/50">
          Access
        </legend>
        <div className="grid grid-cols-1 gap-2">
          {CHOICES.map((choice) => {
            const selected = access === choice.id && choice.enabled;
            return (
              <label
                key={choice.id}
                className={cn(
                  "rounded-2xl border px-4 py-3",
                  choice.enabled
                    ? "cursor-pointer border-paper/10"
                    : "cursor-not-allowed border-paper/5 opacity-45",
                  selected && "border-copper/80 bg-copper/10",
                )}
              >
                <input
                  type="radio"
                  name="access"
                  value={choice.id}
                  className="sr-only"
                  disabled={!choice.enabled}
                  checked={choice.enabled ? access === choice.id : false}
                  onChange={() => {
                    if (choice.enabled) setAccess(choice.id);
                  }}
                />
                <span className="block text-sm font-medium text-paper">
                  {choice.label}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-paper/50">
                  {choice.enabled
                    ? ROLE_BLURB[choice.id]
                    : "An owner grants this later. You cannot pick it here."}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {access === "owner" ? (
        <div>
          <Label htmlFor="teamName">Studio name</Label>
          <Input
            id="teamName"
            name="teamName"
            type="text"
            required
            placeholder="Northwind"
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="joinToken">Join link (optional)</Label>
          <Input
            id="joinToken"
            name="joinToken"
            type="text"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Paste /join/… if you already have it"
          />
        </div>
      )}

      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button className="min-h-12 w-full" disabled={pending}>
        {pending
          ? "Creating…"
          : access === "owner"
            ? "Start studio"
            : "Create account"}
      </Button>
      <p className="text-center text-sm text-paper/45">
        Already have a key?{" "}
        <Link href="/signin" className="text-copper hover:text-copper-bright">
          Sign in
        </Link>
      </p>
    </form>
  );
}
