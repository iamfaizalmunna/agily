"use client";

import { useState } from "react";
import { CommentThread } from "@/components/focus/comment-thread";
import type { ActivityFeedEntry } from "@/lib/activity/feed";
import type { MentionMember } from "@/lib/activity/mentions";
import { cn } from "@/lib/cn";

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

export function FocusDiscussion({
  slug,
  projectSlug,
  itemId,
  next,
  canWrite,
  members,
  feed,
  comments,
}: {
  slug: string;
  projectSlug: string;
  itemId: string;
  next: string;
  canWrite: boolean;
  members: MentionMember[];
  feed: ActivityFeedEntry[];
  comments: Comment[];
}) {
  const [tab, setTab] = useState<"activity" | "comments">("activity");

  return (
    <section className="mt-6 flex flex-col gap-3">
      <div className="flex gap-2 border-b border-paper/10 pb-2">
        <button
          type="button"
          className={cn(
            "rounded-full px-3 py-1 text-sm",
            tab === "activity"
              ? "bg-copper/20 text-paper"
              : "text-paper/50 hover:text-paper",
          )}
          onClick={() => setTab("activity")}
        >
          Activity
        </button>
        <button
          type="button"
          className={cn(
            "rounded-full px-3 py-1 text-sm",
            tab === "comments"
              ? "bg-copper/20 text-paper"
              : "text-paper/50 hover:text-paper",
          )}
          onClick={() => setTab("comments")}
        >
          Comments
        </button>
      </div>
      {tab === "activity" ? (
        feed.length ? (
          <ol className="flex flex-col gap-2">
            {feed.map((row) => (
              <li
                key={row.id}
                className="rounded-2xl border border-paper/10 px-3 py-2 text-sm text-paper/80"
              >
                {row.line}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-paper/40">No activity yet.</p>
        )
      ) : (
        <CommentThread
          slug={slug}
          projectSlug={projectSlug}
          itemId={itemId}
          next={next}
          canWrite={canWrite}
          members={members}
          comments={comments}
        />
      )}
    </section>
  );
}
