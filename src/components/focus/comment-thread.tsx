"use client";

import { useActionState } from "react";
import { MentionTextarea } from "@/components/focus/mention-textarea";
import { Button } from "@/components/ui/button";
import { formatCommentAt } from "@/lib/focus/focus";
import { addCommentAction, type BoardFormState } from "@/lib/items/actions";
import type { MentionMember } from "@/lib/activity/mentions";

const initial: BoardFormState = {};

type Comment = {
  id: string;
  body: string;
  createdAt: Date;
  user: { name: string };
  replies: {
    id: string;
    body: string;
    createdAt: Date;
    user: { name: string };
  }[];
};

function CommentForm({
  slug,
  projectSlug,
  itemId,
  next,
  parentId,
  members,
  placeholder,
  label,
}: {
  slug: string;
  projectSlug: string;
  itemId: string;
  next: string;
  parentId?: string;
  members: MentionMember[];
  placeholder: string;
  label: string;
}) {
  const [state, action, pending] = useActionState(addCommentAction, initial);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="itemId" value={itemId} />
      <input type="hidden" name="next" value={next} />
      {parentId ? <input type="hidden" name="parentId" value={parentId} /> : null}
      <MentionTextarea
        name="body"
        rows={parentId ? 2 : 3}
        required
        placeholder={placeholder}
        members={members}
      />
      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button className="min-h-10 w-full sm:w-auto" disabled={pending} variant="ghost">
        {pending ? "Saving…" : label}
      </Button>
    </form>
  );
}

export function CommentThread({
  slug,
  projectSlug,
  itemId,
  next,
  comments,
  canWrite,
  members,
}: {
  slug: string;
  projectSlug: string;
  itemId: string;
  next: string;
  comments: Comment[];
  canWrite: boolean;
  members: MentionMember[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {comments.length ? (
        <ol className="flex flex-col gap-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-2xl border border-paper/10 px-3 py-3">
              <p className="text-sm text-paper">{comment.body}</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-paper/40">
                {comment.user.name} · {formatCommentAt(comment.createdAt)}
              </p>
              {comment.replies.length ? (
                <ol className="mt-3 flex flex-col gap-2 border-l border-paper/10 pl-3">
                  {comment.replies.map((reply) => (
                    <li key={reply.id} className="rounded-xl bg-paper/[0.03] px-2 py-2">
                      <p className="text-sm text-paper">{reply.body}</p>
                      <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-paper/40">
                        {reply.user.name} · {formatCommentAt(reply.createdAt)}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : null}
              {canWrite ? (
                <div className="mt-3">
                  <CommentForm
                    slug={slug}
                    projectSlug={projectSlug}
                    itemId={itemId}
                    next={next}
                    parentId={comment.id}
                    members={members}
                    placeholder="Reply — use @name to mention"
                    label="Reply"
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-paper/40">No comments yet.</p>
      )}
      {canWrite ? (
        <CommentForm
          slug={slug}
          projectSlug={projectSlug}
          itemId={itemId}
          next={next}
          members={members}
          placeholder="Comment — use @owner, @member, …"
          label="Add comment"
        />
      ) : null}
    </div>
  );
}
