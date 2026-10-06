import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_NOTICE_PREFS,
  NOTICE_PREFS_KEY,
  parseNoticePrefs,
} from "@/lib/notices/prefs";

describe("notice prefs", () => {
  it("defaults when storage is empty or invalid", () => {
    assert.deepEqual(parseNoticePrefs(null), DEFAULT_NOTICE_PREFS);
    assert.deepEqual(parseNoticePrefs(""), DEFAULT_NOTICE_PREFS);
    assert.deepEqual(parseNoticePrefs("{"), DEFAULT_NOTICE_PREFS);
  });

  it("merges partial JSON", () => {
    assert.deepEqual(
      parseNoticePrefs(JSON.stringify({ sound: false })),
      { sound: false, toast: true, boardActivity: true },
    );
    assert.deepEqual(
      parseNoticePrefs(
        JSON.stringify({ toast: false, boardActivity: false }),
      ),
      { sound: true, toast: false, boardActivity: false },
    );
  });

  it("uses a stable storage key", () => {
    assert.equal(NOTICE_PREFS_KEY, "agily:notice-prefs");
  });
});
