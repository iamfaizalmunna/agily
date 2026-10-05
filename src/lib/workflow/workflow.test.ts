import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_LABEL } from "@/lib/items/status";
import {
  defaultWorkflow,
  isWorkflowStatus,
  normalizeWorkflow,
  parseProjectWorkflow,
  resolveWorkflow,
  serializeWorkflow,
  visibleWorkflowStatuses,
  workflowFromPayload,
  workflowStatusColor,
  workflowStatusIds,
  workflowStatusLabel,
} from "./workflow";

describe("workflow/workflow", () => {
  it("round-trips the default workflow", () => {
    const base = defaultWorkflow();
    assert.equal(base.statuses.length, 5);
    const json = serializeWorkflow(base);
    const parsed = parseProjectWorkflow(json);
    assert.ok(parsed);
    assert.deepEqual(parsed!.statuses.map((row) => row.id), workflowStatusIds(base));
    assert.equal(resolveWorkflow("").statuses.length, 5);
    assert.equal(resolveWorkflow("{").statuses.length, 5);
    assert.equal(parseProjectWorkflow(null), null);
    assert.equal(parseProjectWorkflow(undefined), null);
  });

  it("validates workflow payloads", () => {
    assert.equal(workflowFromPayload(null), null);
    assert.equal(workflowFromPayload({ statuses: [] }), null);
    assert.equal(
      workflowFromPayload({
        statuses: [{ id: "BAD", label: "X", color: "#ffffff" }],
      }),
      null,
    );
    const ok = workflowFromPayload({
      statuses: [{ id: "backlog", label: "Ideas", color: "#111111" }],
    });
    assert.ok(ok);
    const dup = workflowFromPayload({
      statuses: [
        { id: "backlog", label: "A", color: "#111111" },
        { id: "backlog", label: "B", color: "#222222" },
      ],
    });
    assert.equal(dup, null);
    assert.equal(
      workflowFromPayload({
        statuses: [{ label: "X", color: "#111111" }],
      }),
      null,
    );
    assert.equal(
      workflowFromPayload({
        statuses: [{ id: "backlog", color: "#111111" }],
      }),
      null,
    );
    assert.equal(
      workflowFromPayload({
        statuses: [{ id: "backlog", label: "X" }],
      }),
      null,
    );
    assert.equal(
      workflowFromPayload({
        statuses: [{ id: "", label: "X", color: "#111111" }],
      }),
      null,
    );
    assert.equal(
      workflowFromPayload({
        statuses: [{ id: "backlog", label: "", color: "#111111" }],
      }),
      null,
    );
    assert.equal(
      workflowFromPayload({
        statuses: [{ id: "backlog", label: "X", color: "not-hex" }],
      }),
      null,
    );
    assert.equal(
      workflowFromPayload({
        statuses: [{ id: "backlog", label: "X", color: "#111111" }],
      })?.statuses[0].label,
      "X",
    );
  });

  it("normalizes required core statuses", () => {
    const onlyBacklog = normalizeWorkflow({
      statuses: [{ id: "backlog", label: "Back", color: "#111111" }],
    });
    assert.ok("error" in onlyBacklog);
    const custom = defaultWorkflow();
    custom.statuses.push({
      id: "qa",
      label: "QA",
      color: "#abcdef",
    });
    const normalized = normalizeWorkflow(custom);
    assert.ok(!("error" in normalized));
    assert.equal(normalized.statuses.length, 6);
  });

  it("exposes labels, colors, and visibility", () => {
    const flow = defaultWorkflow();
    flow.statuses[1] = { id: "ready", label: "Next up", color: "#336699" };
    assert.equal(isWorkflowStatus(flow, "ready"), true);
    assert.equal(isWorkflowStatus(flow, "nope"), false);
    assert.equal(workflowStatusLabel(flow, "ready"), "Next up");
    assert.equal(workflowStatusLabel(flow, "missing"), "missing");
    assert.equal(workflowStatusColor(flow, "ready"), "#336699");
    assert.equal(workflowStatusColor(flow, "missing"), "#6b7280");
    const visible = visibleWorkflowStatuses(flow, true);
    assert.equal(visible.includes("done"), false);
    assert.equal(visibleWorkflowStatuses(flow, false).length, 5);
  });

  it("labels unknown ids with defaults", () => {
    const flow = defaultWorkflow();
    assert.equal(workflowStatusLabel(flow, "missing"), "missing");
    assert.equal(workflowStatusColor(flow, "missing"), "#6b7280");
    const customOnly = {
      statuses: [{ id: "qa", label: "QA", color: "#112233" }],
    };
    assert.equal(workflowStatusLabel(customOnly, "doing"), STATUS_LABEL.doing);
    assert.equal(workflowStatusColor(customOnly, "doing"), "#f59e0b");
  });

  it("falls back when stored workflow is incomplete", () => {
    const incomplete = serializeWorkflow({
      statuses: [{ id: "custom", label: "Custom", color: "#112233" }],
    });
    const resolved = resolveWorkflow(incomplete);
    assert.equal(resolved.statuses.length, 5);
  });
});
