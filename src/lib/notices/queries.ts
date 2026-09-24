import { prisma } from "@/lib/db/prisma";
import { clampNoticeTake } from "@/lib/notices/notices";

export async function listNotices(userId: string, teamId: string, take?: number) {
  return prisma.notification.findMany({
    where: { userId, teamId },
    orderBy: { createdAt: "desc" },
    take: clampNoticeTake(take),
  });
}

export async function unreadCountsByTeam(userId: string) {
  const rows = await prisma.notification.groupBy({
    by: ["teamId"],
    where: { userId, readAt: null },
    _count: { teamId: true },
  });
  return Object.fromEntries(rows.map((row) => [row.teamId, row._count.teamId]));
}
