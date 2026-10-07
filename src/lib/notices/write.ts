import { prisma } from "@/lib/db/prisma";
import {
  noticeCopy,
  noticeHref,
  recipientsExcept,
  type NoticeKind,
} from "@/lib/notices/notices";

export async function writeNotices(input: {
  teamId: string;
  slug: string;
  projectSlug: string;
  itemId: string;
  itemTitle: string;
  actorId: string;
  actorName: string;
  kind: NoticeKind;
  userIds: string[];
  snippet?: string;
}) {
  const people = recipientsExcept(input.userIds, input.actorId);
  if (!people.length) return;
  const copy = noticeCopy(
    input.kind,
    input.actorName,
    input.itemTitle,
    input.snippet,
  );
  await prisma.notification.createMany({
    data: people.map((userId) => ({
      teamId: input.teamId,
      userId,
      kind: input.kind,
      title: copy.title,
      body: copy.body,
      href: noticeHref(input.slug, input.projectSlug, input.itemId),
    })),
  });
}

/** Notify every studio member except the actor (board / kanban activity). */
export async function writeTeamBoardNotices(input: {
  teamId: string;
  slug: string;
  projectSlug: string;
  itemId: string;
  itemTitle: string;
  actorId: string;
  actorName: string;
  kind: "status_changed" | "ticket_created";
  memberUserIds: string[];
  detail?: string;
}) {
  const people = recipientsExcept(input.memberUserIds, input.actorId);
  if (!people.length) return;
  const copy = noticeCopy(
    input.kind,
    input.actorName,
    input.itemTitle,
    input.detail,
  );
  await prisma.notification.createMany({
    data: people.map((userId) => ({
      teamId: input.teamId,
      userId,
      kind: input.kind,
      title: copy.title,
      body: copy.body,
      href: noticeHref(input.slug, input.projectSlug, input.itemId),
    })),
  });
}

