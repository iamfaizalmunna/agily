import type { ReactNode } from "react";
import { StudioShell } from "@/components/chrome/studio-shell";
import { requireUser } from "@/lib/auth/session";
import { listQuickCreateTargets } from "@/lib/items/queries";
import { unreadCountsByTeam } from "@/lib/notices/queries";
import { canCreateProject } from "@/lib/items/permissions";
import { parseTeamSettings } from "@/lib/rbac/roles";
import { listTeamsForUser } from "@/lib/teams/queries";
import { prisma } from "@/lib/db/prisma";

export default async function StudioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
  const teams = await listTeamsForUser(user.id);
  const counts = await unreadCountsByTeam(user.id);
  const unreadBySlug = Object.fromEntries(
    teams.map((team) => [team.slug, counts[team.id] ?? 0]),
  );
  const createBySlug: Record<
    string,
    { projects: Awaited<ReturnType<typeof listQuickCreateTargets>>; canCreateBoard: boolean }
  > = {};
  for (const team of teams) {
    const row = await prisma.team.findUnique({
      where: { id: team.id },
      select: { settings: true },
    });
    const settings = parseTeamSettings(row?.settings ?? "{}");
    createBySlug[team.slug] = {
      projects: await listQuickCreateTargets(team.id),
      canCreateBoard: canCreateProject(team.role, settings),
    };
  }

  return (
    <StudioShell
      userName={user.name}
      userEmail={user.email}
      teams={teams}
      unreadBySlug={unreadBySlug}
      createBySlug={createBySlug}
    >
      {children}
    </StudioShell>
  );
}
