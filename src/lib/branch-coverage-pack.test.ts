import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultWorkflow, normalizeWorkflow, resolveWorkflow, serializeWorkflow, workflowFromPayload } from "@/lib/workflow/workflow";
import {
  groupSwimlanes,
  sortKanbanColumn,
  swimlaneKey,
  swimlaneLabel,
} from "@/lib/board/kanban";
import {
  countActiveLensFilters,
  filterItemsByLens,
  isEmptyLens,
  lensFilterPills,
  lensQueryRecord,
} from "@/lib/lenses/lenses";
import {
  CSV_EXPORT_HEADERS,
  escapeCsvField,
  exportRowsToCsv,
  mapCsvToImports,
  parseCsv,
} from "@/lib/data/csv";
import {
  collectCustomFieldsFromForm,
  fieldSchemaFromPayload,
  mergeCustomFieldDefs,
  parseCustomFields,
  validateFieldValue,
} from "@/lib/custom-fields/fields";
import {
  diffItemEvents,
  formatAssigneeValue,
  formatEventSentence,
  isItemEventKind,
} from "@/lib/activity/events";
import { resetSignInThrottle } from "@/lib/auth/sign-in-throttle";
import { DEMO_ACCOUNT_COUNT } from "@/lib/auth/demo-accounts";
import { isSessionFresh, SESSION_DAYS } from "@/lib/auth/identity";
import { sessionCookieOptions } from "@/lib/auth/cookie-options";
import { cn } from "@/lib/cn";
import { kanbanMoveTargets } from "@/lib/board/mobile-kanban";
import { parseQuickCreateType } from "@/lib/create/quick-create";
import { suggestDuplicateProjectName } from "@/lib/data/duplicate";
import { demoLoginsEnabledClient } from "@/lib/demo/mode";
import { ganttDependencyIds } from "@/lib/dependencies/dependencies";
import { noteLabel } from "@/lib/focus/focus";
import { collectAssigneeIds } from "@/lib/items/assign";
import { validateBulkPatchForWorkflow } from "@/lib/items/bulk";
import { defaultGroupSeed } from "@/lib/items/defaults";
import { parseIssueType } from "@/lib/items/issue-type";
import { canComment } from "@/lib/items/permissions";
import { prevStatus } from "@/lib/items/status";
import { formatDueOn } from "@/lib/items/validate";
import { teamSlugFromPath } from "@/lib/nav/studio";
import { canRemoveMember } from "@/lib/rbac/roles";
import { contentDispositionAttachment } from "@/lib/security/filename";
import { securityResponseHeaders } from "@/lib/security/headers";
import { resolveSettingsSection } from "@/lib/settings/section-nav";
import { mobileAuthShellClass } from "@/lib/ui/mobile";
import { monthGrid } from "@/lib/views/views";

