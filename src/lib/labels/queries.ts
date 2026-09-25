import { prisma } from "@/lib/db/prisma";

export async function listTeamLabels(teamId: string) {
  return prisma.label.findMany({
    where: { teamId },
    orderBy: { name: "asc" },
  });
}
