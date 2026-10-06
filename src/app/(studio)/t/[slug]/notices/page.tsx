import { notFound } from "next/navigation";
import { EmptyState } from "@/components/chrome/empty-state";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { formatCommentAt } from "@/lib/focus/focus";
import {
  markAllNoticesReadAction,
  openNoticeAction,
} from "@/lib/notices/actions";
import { isUnread } from "@/lib/notices/notices";
import { listNotices } from "@/lib/notices/queries";
import { getMembership } from "@/lib/teams/queries";
import { studioPageSectionClass } from "@/lib/ui/layout-contract";

export default async function NoticesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) notFound();
  const rows = await listNotices(user.id, ctx.team.id);

  return (
    <section className={studioPageSectionClass()}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs tracking-[0.22em] text-copper uppercase">
            Bell
          </p>
          <h1 className="mt-3 font-display text-3xl text-paper">Notices</h1>
          <p className="mt-3 max-w-md text-sm text-paper/50">
            Assignments, comments, and board moves across this studio. Pop-ups and
            sound are in Settings → Notifications. Nothing is mailed.
          </p>
        </div>
        {rows.some((row) => isUnread(row.readAt)) ? (
          <form action={markAllNoticesReadAction}>
            <input type="hidden" name="slug" value={slug} />
            <Button type="submit" variant="quiet">
              Mark all read
            </Button>
          </form>
        ) : null}
      </div>

      {rows.length ? (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => (
            <li key={row.id}>
              <form action={openNoticeAction}>
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="noticeId" value={row.id} />
                <button
                  type="submit"
                  className={`flex min-h-14 w-full flex-col items-start rounded-2xl border px-4 py-3 text-left ${
                    isUnread(row.readAt)
                      ? "border-copper/40 bg-copper/10"
                      : "border-paper/10"
                  }`}
                >
                  <span className="text-sm text-paper">{row.title}</span>
                  <span className="text-xs text-paper/50">{row.body}</span>
                  <span className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-paper/35">
                    {formatCommentAt(row.createdAt)}
                  </span>
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Quiet bell"
          body="Assign someone or leave a note on a ticket. Rows show up here — never in email."
        />
      )}
    </section>
  );
}
