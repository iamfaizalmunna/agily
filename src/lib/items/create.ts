import { prisma } from "@/lib/db/prisma";
import { defaultGroupSeed } from "@/lib/items/defaults";
import { uniqueSlug } from "@/lib/teams/tokens";

export async function createProjectForTeam(teamId: string, name: string) {
  return prisma.project.create({
    data: {
      teamId,
      name,
      slug: uniqueSlug(name),
      groups: { create: defaultGroupSeed().map((g) => ({ ...g })) },
    },
  });
}
