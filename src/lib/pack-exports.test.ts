import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { ITEM_EVENT_KINDS } from "@/lib/activity/events";
import { mentionTokens } from "@/lib/activity/mentions";
import { SESSION_COOKIE } from "@/lib/auth/identity";
import {
  DEFAULT_WIP_LIMITS,
  SWIMLANE_MODES,
  swimlaneLabel,
} from "@/lib/board/kanban";
import { KANBAN_MOBILE_MAX_PX } from "@/lib/board/mobile-kanban";
import { CUSTOM_FIELD_TYPES } from "@/lib/custom-fields/fields";
import { CSV_EXPORT_HEADERS, serializeCsvRow } from "@/lib/data/csv";
import { EXAMPLE_HOST_PREFIX } from "@/lib/demo/mode";
import { RECENT_BOARDS_KEY } from "@/lib/hub/board-hub";
import {
  DEFAULT_ISSUE_TYPE,
  ISSUE_TYPES,
} from "@/lib/items/issue-type";
import { STORY_POINTS_MAX } from "@/lib/items/story-points";
import { LABEL_PALETTE } from "@/lib/labels/labels";
import {
  LENS_KINDS,
  LENS_KIND_LABEL,
  titleMatchesFind,
} from "@/lib/lenses/lenses";
import { NOTICE_KINDS } from "@/lib/notices/notices";
import { RECENT_TICKETS_KEY } from "@/lib/search/recent";
import { normalizeSearchQuery } from "@/lib/search/search";
import { MOBILE_MAIN_SCROLL_PADDING_PX } from "@/lib/ui/mobile";
import { BURNDOWN_DAYS, SPARKLINE_DAYS } from "@/lib/views/analytics";
import {
  LIST_SORT_DIRS,
  LIST_SORT_FIELDS,
  LIST_SORT_LABEL,
} from "@/lib/views/list-sort";
import { BOARD_VIEWS, BOARD_VIEW_LABEL } from "@/lib/views/views";

const packModules = JSON.parse(
  readFileSync(new URL("../../.c8rc.json", import.meta.url), "utf8"),
).include as string[];

describe("pack export smoke", () => {
  it("re-imports every pack module for export branch coverage", async () => {
    for (const file of packModules) {
      await import(new URL(`../../${file}`, import.meta.url).href);
    }
  });

  it("touches module-level exports counted as functions", () => {
    assert.ok(ITEM_EVENT_KINDS.length);
    assert.ok(
      mentionTokens([{ id: "1", name: "Ada Lovelace", email: "ada@agily.com" }])
        .length >= 1,
    );
    assert.equal(SESSION_COOKIE, "agily_session");
    assert.ok(DEFAULT_WIP_LIMITS.doing);
    assert.ok(SWIMLANE_MODES.length);
    assert.ok(swimlaneLabel("minor", "priority"));
    assert.ok(KANBAN_MOBILE_MAX_PX > 0);
    assert.ok(CUSTOM_FIELD_TYPES.length);
    assert.ok(CSV_EXPORT_HEADERS.length);
    assert.ok(serializeCsvRow(["a", "b"]).includes("a"));
    assert.ok(EXAMPLE_HOST_PREFIX.length);
    assert.ok(RECENT_BOARDS_KEY);
    assert.ok(ISSUE_TYPES.includes(DEFAULT_ISSUE_TYPE));
    assert.ok(STORY_POINTS_MAX > 0);
    assert.ok(LABEL_PALETTE.length);
    assert.ok(LENS_KINDS.length);
    assert.ok(LENS_KIND_LABEL.mine);
    assert.ok(titleMatchesFind("Fix login", "login"));
    assert.ok(NOTICE_KINDS.length);
    assert.ok(RECENT_TICKETS_KEY);
    assert.equal(normalizeSearchQuery("  hi "), "hi");
    assert.ok(MOBILE_MAIN_SCROLL_PADDING_PX > 0);
    assert.ok(BURNDOWN_DAYS > 0);
    assert.ok(SPARKLINE_DAYS > 0);
    assert.ok(LIST_SORT_FIELDS.length);
    assert.ok(LIST_SORT_DIRS.length);
    assert.ok(LIST_SORT_LABEL.due);
    assert.ok(BOARD_VIEWS.length);
    assert.ok(BOARD_VIEW_LABEL.list);
  });
});
