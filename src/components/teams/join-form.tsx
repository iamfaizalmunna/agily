"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { acceptInviteAction, type JoinFormState } from "@/lib/teams/join";

const initial: JoinFormState = {};

export function JoinForm({
  token,
  email,
  teamName,
  role,
  isNewUser,
}: {
  token: string;
  email: string;
  teamName: string;
  role: string;
  isNewUser: boolean;
}) {
  const [state, action, pending] = useActionState(acceptInviteAction, initial);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />
      <p className="text-sm leading-relaxed text-paper/55">
        {email} is invited to <span className="text-paper">{teamName}</span> as{" "}
        {role}.
      </p>
      {isNewUser ? (
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
      ) : null}
      <div>
        <Label htmlFor="password">
          {isNewUser ? "Set a password" : "Sign in with your password"}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={isNewUser ? 8 : undefined}
          autoComplete={isNewUser ? "new-password" : "current-password"}
        />
      </div>
      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button className="min-h-12 w-full" disabled={pending}>
        {pending ? "Joining…" : "Join studio"}
      </Button>
    </form>
  );
}
