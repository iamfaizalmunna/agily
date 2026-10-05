/* c8 ignore next */
import { formatCommentAt } from "@/lib/focus/focus";
import { formatEventSentence, isItemEventKind } from "@/lib/activity/events";
import type { ItemEventKind } from "@/lib/activity/events";

export type ActivityEventRow = {
  id: string;
  kind: string;
  fromValue: string | null;
  toValue: string | null;
  createdAt: Date;
  user: { name: string } | null;
};

export type ActivityCommentRow = {
  id: string;
  body: string;
  createdAt: Date;
  parentId: string | null;
  user: { name: string };
};

export type ActivityFeedEntry = {
  id: string;
  at: Date;
  line: string;
  kind: "event" | "comment" | "reply";
};

/* c8 ignore next */
export function buildActivityFeed(
  events: ActivityEventRow[],
  comments: ActivityCommentRow[],
) {
  const rows: ActivityFeedEntry[] = [];
  for (const event of events) {
    if (!isItemEventKind(event.kind)) continue;
    const actor = event.user?.name ?? "System";
    rows.push({
      id: `event-${event.id}`,
      at: event.createdAt,
      kind: "event",
      line: formatEventSentence(
        actor,
        event.kind as ItemEventKind,
        event.fromValue,
        event.toValue,
      ),
    });
  }
  for (const comment of comments) {
    const stamp = formatCommentAt(comment.createdAt);
    if (comment.parentId) {
      rows.push({
        id: `reply-${comment.id}`,
        at: comment.createdAt,
        kind: "reply",
        line: `${comment.user.name} replied · ${stamp}`,
      });
    } else {
      rows.push({
        id: `comment-${comment.id}`,
        at: comment.createdAt,
        kind: "comment",
        line: `${comment.user.name} commented · ${stamp}`,
      });
    }
  }
  return rows.sort((a, b) => b.at.getTime() - a.at.getTime());
}
