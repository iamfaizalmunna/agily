"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { formatCommentAt } from "@/lib/focus/focus";
import { addCommentAction, type BoardFormState } from "@/lib/items/actions";

const initial: BoardFormState = {};

type Note = {
  id: string;
  body: string;
  createdAt: Date;
  user: { name: string };
};

export function CommentThread({
  slug,
  projectSlug,
  itemId,
  next,
  notes,
  canWrite,
}: {
  slug: string;
  projectSlug: string;
  itemId: string;
  next: string;
  notes: Note[];
  canWrite: boolean;
}) {
  const [state, action, pending] = useActionState(addCommentAction, initial);

  return (
    <section className="mt-6 flex flex-col gap-3">
      <h3 className="font-display text-lg text-paper">Notes</h3>
      {notes.length ? (
        <ol className="flex flex-col gap-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-2xl border border-paper/10 px-3 py-3">
              <p className="text-sm text-paper">{note.body}</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-paper/40">
                {note.user.name} · {formatCommentAt(note.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-paper/40">No notes yet.</p>
      )}
      {canWrite ? (
        <form action={action} className="flex flex-col gap-2">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <input type="hidden" name="itemId" value={itemId} />
          <input type="hidden" name="next" value={next} />
          <textarea
            name="body"
            rows={3}
            required
            placeholder="Leave a note"
            className="w-full rounded-2xl border border-paper/10 bg-paper/[0.04] px-4 py-3 text-base text-paper outline-none placeholder:text-paper/35 focus:border-copper/70"
          />
          {state.error ? (
            <p className="text-sm text-copper" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button className="min-h-12 w-full sm:w-auto" disabled={pending} variant="ghost">
            {pending ? "Saving…" : "Add note"}
          </Button>
        </form>
      ) : null}
    </section>
  );
}
