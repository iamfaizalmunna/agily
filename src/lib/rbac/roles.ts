export const TEAM_ROLES = ["owner", "admin", "member", "viewer"] as const;

export type TeamRole = (typeof TEAM_ROLES)[number];

export const ROLE_RANK: Record<TeamRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

export const ROLE_BLURB: Record<TeamRole, string> = {
  owner: "Start a studio. Full settings, people, delete team.",
  admin: "Granted by an owner. Settings and people, not delete.",
  member: "Write tickets. Invite if the studio allows it.",
  viewer: "Read only. Watch the board, no edits.",
};

export function isTeamRole(value: string): value is TeamRole {
  return (TEAM_ROLES as readonly string[]).includes(value);
}

export type TeamSettings = {
  membersCanCreateProjects: boolean;
  membersCanInvite: boolean;
  defaultInviteRole: TeamRole;
};

export const DEFAULT_TEAM_SETTINGS: TeamSettings = {
  membersCanCreateProjects: true,
  membersCanInvite: true,
  defaultInviteRole: "member",
};

export function parseTeamSettings(raw: string): TeamSettings {
  try {
    const parsed = JSON.parse(raw) as Partial<TeamSettings>;
    return {
      membersCanCreateProjects:
        parsed.membersCanCreateProjects ??
        DEFAULT_TEAM_SETTINGS.membersCanCreateProjects,
      membersCanInvite:
        parsed.membersCanInvite ?? DEFAULT_TEAM_SETTINGS.membersCanInvite,
      defaultInviteRole: isTeamRole(parsed.defaultInviteRole ?? "")
        ? (parsed.defaultInviteRole as TeamRole)
        : DEFAULT_TEAM_SETTINGS.defaultInviteRole,
    };
  } catch {
    return DEFAULT_TEAM_SETTINGS;
  }
}

export function stringifyTeamSettings(settings: TeamSettings) {
  return JSON.stringify(settings);
}

export function canInvite(actor: TeamRole, settings: TeamSettings) {
  if (actor === "owner" || actor === "admin") return true;
  if (actor === "member") return settings.membersCanInvite;
  return false;
}

export function inviteRolesFor(actor: TeamRole): TeamRole[] {
  if (actor === "owner") return ["admin", "member", "viewer"];
  if (actor === "admin") return ["member", "viewer"];
  if (actor === "member") return ["member", "viewer"];
  return [];
}

export function canChangeMemberRole(
  actor: TeamRole,
  target: TeamRole,
  next: TeamRole,
) {
  if (actor === "viewer" || actor === "member") return false;
  if (target === "owner" && actor !== "owner") return false;
  if (next === "owner" && actor !== "owner") return false;
  if (actor === "admin" && (target === "owner" || next === "admin")) {
    return false;
  }
  if (actor === "admin" && ROLE_RANK[target] >= ROLE_RANK.admin) return false;
  return ROLE_RANK[actor] >= ROLE_RANK[next];
}

export function canEditSettings(actor: TeamRole) {
  return actor === "owner" || actor === "admin";
}

export function canRemoveMember(actor: TeamRole, target: TeamRole) {
  if (target === "owner") return actor === "owner";
  if (actor === "owner") return true;
  if (actor === "admin") return target === "member" || target === "viewer";
  return false;
}
