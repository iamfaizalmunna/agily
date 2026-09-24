import { prisma } from "@/lib/db/prisma";
import {
  DEFAULT_TEAM_SETTINGS,
  stringifyTeamSettings,
} from "@/lib/rbac/roles";
import { uniqueSlug } from "@/lib/teams/tokens";

export async function createTeamForUser(userId: string, name: string) {
  return prisma.team.create({
    data: {
      name,
      slug: uniqueSlug(name),
      settings: stringifyTeamSettings(DEFAULT_TEAM_SETTINGS),
      members: {
        create: { userId, role: "owner" },
      },
    },
  });
}