describe("branch coverage pack", () => {
  it("csv parser and import branches", () => {
    assert.equal(escapeCsvField("a\rb"), '"a\rb"');
    assert.deepEqual(parseCsv("z\r"), [["z"]]);
    assert.ok(CSV_EXPORT_HEADERS.length);
    const full = mapCsvToImports([
      ["title", "status", "priority", "due", "type", "group", "assignee"],
      ["T", "doing", "major", "2026-01-02", "bug", "Sprint", "a@b.com"],
    ]);
    assert.equal(full.rows[0].group, "Sprint");
    assert.equal(full.rows[0].due, "2026-01-02");
    const shortRow = mapCsvToImports([["title", "status"], ["Only"]]);
    assert.equal(shortRow.rows[0].status, "backlog");
    assert.ok(exportRowsToCsv([]).includes("title"));
    const sparse = exportRowsToCsv([
      {
        title: "t",
        status: "backlog",
        priority: "minor",
        due: "",
        assignee: "",
        type: "task",
        group: "",
      },
    ]);
    assert.ok(sparse.includes("t"));
  });

  it("workflow payload and resolve branches", () => {
    assert.equal(workflowFromPayload({ statuses: [null as unknown as object] }), null);
    assert.equal(
      workflowFromPayload({
        statuses: [{ id: "backlog", label: "", color: "#111111" }],
      }),
      null,
    );
    assert.equal(
      workflowFromPayload({
        statuses: [{ id: "9bad", label: "X", color: "#111111" }],
      }),
      null,
    );
    const flow = defaultWorkflow();
    const json = serializeWorkflow(flow);
    assert.equal(resolveWorkflow(json).statuses.length, 5);
    const dup = normalizeWorkflow({
      statuses: [
        { id: "backlog", label: "A", color: "#111111" },
        { id: "backlog", label: "B", color: "#222222" },
        { id: "ready", label: "R", color: "#333333" },
        { id: "doing", label: "D", color: "#444444" },
        { id: "review", label: "V", color: "#555555" },
        { id: "done", label: "N", color: "#666666" },
      ],
    });
    assert.ok(!("error" in dup));
  });

  it("kanban swimlane branches", () => {
    const item = {
      id: "1",
      status: "doing",
      position: 0,
      priority: "not-a-priority",
      people: [],
    };
    assert.equal(swimlaneKey(item, "none"), "");
    assert.equal(swimlaneKey(item, "priority"), "minor");
    assert.equal(swimlaneLabel("nope", "priority"), "nope");
    assert.equal(swimlaneLabel("u1", "assignee"), "u1");
    assert.deepEqual(
      sortKanbanColumn([
        { id: "b", position: 0 },
        { id: "a", position: 0 },
      ]).map((r) => r.id),
      ["a", "b"],
    );
    const lanes = groupSwimlanes(
      [
        {
          id: "x",
          status: "backlog",
          position: 0,
          priority: "minor",
          people: [{ id: "u9", name: "Zed" }],
        },
      ],
      "assignee",
      new Map([["u9", "Zed"]]),
    );
    assert.equal(lanes[0].label, "Zed");
  });

  it("lens filter branches", () => {
    assert.equal(isEmptyLens({ labelIds: [] }), true);
    assert.equal(countActiveLensFilters({ labelIds: undefined }), 0);
    const pills = lensFilterPills(
      { personId: "u1", parentId: "e1", labelIds: ["l1"], find: "x" },
      undefined,
      [],
      {},
      () => "/",
    );
    assert.ok(pills.some((p) => p.label === "Assignee"));
    assert.ok(pills.some((p) => p.label === "Epic"));
    assert.ok(pills.some((p) => p.label === "Label"));
    assert.deepEqual(
      lensQueryRecord({ parentId: "e1", labelIds: ["a", "b"] }),
      { epic: "e1", labels: "a,b" },
    );
    const ctx = { userId: "u", now: new Date() };
    assert.equal(
      filterItemsByLens(
        [{ title: "t", status: "backlog", priority: "minor", dueOn: null, assigneeIds: [], labelIds: [], subtasks: [], parentId: null }],
        {},
        ctx,
      ).length,
      1,
    );
  });

  it("custom fields branches", () => {
    assert.deepEqual(parseCustomFields("[]"), {});
    assert.equal(fieldSchemaFromPayload([null]), null);
    const select = mergeCustomFieldDefs([], {
      label: "Env",
      type: "select",
      options: ["  ", "ok"],
    });
    assert.ok(!("error" in select));
    const def = {
      id: "f_x",
      key: "x",
      label: "X",
      type: "select" as const,
      options: ["a"],
    };
    const form = new FormData();
    const collected = collectCustomFieldsFromForm([def], form);
    assert.ok(!("error" in collected));
  });

  it("activity and small export entrypoints", () => {
    assert.equal(isItemEventKind(undefined), false);
    assert.equal(formatAssigneeValue(["missing"], new Map()), "Someone");
    assert.match(
      formatEventSentence("Ada", "status", null, "  "),
      /from — to —/,
    );
    const names = new Map([["u1", "Ada"]]);
    const rows = diffItemEvents(
      { status: "backlog", priority: "minor", dueOn: new Date(), assigneeIds: [] },
      { status: "backlog", priority: "minor", dueOn: null, assigneeIds: [] },
      names,
    );
    assert.ok(rows.some((r) => r.kind === "due"));
    resetSignInThrottle();
    assert.ok(DEMO_ACCOUNT_COUNT > 0);
    assert.equal(typeof SESSION_DAYS, "number");
    assert.equal(isSessionFresh(new Date(Date.now() + 1000)), true);
    assert.ok(sessionCookieOptions(new Date(Date.now() + 60_000)).httpOnly);
    assert.equal(cn("p-1", "p-2"), "p-2");
    const wf = defaultWorkflow();
    assert.ok(
      kanbanMoveTargets(wf, wf.statuses.map((s) => s.id), "backlog").length,
    );
    assert.equal(parseQuickCreateType(undefined), "task");
    assert.ok(suggestDuplicateProjectName("Atlas"));
    assert.equal(typeof demoLoginsEnabledClient(), "boolean");
    assert.deepEqual(
      ganttDependencyIds("c", [{ predecessorId: "a", successorId: "c" }]),
      ["a"],
    );
    assert.ok(noteLabel(2).includes("2"));
    const form = new FormData();
    form.set("assigneeIds", "u1");
    assert.deepEqual(collectAssigneeIds(form), ["u1"]);
    const bulkGate = validateBulkPatchForWorkflow(
      { status: "backlog", assignee: { mode: "unchanged" } },
      defaultWorkflow(),
    );
    assert.ok("ok" in bulkGate);
    assert.ok(defaultGroupSeed().length);
    assert.equal(parseIssueType(null), "task");
    assert.equal(canComment("viewer"), false);
    assert.equal(prevStatus("backlog"), "backlog");
    assert.equal(formatDueOn(undefined), "");
    assert.ok(teamSlugFromPath("/t/acme"));
    assert.equal(canRemoveMember("member", "owner"), false);
    assert.match(contentDispositionAttachment("file.csv"), /attachment/);
    assert.ok(securityResponseHeaders()["X-Frame-Options"]);
    assert.equal(
      resolveSettingsSection("#workflow", "general", ["workflow", "general"]),
      "workflow",
    );
    assert.ok(mobileAuthShellClass("extra").includes("extra"));
    assert.ok(monthGrid(2026, 0).length >= 28);
    const sparseTitle = mapCsvToImports([
      ["Title"],
      [""],
    ]);
    assert.equal(sparseTitle.rows.length, 0);
  });
});
