import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_CSV_IMPORT_ROWS,
  validateCsvImportSize,
  validateCsvTableBounds,
} from "@/lib/data/import-bounds";

describe("data/import-bounds", () => {
  it("rejects oversized CSV text", () => {
    const big = "x".repeat(600_000);
    assert.equal(validateCsvImportSize(big).error, "CSV is too large (max 512 KB)");
  });

  it("rejects oversized cells", () => {
    const gate = validateCsvTableBounds([["title"], ["x".repeat(2001)]]);
    assert.equal(gate.error, "A CSV cell is too long");
  });

  it("accepts small tables", () => {
    assert.equal(validateCsvTableBounds([["title"], ["ok"]]).ok, true);
    assert.equal(validateCsvTableBounds([]).ok, true);
    assert.equal(validateCsvTableBounds([["title"]]).ok, true);
  });

  it("rejects too many rows", () => {
    const header = ["title"];
    const body = Array.from({ length: MAX_CSV_IMPORT_ROWS + 1 }, () => ["t"]);
    const gate = validateCsvTableBounds([header, ...body]);
    assert.ok(gate.error?.includes("too many rows"));
  });
});
