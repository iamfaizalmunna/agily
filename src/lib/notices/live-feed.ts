import { prisma } from "@/lib/db/prisma";
import { clampNoticeTake } from "@/lib/notices/notices";

export type LiveNoticeRow = {
  id: string;
  kind: string;
  title: string;
  body: string;
  href: string;
  createdAt: Date;
  readAt: Date | null;
};

export function parseSinceParam(raw: string | null): Date | undefined {
  if (!raw) return undefined;
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) return undefined;
  return new Date(ms);
}

export async function fetchLiveNotices(
  userId: string,
  teamId: string,
  since?: Date,
  take = 15,
): Promise<LiveNoticeRow[]> {
  return prisma.notification.findMany({
    where: {
      userId,
      teamId,
      ...(since ? { createdAt: { gt: since } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: clampNoticeTake(take),
    select: {
      id: true,
      kind: true,
      title: true,
      body: true,
      href: true,
      createdAt: true,
      readAt: true,
    },
  });
}

export async function countUnreadNotices(userId: string, teamId: string) {
  return prisma.notification.count({
    where: { userId, teamId, readAt: null },
  });
}
