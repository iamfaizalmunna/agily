import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BULK_ITEM_LIMIT,
  parseBulkItemIds,
  parseBulkPatch,
  validateBulkPatchForWorkflow,
} from "@/lib/items/bulk";
import { defaultWorkflow } from "@/lib/workflow/workflow";

describe("list bulk edit", () => {
  it("parses unique item ids", () => {
    const parsed = parseBulkItemIds(["a", "a", " b "]);
    assert.deepEqual(parsed, { ids: ["a", "b"] });
  });

  it("rejects empty selection", () => {
    const parsed = parseBulkItemIds([]);
    assert.ok("error" in parsed);
    assert.equal(parsed.error, "Select at least one ticket");
  });

  it("rejects too many ids", () => {
    const many = Array.from({ length: BULK_ITEM_LIMIT + 1 }, (_, i) => String(i));
    const parsed = parseBulkItemIds(many);
    assert.ok("error" in parsed);
  });

  it("parses status-only patch", () => {
    const parsed = parseBulkPatch({
      status: "done",
      priority: "",
      assignee: "unchanged",
    });
    assert.ok("patch" in parsed);
    assert.equal(parsed.patch.status, "done");
    assert.equal(parsed.patch.assignee.mode, "unchanged");
  });

  it("parses assignee clear and set", () => {
    const clear = parseBulkPatch({
      status: "",
      priority: "",
      assignee: "clear",
    });
    assert.ok("patch" in clear);
    assert.equal(clear.patch.assignee.mode, "clear");

    const set = parseBulkPatch({
      status: "",
      priority: "major",
      assignee: "user-1",
    });
    assert.ok("patch" in set);
    assert.equal(set.patch.assignee.mode, "set");
    assert.equal(set.patch.assignee.userId, "user-1");
  });

  it("requires at least one change", () => {
    const parsed = parseBulkPatch({
      status: "",
      priority: "",
      assignee: "unchanged",
    });
    assert.ok("error" in parsed);
    assert.equal(parsed.error, "Choose at least one field to update");
  });

  it("rejects bad priority", () => {
    const parsed = parseBulkPatch({
      status: "",
      priority: "urgent",
      assignee: "unchanged",
    });
    assert.ok("error" in parsed);
  });

  it("validates workflow status", () => {
    const workflow = defaultWorkflow();
    const patch = parseBulkPatch({
      status: "nope",
      priority: "",
      assignee: "unchanged",
    });
    assert.ok("patch" in patch);
    const gate = validateBulkPatchForWorkflow(patch.patch, workflow);
    assert.ok("error" in gate);
    assert.equal(gate.error, "Unknown status");
  });

  it("requires assignee id when mode is set", () => {
    const gate = validateBulkPatchForWorkflow(
      {
        assignee: { mode: "set" },
      },
      defaultWorkflow(),
    );
    assert.ok("error" in gate);
  });

  it("rejects empty assignee token", () => {
    const parsed = parseBulkPatch({
      status: "done",
      priority: "",
      assignee: "",
    });
    assert.ok("error" in parsed);
  });

  it("accepts valid workflow patch", () => {
    const gate = validateBulkPatchForWorkflow(
      {
        status: "done",
        priority: "major",
        assignee: { mode: "unchanged" },
      },
      defaultWorkflow(),
    );
    assert.deepEqual(gate, { ok: true });
  });
});
