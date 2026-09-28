import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectCustomFieldsFromForm,
  fieldSchemaFromPayload,
  mergeCustomFieldDefs,
  parseCustomFields,
  parseFieldSchema,
  serializeCustomFields,
  serializeFieldSchema,
  slugifyFieldKey,
  validateFieldValue,
} from "./fields";

describe("custom-fields/fields", () => {
  it("parses and serializes field schema", () => {
    assert.deepEqual(parseFieldSchema(""), []);
    assert.deepEqual(parseFieldSchema(null), []);
    assert.deepEqual(parseFieldSchema(undefined), []);
    assert.deepEqual(parseFieldSchema("[]"), []);
    assert.deepEqual(parseFieldSchema("{"), []);
    const defs = [
      {
        id: "f_story_points",
        key: "story_points",
        label: "Story points",
        type: "number" as const,
      },
    ];
    const json = serializeFieldSchema(defs);
    assert.deepEqual(parseFieldSchema(json), defs);
    assert.equal(fieldSchemaFromPayload({}), null);
    assert.equal(
      fieldSchemaFromPayload([
        { id: "9bad", key: "x", label: "X", type: "text" },
      ]),
      null,
    );
    const select = fieldSchemaFromPayload([
      {
        id: "f_env",
        key: "env",
        label: "Env",
        type: "select",
        options: ["prod", "staging"],
      },
    ]);
    assert.ok(select);
  });

  it("parses custom field values", () => {
    assert.deepEqual(parseCustomFields(""), {});
    assert.deepEqual(parseCustomFields(null), {});
    assert.deepEqual(parseCustomFields(undefined), {});
    assert.deepEqual(parseCustomFields("{"), {});
    const values = { f_story_points: 3, f_note: "ok", f_empty: null };
    assert.deepEqual(
      parseCustomFields(serializeCustomFields(values)),
      values,
    );
  });

  it("validates values and form collection", () => {
    const def = {
      id: "f_pts",
      key: "pts",
      label: "Points",
      type: "number" as const,
    };
    assert.equal(validateFieldValue(def, ""), null);
    assert.equal(validateFieldValue(def, "2"), 2);
    const badNum = validateFieldValue(def, "nope");
    assert.equal(typeof badNum === "object" && badNum !== null && "error" in badNum, true);
    const form = new FormData();
    form.set("cf_f_pts", "5");
    const collected = collectCustomFieldsFromForm([def], form);
    assert.ok(!("error" in collected));
    assert.equal(collected.values.f_pts, 5);
    form.set("cf_f_pts", "bad");
    const bad = collectCustomFieldsFromForm([def], form);
    assert.ok("error" in bad);
  });

  it("merges new field definitions", () => {
    assert.equal(slugifyFieldKey("  Hello World!! "), "hello_world");
    assert.equal(slugifyFieldKey("!!!"), "field");
    const first = mergeCustomFieldDefs([], {
      label: "Risk",
      type: "text",
    });
    assert.ok(!("error" in first));
    const second = mergeCustomFieldDefs(first, {
      label: "Risk",
      type: "text",
    });
    assert.ok(!("error" in second));
    assert.equal(second.length, 2);
    assert.equal((second[1] as { key: string }).key, "risk_2");
    const select = mergeCustomFieldDefs([], {
      label: "Tier",
      type: "select",
      options: [],
    });
    assert.ok("error" in select);
    const textDef = {
      id: "f_note",
      key: "note",
      label: "Note",
      type: "text" as const,
    };
    assert.equal(validateFieldValue(textDef, "hello"), "hello");
    const tooLong = validateFieldValue(textDef, "x".repeat(501));
    assert.equal(
      typeof tooLong === "object" && tooLong !== null && "error" in tooLong,
      true,
    );
    const pick = {
      id: "f_tier",
      key: "tier",
      label: "Tier",
      type: "select" as const,
      options: ["a", "b"],
    };
    assert.equal(validateFieldValue(pick, "a"), "a");
    const badPick = validateFieldValue(pick, "z");
    assert.equal(
      typeof badPick === "object" && badPick !== null && "error" in badPick,
      true,
    );
    assert.deepEqual(parseCustomFields('{"n":true,"s":"ok"}'), { s: "ok" });
    const badType = mergeCustomFieldDefs([], {
      label: "X",
      type: "nope" as "text",
    });
    assert.ok("error" in badType);
    const emptyLabel = mergeCustomFieldDefs([], { label: "  ", type: "text" });
    assert.ok("error" in emptyLabel);
    const dupId = mergeCustomFieldDefs(
      [{ id: "f_risk_2", key: "risk", label: "Risk", type: "text" }],
      { label: "Risk", type: "text" },
    );
    assert.ok("error" in dupId);
    const withOptions = mergeCustomFieldDefs([], {
      label: "Env",
      type: "select",
      options: [" prod ", "staging"],
    });
    assert.ok(!("error" in withOptions));
    assert.deepEqual((withOptions[0] as { options: string[] }).options, [
      "prod",
      "staging",
    ]);
    assert.equal(
      fieldSchemaFromPayload([
        { id: "f_a", key: "a", label: "A", type: "select", options: [] },
      ]),
      null,
    );
    assert.equal(
      fieldSchemaFromPayload([
        { id: "f_a", key: "a", label: "A", type: "text" },
        { id: "f_a", key: "b", label: "B", type: "text" },
      ]),
      null,
    );
    assert.deepEqual(parseFieldSchema('{"not":"array"}'), []);
    assert.equal(
      fieldSchemaFromPayload([
        { id: "f_x", key: "x", label: "X", type: "nope" },
      ]),
      null,
    );
    const collectedSelect = collectCustomFieldsFromForm(
      [
        {
          id: "f_tier",
          key: "tier",
          label: "Tier",
          type: "select",
          options: ["a"],
        },
      ],
      (() => {
        const form = new FormData();
        form.set("cf_f_tier", "missing");
        return form;
      })(),
    );
    assert.ok("error" in collectedSelect);
  });
});
