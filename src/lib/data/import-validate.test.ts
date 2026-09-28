import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultWorkflow } from "@/lib/workflow/workflow";
import { validateImportRow } from "./import-validate";

describe("data/import-validate", () => {
  it("validates import rows against workflow", () => {
    const workflow = defaultWorkflow();
    const ok = validateImportRow(
      {
        line: 2,
        title: "Hello",
        status: "backlog",
        priority: "major",
        due: "2026-02-01",
        assigneeEmail: null,
        type: "bug",
        group: "",
      },
      workflow,
    );
    assert.ok(!("error" in ok));
    const badStatus = validateImportRow(
      {
        line: 3,
        title: "Hi",
        status: "nope",
        priority: "minor",
        due: "",
        assigneeEmail: null,
        type: "task",
        group: "",
      },
      workflow,
    );
    assert.ok("error" in badStatus);
    const badTitle = validateImportRow(
      {
        line: 4,
        title: "",
        status: "backlog",
        priority: "minor",
        due: "",
        assigneeEmail: null,
        type: "task",
        group: "",
      },
      workflow,
    );
    assert.ok("error" in badTitle);
    const badDue = validateImportRow(
      {
        line: 5,
        title: "Due",
        status: "backlog",
        priority: "minor",
        due: "not-a-date",
        assigneeEmail: null,
        type: "task",
        group: "",
      },
      workflow,
    );
    assert.ok("error" in badDue);
  });
});
