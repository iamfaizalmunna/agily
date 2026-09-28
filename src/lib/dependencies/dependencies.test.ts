import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  blockedItemIds,
  dependencyMap,
  ganttDependencyIds,
} from "@/lib/dependencies/dependencies";

describe("revamp R7 dependencies", () => {
  it("marks successors blocked until predecessors are done", () => {
    const items = [
      { id: "a", status: "done" },
      { id: "b", status: "doing" },
      { id: "c", status: "backlog" },
    ];
    const edges = [
      { predecessorId: "a", successorId: "b" },
      { predecessorId: "b", successorId: "c" },
    ];
    const blocked = blockedItemIds(items, edges);
    assert.equal(blocked.has("b"), false);
    assert.equal(blocked.has("c"), true);
    assert.deepEqual(ganttDependencyIds("c", edges), ["b"]);
    assert.equal(dependencyMap(edges).get("c")?.length, 1);
  });
});
