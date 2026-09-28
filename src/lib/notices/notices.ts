export const NOTICE_KINDS = ["assigned", "note", "mention", "reply"] as const;
export type NoticeKind = (typeof NOTICE_KINDS)[number];

export function isNoticeKind(value: string | undefined | null): value is NoticeKind {
  return (NOTICE_KINDS as readonly string[]).includes(value ?? "");
}

export function recipientsExcept(userIds: string[], actorId: string) {
  return [...new Set(userIds.filter((id) => id && id !== actorId))];
}

export function noticeHref(slug: string, projectSlug: string, itemId: string) {
  return `/t/${slug}/p/${projectSlug}?focus=${itemId}`;
}

export function noticeCopy(
  kind: NoticeKind,
  actorName: string,
  itemTitle: string,
  snippet?: string,
) {
  if (kind === "assigned") {
    return {
      title: `${actorName} assigned you`,
      body: itemTitle,
    };
  }
  if (kind === "mention") {
    return {
      title: `${actorName} mentioned you`,
      body: snippet?.trim() || itemTitle,
    };
  }
  if (kind === "reply") {
    return {
      title: `${actorName} replied to your comment`,
      body: snippet?.trim() || itemTitle,
    };
  }
  return {
    title: `${actorName} left a note`,
    body: itemTitle,
  };
}

export function isUnread(readAt: Date | null | undefined) {
  return !readAt;
}

export function unreadCount(rows: { readAt: Date | null }[]) {
  return rows.filter((row) => isUnread(row.readAt)).length;
}

export function unreadBadge(count: number) {
  if (count <= 0) return "";
  if (count > 9) return "9+";
  return String(count);
}

export function clampNoticeTake(take: number | undefined) {
  if (take === undefined || Number.isNaN(take)) return 20;
  return Math.min(50, Math.max(1, Math.floor(take)));
}
