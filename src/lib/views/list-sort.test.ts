import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  defaultListSortDir,
  isListSortDir,
  isListSortField,
  listSortQuery,
  nextListSortToggle,
  parseListSort,
  sortListItems,
} from "@/lib/views/list-sort";

describe("list sort", () => {
  const rows = [
    {
      id: "a",
      position: 2,
      priority: "minor",
      dueOn: new Date("2026-10-05T12:00:00Z"),
      updatedAt: new Date("2026-10-01T12:00:00Z"),
    },
    {
      id: "b",
      position: 1,
      priority: "critical",
      dueOn: null,
      updatedAt: new Date("2026-10-03T12:00:00Z"),
    },
  ];

  it("parses sort config", () => {
    assert.deepEqual(parseListSort("due", "asc"), { field: "due", dir: "asc" });
    assert.equal(parseListSort("", ""), null);
    assert.equal(parseListSort("nope", "asc"), null);
  });

  it("toggles direction on same field", () => {
    assert.deepEqual(
      nextListSortToggle({ field: "due", dir: "asc" }, "due"),
      { field: "due", dir: "desc" },
    );
    assert.deepEqual(nextListSortToggle(null, "priority"), {
      field: "priority",
      dir: "desc",
    });
  });

  it("serializes query params", () => {
    assert.deepEqual(listSortQuery({ field: "key", dir: "asc" }), {
      sort: "key",
      sortDir: "asc",
    });
    assert.deepEqual(listSortQuery(null), {});
  });

  it("sorts by issue key position", () => {
    const sorted = sortListItems(rows, { field: "key", dir: "asc" });
    assert.deepEqual(sorted.map((row) => row.id), ["b", "a"]);
  });

  it("sorts priority descending by default path", () => {
    const sorted = sortListItems(rows, { field: "priority", dir: "desc" });
    assert.equal(sorted[0]?.id, "b");
  });

  it("uses default direction when sortDir missing", () => {
    assert.deepEqual(parseListSort("updated", ""), {
      field: "updated",
      dir: "desc",
    });
    assert.equal(defaultListSortDir("due"), "asc");
    assert.ok(isListSortField("due"));
    assert.ok(!isListSortField("title"));
    assert.ok(isListSortDir("asc"));
    assert.ok(!isListSortDir("up"));
  });

  it("sorts due with nulls last ascending", () => {
    const sorted = sortListItems(rows, { field: "due", dir: "asc" });
    assert.equal(sorted[0]?.id, "a");
    assert.equal(sorted[1]?.id, "b");
  });

  it("sorts by updated time", () => {
    const sorted = sortListItems(rows, { field: "updated", dir: "asc" });
    assert.equal(sorted[0]?.id, "a");
    assert.equal(sorted[1]?.id, "b");
  });

  it("handles unknown priority as lowest rank", () => {
    const sorted = sortListItems(
      [
        ...rows,
        {
          id: "c",
          position: 3,
          priority: "unknown",
          dueOn: null,
          updatedAt: new Date("2026-10-04T12:00:00Z"),
        },
      ],
      { field: "priority", dir: "desc" },
    );
    assert.equal(sorted[0]?.id, "b");
    assert.equal(sorted.at(-1)?.id, "c");
  });

  it("covers parse toggles and tie-break sorts", () => {
    assert.equal(parseListSort("   ", "asc"), null);
    assert.equal(parseListSort(null, "asc"), null);
    assert.deepEqual(parseListSort("due", "sideways"), {
      field: "due",
      dir: "asc",
    });
    assert.deepEqual(parseListSort("priority", "desc"), {
      field: "priority",
      dir: "desc",
    });
    assert.deepEqual(parseListSort("due", undefined), { field: "due", dir: "asc" });
    assert.deepEqual(
      nextListSortToggle({ field: "due", dir: "desc" }, "due"),
      { field: "due", dir: "asc" },
    );
    const tied = sortListItems(
      [
        {
          id: "a",
          position: 2,
          priority: "minor",
          dueOn: new Date("2026-10-01T12:00:00Z"),
          updatedAt: new Date("2026-10-01T12:00:00Z"),
        },
        {
          id: "b",
          position: 1,
          priority: "minor",
          dueOn: new Date("2026-10-01T12:00:00Z"),
          updatedAt: new Date("2026-10-01T12:00:00Z"),
        },
      ],
      { field: "due", dir: "asc" },
    );
    assert.deepEqual(tied.map((row) => row.id), ["b", "a"]);
  });
});
