import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_TEAM_SETTINGS } from "@/lib/rbac/roles";
import {
  canArchiveProject,
  canAssign,
  canCreateProject,
  canWriteBoard,
} from "@/lib/items/permissions";

describe("phase 3 board permissions", () => {
  it("lets members open a board when the studio setting is on", () => {
    assert.equal(canCreateProject("owner", DEFAULT_TEAM_SETTINGS), true);
    assert.equal(canCreateProject("admin", DEFAULT_TEAM_SETTINGS), true);
    assert.equal(canCreateProject("member", DEFAULT_TEAM_SETTINGS), true);
    assert.equal(
      canCreateProject("member", {
        ...DEFAULT_TEAM_SETTINGS,
        membersCanCreateProjects: false,
      }),
      false,
    );
    assert.equal(canCreateProject("viewer", DEFAULT_TEAM_SETTINGS), false);
  });

  it("keeps viewers read-only and archive for staff", () => {
    assert.equal(canWriteBoard("member"), true);
    assert.equal(canWriteBoard("viewer"), false);
    assert.equal(canWriteBoard("admin"), true);
    assert.equal(canArchiveProject("admin"), true);
    assert.equal(canArchiveProject("owner"), true);
    assert.equal(canArchiveProject("member"), false);
    assert.equal(canArchiveProject("viewer"), false);
    assert.equal(canAssign("member"), true);
    assert.equal(canAssign("viewer"), false);
  });
});
