import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterHubProjects,
  lastBoardViewForProject,
  parseRecentBoards,
  pushRecentBoard,
  RECENT_BOARD_LIMIT,
  recentBoardsForTeam,
} from "@/lib/hub/board-hub";

describe("hub/board-hub", () => {
  it("round-trips recent boards per studio", () => {
    const one = pushRecentBoard([], {
      teamSlug: "northwind",
      projectSlug: "atlas",
      projectName: "Atlas",
      view: "flow",
    });
    const two = pushRecentBoard(one, {
      teamSlug: "northwind",
      projectSlug: "demo",
      projectName: "Demo",
      view: "list",
    });
    assert.equal(two[0].projectSlug, "demo");
    const again = pushRecentBoard(two, {
      teamSlug: "northwind",
      projectSlug: "atlas",
      projectName: "Atlas",
      view: "timeline",
    });
    assert.equal(again[0].view, "timeline");
    assert.equal(recentBoardsForTeam(again, "northwind").length, 2);
    assert.equal(recentBoardsForTeam(again, "atlas").length, 0);
    assert.equal(parseRecentBoards("not-json").length, 0);
    const json = JSON.stringify(
      Array.from({ length: RECENT_BOARD_LIMIT + 2 }, (_, index) => ({
        teamSlug: "n",
        projectSlug: String(index),
        projectName: "Board",
        view: "summary",
        visitedAt: index,
      })),
    );
    assert.equal(parseRecentBoards(json).length, RECENT_BOARD_LIMIT);
  });

  it("filters projects and resolves last view", () => {
    const projects = [
      { slug: "atlas", name: "Atlas", ticketCount: 10 },
      { slug: "demo", name: "Demo board", ticketCount: 2 },
    ];
    assert.equal(filterHubProjects(projects, "atlas").length, 1);
    assert.equal(filterHubProjects(projects, "").length, 2);
    const recent = pushRecentBoard([], {
      teamSlug: "northwind",
      projectSlug: "atlas",
      projectName: "Atlas",
      view: "list",
    });
    assert.equal(
      lastBoardViewForProject(recent, "northwind", "atlas"),
      "list",
    );
    assert.equal(
      lastBoardViewForProject(recent, "northwind", "missing"),
      undefined,
    );
  });
});
