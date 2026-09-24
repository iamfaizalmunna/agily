import type { ReactNode } from "react";
import { StudioShell } from "@/components/chrome/studio-shell";
import { requireUser } from "@/lib/auth/session";
import { unreadCountsByTeam } from "@/lib/notices/queries";
import { listTeamsForUser } from "@/lib/teams/queries";

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

  return (
    <StudioShell
      userName={user.name}
      userEmail={user.email}
      teams={teams}
      unreadBySlug={unreadBySlug}
    >
      {children}
    </StudioShell>
  );
}
