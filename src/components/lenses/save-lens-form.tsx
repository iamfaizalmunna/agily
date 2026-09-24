"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveLensAction, type LensFormState } from "@/lib/lenses/actions";
import { isEmptyLens, type LensSpec, stringifyLensSpec } from "@/lib/lenses/lenses";

const initial: LensFormState = {};

export function SaveLensForm({
  slug,
  next,
  spec,
}: {
  slug: string;
  next: string;
  spec: LensSpec;
}) {
  const [state, action, pending] = useActionState(saveLensAction, initial);

  if (isEmptyLens(spec)) return null;

  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="spec" value={stringifyLensSpec(spec)} />
      <Input name="name" required placeholder="Keep this lens" className="sm:max-w-[12rem]" />
      <Button className="min-h-11" disabled={pending} variant="ghost">
        {pending ? "Keeping…" : "Keep"}
      </Button>
      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
