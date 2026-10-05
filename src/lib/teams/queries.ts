import { prisma } from "@/lib/db/prisma";
import { buildOriginFromHeaders } from "@/lib/security/origin";
import { readMutationOriginInput } from "@/lib/security/mutation-guard";
import type { TeamRole } from "@/lib/rbac/roles";

export async function listTeamsForUser(userId: string) {
  const rows = await prisma.teamMember.findMany({
    where: { userId },
    include: { team: true },
    orderBy: { team: { createdAt: "asc" } },
  });
  return rows.map((row) => ({
    id: row.team.id,
    name: row.team.name,
    slug: row.team.slug,
    role: row.role as TeamRole,
  }));
}

export async function getMembership(userId: string, slug: string) {
  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      members: { include: { user: true } },
      invites: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!team) return null;
  const membership = team.members.find((m) => m.userId === userId);
  if (!membership) return null;
  return { team, role: membership.role as TeamRole, membership };
}

export async function countOwners(teamId: string) {
  return prisma.teamMember.count({
    where: { teamId, role: "owner" },
  });
}

export async function appOrigin() {
  return buildOriginFromHeaders(await readMutationOriginInput());
}
