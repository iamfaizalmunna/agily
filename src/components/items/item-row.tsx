"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateItemAction, type BoardFormState } from "@/lib/items/actions";
import { ITEM_STATUSES, STATUS_LABEL, type ItemStatus } from "@/lib/items/status";
import { formatDueOn } from "@/lib/items/validate";

const initial: BoardFormState = {};

export function ItemRow({
  slug,
  projectSlug,
  item,
  readOnly,
}: {
  slug: string;
  projectSlug: string;
  item: {
    id: string;
    title: string;
    body: string;
    status: string;
    dueOn: Date | null;
  };
  readOnly: boolean;
}) {
  const [state, action, pending] = useActionState(updateItemAction, initial);

  if (readOnly) {
    return (
      <li className="rounded-2xl border border-paper/10 px-4 py-3">
        <p className="text-paper">{item.title}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/40">
          {STATUS_LABEL[item.status as ItemStatus] ?? item.status}
          {item.dueOn ? ` · ${formatDueOn(item.dueOn)}` : ""}
        </p>
      </li>
    );
  }

  return (
    <li className="rounded-2xl border border-paper/10 p-4">
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="itemId" value={item.id} />
        <Input name="title" defaultValue={item.title} required />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            name="status"
            defaultValue={item.status}
            className="h-12 rounded-2xl border border-paper/10 bg-ink px-3 text-sm text-paper"
          >
            {ITEM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABEL[status]}
              </option>
            ))}
          </select>
          <Input name="dueOn" type="date" defaultValue={formatDueOn(item.dueOn)} />
        </div>
        <textarea
          name="body"
          defaultValue={item.body}
          rows={3}
          placeholder="Write like a page — short markdown is fine."
          className="w-full rounded-2xl border border-paper/10 bg-paper/[0.04] px-4 py-3 text-base text-paper outline-none placeholder:text-paper/35 focus:border-copper/70"
        />
        {state.error ? (
          <p className="text-sm text-copper" role="alert">
            {state.error}
          </p>
        ) : null}
        <Button className="min-h-12 w-full sm:w-auto" disabled={pending} variant="ghost">
          {pending ? "Saving…" : "Save"}
        </Button>
      </form>
    </li>
  );
}
