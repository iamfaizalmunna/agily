import { prisma } from "@/lib/db/prisma";

export async function listProjects(teamId: string, includeArchived = false) {
  return prisma.project.findMany({
    where: includeArchived ? { teamId } : { teamId, archived: false },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { items: true } } },
  });
}

export async function assignmentCounts(teamId: string) {
  const rows = await prisma.itemAssignee.groupBy({
    by: ["userId"],
    where: { item: { project: { teamId } } },
    _count: { userId: true },
  });
  return Object.fromEntries(rows.map((row) => [row.userId, row._count.userId]));
}

export async function listTeamItems(teamId: string) {
  return prisma.item.findMany({
    where: { project: { teamId, archived: false } },
    include: {
      assignees: { include: { user: true } },
      project: true,
      group: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getItemFocus(
  teamId: string,
  projectSlug: string,
  itemId: string,
) {
  return prisma.item.findFirst({
    where: {
      id: itemId,
      project: { teamId, slug: projectSlug },
    },
    include: {
      assignees: { include: { user: true } },
      updates: {
        orderBy: { createdAt: "asc" },
        include: { user: true },
      },
    },
  });
}

export async function getProjectBoard(teamId: string, projectSlug: string) {
  return prisma.project.findFirst({
    where: { teamId, slug: projectSlug },
    include: {
      groups: {
        orderBy: { position: "asc" },
        include: {
          items: {
            orderBy: { position: "asc" },
            include: {
              assignees: { include: { user: true } },
              _count: { select: { updates: true } },
            },
          },
        },
      },
    },
  });
}
