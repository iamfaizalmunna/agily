import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseRecentTickets,
  pushRecentTicket,
  RECENT_TICKET_LIMIT,
} from "@/lib/search/recent";

describe("revamp R8 recent tickets", () => {
  it("round-trips recent list", () => {
    const one = pushRecentTicket([], {
      id: "a",
      title: "Ship",
      href: "/t/n/p/a",
      key: "ATL-1",
    });
    const two = pushRecentTicket(one, {
      id: "b",
      title: "Fix",
      href: "/t/n/p/b",
      key: "ATL-2",
    });
    assert.equal(two[0].id, "b");
    const again = pushRecentTicket(two, {
      id: "a",
      title: "Ship",
      href: "/t/n/p/a",
      key: "ATL-1",
    });
    assert.equal(again[0].id, "a");
    assert.equal(parseRecentTickets("not-json").length, 0);
    const json = JSON.stringify(
      Array.from({ length: RECENT_TICKET_LIMIT + 2 }, (_, index) => ({
        id: String(index),
        title: "t",
        href: "/",
        key: "K",
        visitedAt: index,
      })),
    );
    assert.equal(parseRecentTickets(json).length, RECENT_TICKET_LIMIT);
  });
});
