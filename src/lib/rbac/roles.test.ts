import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canChangeMemberRole,
  canEditSettings,
  canInvite,
  canRemoveMember,
  DEFAULT_TEAM_SETTINGS,
  inviteRolesFor,
  isTeamRole,
  parseTeamSettings,
  ROLE_BLURB,
  ROLE_RANK,
  stringifyTeamSettings,
  TEAM_ROLES,
} from "@/lib/rbac/roles";

describe("phase 2 roles", () => {
  it("locks the four-role ladder", () => {
    assert.deepEqual(TEAM_ROLES, ["owner", "admin", "member", "viewer"]);
    assert.equal(ROLE_RANK.owner > ROLE_RANK.admin, true);
    assert.ok(ROLE_BLURB.owner.includes("studio"));
    assert.equal(isTeamRole("owner"), true);
    assert.equal(isTeamRole("super"), false);
  });

  it("parses settings with defaults and invalid JSON", () => {
    assert.deepEqual(parseTeamSettings("{"), DEFAULT_TEAM_SETTINGS);
    assert.deepEqual(parseTeamSettings("{}"), DEFAULT_TEAM_SETTINGS);
    const parsed = parseTeamSettings(
      stringifyTeamSettings({
        membersCanCreateProjects: false,
        membersCanInvite: false,
        defaultInviteRole: "viewer",
      }),
    );
    assert.equal(parsed.membersCanInvite, false);
    assert.equal(parsed.defaultInviteRole, "viewer");
    assert.equal(
      parseTeamSettings('{"defaultInviteRole":"nope"}').defaultInviteRole,
      "member",
    );
    assert.equal(
      parseTeamSettings('{"defaultInviteRole":"admin"}').defaultInviteRole,
      "admin",
    );
    assert.equal(
      stringifyTeamSettings({
        ...DEFAULT_TEAM_SETTINGS,
        defaultInviteRole: "viewer",
      }),
      JSON.stringify({
        membersCanCreateProjects: true,
        membersCanInvite: true,
        defaultInviteRole: "viewer",
      }),
    );
  });

  it("gates invites", () => {
    assert.equal(canInvite("owner", DEFAULT_TEAM_SETTINGS), true);
    assert.equal(canInvite("admin", DEFAULT_TEAM_SETTINGS), true);
    assert.equal(canInvite("member", DEFAULT_TEAM_SETTINGS), true);
    assert.equal(
      canInvite("member", { ...DEFAULT_TEAM_SETTINGS, membersCanInvite: false }),
      false,
    );
    assert.equal(canInvite("viewer", DEFAULT_TEAM_SETTINGS), false);
    assert.deepEqual(inviteRolesFor("owner"), ["admin", "member", "viewer"]);
    assert.deepEqual(inviteRolesFor("admin"), ["member", "viewer"]);
    assert.deepEqual(inviteRolesFor("member"), ["member", "viewer"]);
    assert.deepEqual(inviteRolesFor("viewer"), []);
  });

  it("blocks illegal role changes", () => {
    assert.equal(canChangeMemberRole("member", "member", "admin"), false);
    assert.equal(canChangeMemberRole("viewer", "viewer", "member"), false);
    assert.equal(canChangeMemberRole("admin", "owner", "admin"), false);
    assert.equal(canChangeMemberRole("admin", "member", "owner"), false);
    assert.equal(canChangeMemberRole("admin", "member", "admin"), false);
    assert.equal(canChangeMemberRole("admin", "admin", "member"), false);
    assert.equal(canChangeMemberRole("owner", "admin", "member"), true);
    assert.equal(canChangeMemberRole("owner", "member", "owner"), true);
    assert.equal(canChangeMemberRole("admin", "member", "viewer"), true);
  });

  it("limits settings edits to owners and admins", () => {
    assert.equal(canEditSettings("owner"), true);
    assert.equal(canEditSettings("admin"), true);
    assert.equal(canEditSettings("member"), false);
    assert.equal(canEditSettings("viewer"), false);
  });

  it("blocks illegal removals", () => {
    assert.equal(canRemoveMember("owner", "owner"), true);
    assert.equal(canRemoveMember("admin", "owner"), false);
    assert.equal(canRemoveMember("owner", "admin"), true);
    assert.equal(canRemoveMember("admin", "member"), true);
    assert.equal(canRemoveMember("admin", "viewer"), true);
    assert.equal(canRemoveMember("admin", "admin"), false);
    assert.equal(canRemoveMember("member", "viewer"), false);
    assert.equal(canRemoveMember("viewer", "member"), false);
  });
});
