import { prisma } from "@/lib/db/prisma";

export async function listLenses(teamId: string, userId: string) {
  return prisma.filterLens.findMany({
    where: { teamId, userId },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
}

export async function getLens(teamId: string, userId: string, id: string) {
  return prisma.filterLens.findFirst({
    where: { id, teamId, userId },
  });
}
