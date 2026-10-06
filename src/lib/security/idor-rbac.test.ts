import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hasMinRole } from "@/lib/rbac/roles";
import {
  canArchiveProject,
  canCreateProject,
  canWriteBoard,
} from "@/lib/items/permissions";
import { DEFAULT_TEAM_SETTINGS } from "@/lib/rbac/roles";

describe("security/idor-rbac", () => {
  it("viewer cannot write board or archive", () => {
    assert.equal(canWriteBoard("viewer"), false);
    assert.equal(canArchiveProject("viewer"), false);
    assert.equal(
      canCreateProject("viewer", DEFAULT_TEAM_SETTINGS),
      false,
    );
  });

  it("member can write but not reach admin gates", () => {
    assert.equal(canWriteBoard("member"), true);
    assert.equal(hasMinRole("member", "admin"), false);
    assert.equal(hasMinRole("admin", "member"), true);
  });

  it("owner satisfies admin minimum", () => {
    assert.equal(hasMinRole("owner", "admin"), true);
  });
});
