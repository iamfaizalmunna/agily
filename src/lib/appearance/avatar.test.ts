import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  avatarContentType,
  avatarFileExtension,
  avatarStorageFilename,
  detectAvatarImageKind,
  validateAvatarBytes,
} from "@/lib/appearance/avatar";

describe("avatar rejects unknown bytes", () => {
  it("reports unsupported type", () => {
    assert.deepEqual(validateAvatarBytes(new Uint8Array([1, 2, 3, 4])), {
      ok: false,
      error: "Use JPEG, PNG, or WebP",
    });
    assert.equal(avatarContentType("png"), "image/png");
    assert.equal(avatarContentType("webp"), "image/webp");
  });
});

describe("avatar upload validation", () => {
  it("detects image kinds from magic bytes", () => {
    assert.equal(detectAvatarImageKind(new Uint8Array([0xff, 0xd8, 0xff, 0x00])), "jpeg");
    assert.equal(
      detectAvatarImageKind(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
      "png",
    );
    const webp = new Uint8Array(12);
    webp.set([0x52, 0x49, 0x46, 0x46], 0);
    webp.set([0x57, 0x45, 0x42, 0x50], 8);
    assert.equal(detectAvatarImageKind(webp), "webp");
    assert.equal(detectAvatarImageKind(new Uint8Array([0, 1, 2])), null);
    assert.equal(detectAvatarImageKind(new Uint8Array(11)), null);
    const riffOnly = new Uint8Array(12);
    riffOnly.set([0x52, 0x49, 0x46, 0x46], 0);
    assert.equal(detectAvatarImageKind(riffOnly), null);
    const notRiff = new Uint8Array(12);
    notRiff.fill(0xaa);
    assert.equal(detectAvatarImageKind(notRiff), null);
  });

  it("validates size and type", () => {
    assert.deepEqual(validateAvatarBytes(new Uint8Array()), {
      ok: false,
      error: "Choose an image file",
    });
    const big = new Uint8Array(2 * 1024 * 1024 + 1);
    big[0] = 0xff;
    big[1] = 0xd8;
    big[2] = 0xff;
    const tooBig = validateAvatarBytes(big);
    assert.equal(tooBig.ok, false);
    if (!tooBig.ok) assert.match(tooBig.error, /2 MB/);
    const ok = validateAvatarBytes(new Uint8Array([0xff, 0xd8, 0xff, 0xee]));
    assert.equal(ok.ok, true);
    if (ok.ok) assert.equal(ok.kind, "jpeg");
  });

  it("names stored files safely", () => {
    assert.equal(avatarFileExtension("jpeg"), "jpg");
    assert.equal(avatarFileExtension("png"), "png");
    assert.equal(avatarFileExtension("webp"), "webp");
    assert.equal(avatarStorageFilename("abc", "webp"), "abc.webp");
    assert.equal(avatarStorageFilename("bad/id", "jpeg"), "badid.jpg");
    assert.equal(avatarStorageFilename("!!!", "png"), "user.png");
    assert.equal(avatarContentType("jpeg"), "image/jpeg");
  });
});
