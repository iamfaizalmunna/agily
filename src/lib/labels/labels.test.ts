import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectLabelIds,
  itemMatchesLabelFilter,
  labelContrastText,
  labelIdsFromRows,
  mapLabelChips,
  labelIdsQueryValue,
  normalizeLabelColor,
  parseLabelIdsQuery,
  parseLabelName,
  toggleLabelFilter,
} from "./labels";

describe("labels", () => {
  it("parses names and colors", () => {
    assert.deepEqual(parseLabelName("  Bug  "), { name: "Bug" });
    assert.equal(parseLabelName("").error, "Label needs a name");
    assert.equal(parseLabelName("x".repeat(31)).error, "Name is too long");
    assert.equal(normalizeLabelColor("#AABBCC"), "#aabbcc");
    assert.equal(normalizeLabelColor("nope"), "#ef4444");
  });

  it("round-trips label id query chips", () => {
    assert.deepEqual(parseLabelIdsQuery("a,b, c"), ["a", "b", "c"]);
    assert.equal(labelIdsQueryValue(["x", "y"]), "x,y");
    assert.equal(labelIdsQueryValue([]), undefined);
  });

  it("toggles filters and matches items", () => {
    assert.deepEqual(toggleLabelFilter(["a"], "a"), []);
    assert.deepEqual(toggleLabelFilter(["a"], "b"), ["a", "b"]);
    assert.equal(itemMatchesLabelFilter(["a"], undefined), true);
    assert.equal(itemMatchesLabelFilter(["a"], ["b"]), false);
    assert.equal(itemMatchesLabelFilter(["a", "b"], ["b"]), true);
  });

  it("reads label ids from forms", () => {
    const form = new FormData();
    form.append("labelIds", "l1");
    form.append("labelIds", "l2");
    assert.deepEqual(collectLabelIds(form), ["l1", "l2"]);
  });

  it("maps prisma label rows", () => {
    const chips = mapLabelChips([
      { label: { id: "l1", name: "Bug", color: "#ef4444" } },
    ]);
    assert.equal(chips[0].name, "Bug");
    assert.deepEqual(labelIdsFromRows([{ labelId: "l1" }]), ["l1"]);
  });

  it("picks readable text on label chips", () => {
    assert.equal(labelContrastText("#ffffff"), "#0f172a");
    assert.equal(labelContrastText("#0f172a"), "#ffffff");
  });
});
