import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  contentDispositionAttachment,
  safeDownloadFilename,
} from "@/lib/security/filename";

describe("security/filename", () => {
  it("sanitizes hostile slugs", () => {
    assert.equal(safeDownloadFilename("atlas"), "atlas-export.csv");
    assert.equal(
      safeDownloadFilename('..\\etc\\passwd"'),
      "download-export.csv",
    );
    assert.equal(safeDownloadFilename(""), "download-export.csv");
  });

  it("builds Content-Disposition without injection", () => {
    assert.equal(
      contentDispositionAttachment('evil"\r\n.csv'),
      'attachment; filename="evil.csv"',
    );
    assert.equal(
      contentDispositionAttachment("path\\to\\file.csv"),
      'attachment; filename="pathtofile.csv"',
    );
  });

  it("falls back when composed name is unsafe", () => {
    assert.equal(safeDownloadFilename("ok", "../evil"), "download-../evil");
  });
});
