import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectAssigneeIds,
  filterAssignableIds,
  isAssigned,
  personInitials,
  toggleAssignee,
} from "@/lib/items/assign";

describe("phase 4 assign", () => {
  it("keeps only people already on the team", () => {
    assert.deepEqual(filterAssignableIds(["a", "a", "x", ""], ["a", "b"]), [
      "a",
    ]);
    assert.deepEqual(filterAssignableIds(["b"], ["a"]), []);
  });

  it("toggles a person on or off", () => {
    assert.deepEqual(toggleAssignee(["a"], "b"), ["a", "b"]);
    assert.deepEqual(toggleAssignee(["a", "b"], "a"), ["b"]);
    assert.deepEqual(toggleAssignee(["a"], ""), ["a"]);
    assert.equal(isAssigned(["a"], "a"), true);
    assert.equal(isAssigned(["a"], "b"), false);
  });

  it("builds initials", () => {
    assert.equal(personInitials("Ada Lovelace"), "AL");
    assert.equal(personInitials("Ada"), "AD");
    assert.equal(personInitials("  "), "?");
  });

  it("reads checkbox values from a form", () => {
    const data = new FormData();
    data.append("assigneeIds", "u1");
    data.append("assigneeIds", " u2 ");
    data.append("assigneeIds", "");
    assert.deepEqual(collectAssigneeIds(data), ["u1", "u2"]);
  });
});
