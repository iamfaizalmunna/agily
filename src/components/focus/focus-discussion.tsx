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
    <section id="focus-discussion" className="mt-6 flex flex-col gap-3 scroll-mt-4">
      <div
        className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1"
        role="tablist"
        aria-label="Ticket discussion"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "activity"}
          data-focus-tab="activity"
          className={cn(
            "min-h-10 flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            tab === "activity"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground",
          )}
          onClick={() => setTab("activity")}
        >
          Activity
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "comments"}
          data-focus-tab="comments"
          className={cn(
            "min-h-10 flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            tab === "comments"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground",
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
                className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground"
              >
                {row.line}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
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
