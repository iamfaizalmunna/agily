import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  epicRollups,
  itemUnderEpic,
  openChildCount,
  validateParentLink,
  wouldCreateCycle,
} from "./hierarchy";

describe("hierarchy", () => {
  it("validates parent links", () => {
    assert.deepEqual(
      validateParentLink({ id: "c", type: "story" }, {
        id: "e",
        parentId: null,
        type: "epic",
        status: "doing",
        title: "Epic",
      }),
      { ok: true },
    );
    assert.deepEqual(validateParentLink({ id: "e", type: "epic" }, null), {
      ok: true,
    });
    const notEpic = validateParentLink({ id: "c", type: "bug" }, {
      id: "t",
      parentId: null,
      type: "task",
      status: "backlog",
      title: "Task",
    });
    assert.equal("error" in notEpic ? notEpic.error : "", "Parent must be an epic");
    const epicChild = validateParentLink({ id: "e", type: "epic" }, {
      id: "p",
      parentId: null,
      type: "epic",
      status: "doing",
      title: "P",
    });
    assert.equal(
      "error" in epicChild ? epicChild.error : "",
      "Epics cannot belong to another ticket",
    );
    const nested = validateParentLink({ id: "c", type: "story" }, {
      id: "n",
      parentId: "x",
      type: "epic",
      status: "doing",
      title: "Nested",
    });
    assert.equal(
      "error" in nested ? nested.error : "",
      "Only one level of hierarchy (epic → child)",
    );
    const self = validateParentLink({ id: "c", type: "story" }, {
      id: "c",
      parentId: null,
      type: "epic",
      status: "doing",
      title: "Self",
    });
    assert.equal(
      "error" in self ? self.error : "",
      "A ticket cannot be its own parent",
    );
  });

  it("detects cycles and rolls up epics", () => {
    const nodes = new Map([
      ["a", { id: "a", parentId: "b", type: "story", status: "doing", title: "A" }],
      ["b", { id: "b", parentId: null, type: "epic", status: "doing", title: "B" }],
    ]);
    assert.equal(wouldCreateCycle("b", "a", nodes), true);
    assert.equal(openChildCount([{ status: "done" }, { status: "doing" }]), 1);
    const rollups = epicRollups([
      { id: "e1", parentId: null, type: "epic", status: "doing", title: "Revamp" },
      { id: "c1", parentId: "e1", type: "story", status: "doing", title: "Board" },
      { id: "c2", parentId: "e1", type: "task", status: "done", title: "Labels" },
    ]);
    assert.equal(rollups[0].openChildren, 1);
    assert.equal(rollups[0].totalChildren, 2);
    assert.equal(itemUnderEpic({ parentId: "e1" }, "e1"), true);
  });
});
