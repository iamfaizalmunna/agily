import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultWorkflow } from "@/lib/workflow/workflow";
import {
  effectiveKanbanCompact,
  kanbanColumnClass,
  kanbanColumnStripClass,
  kanbanMoveTargets,
} from "@/lib/board/mobile-kanban";

describe("board/mobile-kanban", () => {
  it("defaults compact on mobile unless query overrides", () => {
    assert.equal(effectiveKanbanCompact(undefined, true), true);
    assert.equal(effectiveKanbanCompact(undefined, false), false);
    assert.equal(effectiveKanbanCompact("0", true), false);
    assert.equal(effectiveKanbanCompact("1", false), true);
  });

  it("builds mobile column layout classes", () => {
    assert.match(kanbanColumnStripClass(), /snap-x/);
    assert.match(kanbanColumnClass(), /snap-center/);
    assert.match(kanbanColumnStripClass("extra"), /extra/);
  });

  it("lists move targets without the current column", () => {
    const workflow = defaultWorkflow();
    const statuses = ["backlog", "doing", "done"] as const;
    const targets = kanbanMoveTargets(workflow, statuses, "doing");
    assert.deepEqual(
      targets.map((row) => row.id),
      ["backlog", "done"],
    );
  });
});
