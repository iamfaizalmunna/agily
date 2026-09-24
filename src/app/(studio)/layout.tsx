import type { ReactNode } from "react";
import { StudioShell } from "@/components/chrome/studio-shell";
import { requireUser } from "@/lib/auth/session";
import { listTeamsForUser } from "@/lib/teams/queries";

export default async function StudioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
  const teams = await listTeamsForUser(user.id);

  return (
    <StudioShell
      userName={user.name}
      userEmail={user.email}
      teams={teams}
    >
      {children}
    </StudioShell>
  );
}
