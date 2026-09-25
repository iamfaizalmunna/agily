import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  timelineBar,
  timelineSpan,
  timelineWeekLabels,
  todayMarker,
} from "@/lib/views/timeline";

const now = new Date("2026-09-24T12:00:00.000Z");

describe("timeline view", () => {
  it("lays bars on a shared span", () => {
    const items = [
      {
        id: "1",
        title: "Task",
        status: "doing",
        createdAt: new Date("2026-09-20T00:00:00.000Z"),
        dueOn: new Date("2026-09-28T00:00:00.000Z"),
      },
    ];
    const span = timelineSpan(items, now);
    assert.ok(span.span > 0);
    const bar = timelineBar(items[0]!, span.start, span.span);
    assert.ok(bar.width >= 4);
    assert.equal(timelineWeekLabels(span.start, span.span).length, 5);
    assert.ok(todayMarker(now, span.start, span.span) !== null);
  });
});
