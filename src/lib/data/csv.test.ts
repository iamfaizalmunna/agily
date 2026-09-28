import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildExportRows,
  escapeCsvField,
  exportRowsToCsv,
  mapCsvToImports,
  normalizeImportHeader,
  parseCsv,
  serializeCsv,
} from "./csv";

describe("data/csv", () => {
  it("escapes and parses CSV", () => {
    assert.equal(escapeCsvField("plain"), "plain");
    assert.equal(escapeCsvField('say "hi"'), '"say ""hi"""');
    const round = parseCsv('a,b\n"line\n2",c');
    assert.deepEqual(round, [["a", "b"], ["line\n2", "c"]]);
    assert.equal(serializeCsv([["a", "b"]]), "a,b");
  });

  it("maps import headers and rows", () => {
    assert.equal(normalizeImportHeader("Due On"), "due");
    const table = [
      ["Title", "Status", "Assignee"],
      ["Fix login", "doing", "owner@agily.com"],
    ];
    const { rows, errors } = mapCsvToImports(table);
    assert.equal(errors.length, 0);
    assert.equal(rows[0].title, "Fix login");
    assert.equal(rows[0].status, "doing");
    assert.equal(rows[0].assigneeEmail, "owner@agily.com");
    const bad = mapCsvToImports([["nope"], ["x"]]);
    assert.ok(bad.errors.length);
    const skipped = mapCsvToImports([
      ["title", "status"],
      ["", "backlog"],
      ["Ok", "ready"],
    ]);
    assert.equal(skipped.rows.length, 1);
    assert.ok(skipped.errors.some((msg) => msg.includes("missing title")));
    assert.deepEqual(parseCsv('"a""b",c'), [['a"b', "c"]]);
  });

  it("exports ticket rows", () => {
    const csv = exportRowsToCsv(
      buildExportRows([
        {
          title: "Ship",
          status: "done",
          priority: "minor",
          dueOn: new Date("2026-01-15T12:00:00.000Z"),
          assigneeEmails: ["a@b.com"],
          type: "task",
          groupName: "Now",
        },
      ]),
    );
    assert.match(csv, /title,status/);
    assert.match(csv, /Ship/);
  });
});
