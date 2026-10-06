import { hasMinRole, type TeamRole } from "@/lib/rbac/roles";
import { getMembership } from "@/lib/teams/queries";

export async function requireTeamMember(
  userId: string,
  slug: string,
  minRole: TeamRole = "viewer",
) {
  const ctx = await getMembership(userId, slug);
  if (!ctx) return { error: "Studio not found" as const };
  if (!hasMinRole(ctx.role, minRole)) {
    return { error: "Read only" as const };
  }
  return { ctx };
}
