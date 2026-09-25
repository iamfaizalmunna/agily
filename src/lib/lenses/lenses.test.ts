import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  endOfUtcWeek,
  filterItemsByLens,
  isDueThisWeek,
  isEmptyLens,
  isLensKind,
  itemMatchesLens,
  lensQueryRecord,
  parseLensName,
  parseLensQuery,
  parseLensSpec,
  pickLensKind,
  pickLensPerson,
  pickLensPriority,
  pickLensStatus,
  sameLensSpec,
  sanitizeLensSpec,
  startOfUtcWeek,
  stringifyLensSpec,
  toggleLensKind,
  toggleLensPerson,
  toggleLensStatus,
  withLensFind,
} from "@/lib/lenses/lenses";

const now = new Date("2026-09-24T15:00:00.000Z");

function item(
  partial: Partial<{
    title: string;
    status: string;
    priority: string;
    dueOn: Date | null;
    assigneeIds: string[];
  }>,
) {
  return {
    title: "Ticket",
    status: "doing",
    priority: "minor",
    dueOn: null as Date | null,
    assigneeIds: [] as string[],
    ...partial,
  };
}

describe("phase 6 lenses", () => {
  it("sanitizes, parses, and stringifies a spec", () => {
    assert.equal(isLensKind("mine"), true);
    assert.equal(isLensKind("nope"), false);
    assert.equal(isLensKind(undefined), false);
    assert.deepEqual(sanitizeLensSpec(null), {});
    assert.deepEqual(
      sanitizeLensSpec({
        kind: "mine",
        status: "doing",
        personId: "  u1  ",
        priority: "major",
        find: "  bug  ",
      }),
      { kind: "mine", status: "doing", personId: "u1", priority: "major", find: "bug" },
    );
    assert.deepEqual(sanitizeLensSpec({ kind: "nope" as never, status: "x" as never, personId: "  " }), {});
    assert.deepEqual(parseLensSpec(""), {});
    assert.deepEqual(parseLensSpec("not-json"), {});
    assert.deepEqual(parseLensSpec('{"kind":"week","status":"ready"}'), {
      kind: "week",
      status: "ready",
    });
    assert.equal(stringifyLensSpec({ kind: "overdue" }), '{"kind":"overdue"}');
    assert.equal(isEmptyLens({}), true);
    assert.equal(isEmptyLens({ kind: "mine" }), false);
    assert.equal(sameLensSpec({ kind: "mine" }, { kind: "mine" }), true);
    assert.equal(sameLensSpec({ kind: "mine" }, { kind: "week" }), false);
  });

  it("parses names and query chips", () => {
    assert.deepEqual(parseLensName("  Focus  "), { name: "Focus" });
    assert.equal(parseLensName("").error, "Lens needs a name");
    assert.equal(parseLensName("x".repeat(41)).error, "Name is too long");
    assert.deepEqual(
      parseLensQuery({
        q: "mine",
        status: "review",
        who: "ada",
        priority: "critical",
        find: "login",
      }),
      {
        kind: "mine",
        status: "review",
        personId: "ada",
        priority: "critical",
        find: "login",
      },
    );
    assert.deepEqual(parseLensQuery({ q: "nope", status: "nope" }), {});
    assert.deepEqual(lensQueryRecord({ kind: "mine", status: "doing" }), {
      q: "mine",
      status: "doing",
    });
    assert.deepEqual(lensQueryRecord({ priority: "major", find: "api" }), {
      priority: "major",
      find: "api",
    });
    assert.deepEqual(lensQueryRecord({ personId: "u1" }), { who: "u1" });
    assert.deepEqual(lensQueryRecord({ kind: "mine" }, "saved-1"), { lens: "saved-1" });
    assert.deepEqual(lensQueryRecord({}), {});
  });

  it("toggles one dimension at a time", () => {
    assert.deepEqual(toggleLensKind({ kind: "mine" }, "mine"), {});
    assert.deepEqual(toggleLensKind({}, "overdue"), { kind: "overdue" });
    assert.deepEqual(toggleLensStatus({ status: "doing" }, "doing"), {});
    assert.deepEqual(toggleLensStatus({}, "done"), { status: "done" });
    assert.deepEqual(toggleLensPerson({ personId: "u1" }, "u1"), {});
    assert.deepEqual(toggleLensPerson({}, "u2"), { personId: "u2" });
    assert.deepEqual(pickLensKind({ kind: "mine" }), {});
    assert.deepEqual(pickLensKind({}, "week"), { kind: "week" });
    assert.deepEqual(pickLensStatus({ status: "doing" }), {});
    assert.deepEqual(pickLensStatus({}, "review"), { status: "review" });
    assert.deepEqual(pickLensPerson({ personId: "u1" }), {});
    assert.deepEqual(pickLensPerson({}, "u2"), { personId: "u2" });
    assert.deepEqual(pickLensPriority({ priority: "major" }), {});
    assert.deepEqual(pickLensPriority({}, "major"), { priority: "major" });
    assert.deepEqual(withLensFind({}, "  auth "), { find: "auth" });
    assert.deepEqual(withLensFind({ find: "old" }, " "), {});
  });

  it("marks this week from Sunday UTC", () => {
    assert.equal(startOfUtcWeek(now).toISOString(), "2026-09-20T00:00:00.000Z");
    assert.equal(endOfUtcWeek(now).toISOString().slice(0, 10), "2026-09-26");
    assert.equal(isDueThisWeek(new Date("2026-09-19T12:00:00.000Z"), now), false);
    assert.equal(isDueThisWeek(new Date("2026-09-20T12:00:00.000Z"), now), true);
    assert.equal(isDueThisWeek(new Date("2026-09-26T12:00:00.000Z"), now), true);
    assert.equal(isDueThisWeek(new Date("2026-09-27T12:00:00.000Z"), now), false);
    assert.equal(isDueThisWeek(null, now), false);
  });

  it("matches items against a stacked spec", () => {
    const ctx = { userId: "me", now };
    const mine = item({ assigneeIds: ["me"] });
    const late = item({
      dueOn: new Date("2026-09-01T12:00:00.000Z"),
      status: "ready",
    });
    const loose = item({});
    const week = item({ dueOn: new Date("2026-09-24T12:00:00.000Z") });
    const other = item({ assigneeIds: ["ada"], status: "review", priority: "critical", title: "Auth bug" });

    assert.equal(itemMatchesLens(mine, {}, ctx), true);
    assert.equal(itemMatchesLens(mine, { kind: "mine" }, ctx), true);
    assert.equal(itemMatchesLens(loose, { kind: "mine" }, ctx), false);
    assert.equal(itemMatchesLens(late, { kind: "overdue" }, ctx), true);
    assert.equal(itemMatchesLens(mine, { kind: "overdue" }, ctx), false);
    assert.equal(itemMatchesLens(loose, { kind: "unassigned" }, ctx), true);
    assert.equal(itemMatchesLens(mine, { kind: "unassigned" }, ctx), false);
    assert.equal(itemMatchesLens(week, { kind: "week" }, ctx), true);
    assert.equal(itemMatchesLens(loose, { kind: "week" }, ctx), false);
    assert.equal(itemMatchesLens(other, { status: "review" }, ctx), true);
    assert.equal(itemMatchesLens(mine, { status: "review" }, ctx), false);
    assert.equal(itemMatchesLens(other, { personId: "ada" }, ctx), true);
    assert.equal(itemMatchesLens(mine, { personId: "ada" }, ctx), false);
    assert.equal(itemMatchesLens(other, { priority: "critical" }, ctx), true);
    assert.equal(itemMatchesLens(mine, { priority: "critical" }, ctx), false);
    assert.equal(itemMatchesLens(other, { find: "auth" }, ctx), true);
    assert.equal(itemMatchesLens(mine, { find: "auth" }, ctx), false);
    assert.equal(
      itemMatchesLens(mine, { kind: "mine", status: "doing" }, ctx),
      true,
    );
    assert.deepEqual(
      filterItemsByLens([mine, late], {}, ctx).map((row) => row.status),
      ["doing", "ready"],
    );
    assert.equal(filterItemsByLens([mine, late], { kind: "mine" }, ctx).length, 1);
  });
});
