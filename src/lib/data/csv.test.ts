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
        {
          title: "No due",
          status: "",
          priority: "",
          dueOn: null,
          assigneeEmails: [],
          type: "",
          groupName: "",
        },
      ]),
    );
    assert.match(csv, /title,status/);
    assert.match(csv, /Ship/);
    assert.match(csv, /No due/);
  });

  it("covers parseCsv line endings and import edge cases", () => {
    assert.deepEqual(parseCsv("a\r,b"), [["a", "b"]]);
    assert.deepEqual(parseCsv("x\ry"), [["xy"]]);
    assert.deepEqual(parseCsv("\r\n"), []);
    assert.deepEqual(parseCsv('in,"q""uote"'), [["in", 'q"uote']]);
    assert.equal(normalizeImportHeader("unknown"), null);
    assert.equal(normalizeImportHeader("Name"), "title");
    const empty = mapCsvToImports([]);
    assert.deepEqual(empty.errors, ["CSV is empty"]);
    const withUnknownCol = mapCsvToImports([
      ["title", "bogus", "status"],
      ["T", "skip", "done"],
    ]);
    assert.equal(withUnknownCol.rows[0].status, "done");
    const sparse = mapCsvToImports([
      ["title", "status"],
      ["Full defaults"],
    ]);
    assert.equal(sparse.rows[0].status, "backlog");
    assert.equal(sparse.rows[0].priority, "minor");
    assert.equal(sparse.rows[0].type, "task");
    assert.equal(sparse.rows[0].assigneeEmail, null);
    const partial = exportRowsToCsv([
      {
        title: "x",
        status: "backlog",
        priority: "minor",
        due: "",
        assignee: "",
        type: "task",
        group: "",
      },
    ]);
    assert.ok(partial.includes("x"));
    const blankTitle = mapCsvToImports([
      ["title", "status"],
      ["   ", "backlog"],
    ]);
    assert.equal(blankTitle.rows.length, 0);
    assert.ok(blankTitle.errors.length);
    const holeyRow = {
      title: "y",
      status: "backlog",
      priority: "minor",
      due: "",
      assignee: "",
      type: "task",
      group: "",
    };
    delete (holeyRow as { group?: string }).group;
    assert.ok(exportRowsToCsv([holeyRow as import("./csv").CsvExportRow]).includes("y"));
    const sparseTitle = mapCsvToImports([
      ["title", "status"],
      [undefined as unknown as string, "backlog"],
    ]);
    assert.equal(sparseTitle.rows.length, 0);
  });
});
