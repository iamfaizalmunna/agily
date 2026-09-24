import type { TeamRole, TeamSettings } from "@/lib/rbac/roles";

export function canCreateProject(role: TeamRole, settings: TeamSettings) {
  if (role === "owner" || role === "admin") return true;
  if (role === "member") return settings.membersCanCreateProjects;
  return false;
}

export function canWriteBoard(role: TeamRole) {
  return role === "owner" || role === "admin" || role === "member";
}

export function canArchiveProject(role: TeamRole) {
  return role === "owner" || role === "admin";
}
