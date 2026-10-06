import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatSecurityEventLine,
  isSecurityEventKind,
  sanitizeSecurityMeta,
  serializeSecurityMeta,
} from "@/lib/security/audit-log-meta";

describe("security/audit-log", () => {
  it("recognizes event kinds", () => {
    assert.equal(isSecurityEventKind("sign_out"), true);
    assert.equal(isSecurityEventKind("nope"), false);
  });

  it("redacts sensitive meta keys", () => {
    const clean = sanitizeSecurityMeta({
      email: "a@b.com",
      password: "nope",
      inviteToken: "secret",
    });
    assert.equal(clean.email, "a@b.com");
    assert.equal(clean.password, undefined);
    assert.equal(clean.inviteToken, undefined);
    assert.equal(
      sanitizeSecurityMeta({ note: "session=abc" }).note,
      undefined,
    );
    assert.equal(
      serializeSecurityMeta({ sessionId: "x", role: "admin" }),
      '{"role":"admin"}',
    );
  });

  it("formats event lines", () => {
    const line = formatSecurityEventLine({
      kind: "role_change",
      createdAt: new Date(),
      meta: JSON.stringify({ previousRole: "member", targetRole: "admin" }),
      actor: { name: "Ada" },
    });
    assert.match(line, /role change · Ada · member → admin/);
    const broken = formatSecurityEventLine({
      kind: "sign_in_failure",
      createdAt: new Date(),
      meta: "{",
      actor: null,
    });
    assert.match(broken, /Someone/);
    assert.match(
      formatSecurityEventLine({
        kind: "csv_export",
        createdAt: new Date(),
        meta: JSON.stringify({ projectSlug: "atlas" }),
        actor: { name: "Bob" },
      }),
      /atlas/,
    );
    assert.match(
      formatSecurityEventLine({
        kind: "invite_created",
        createdAt: new Date(),
        meta: JSON.stringify({ email: "a@b.com" }),
        actor: { name: "Bob" },
      }),
      /a@b.com/,
    );
    assert.equal(
      formatSecurityEventLine({
        kind: "sign_out",
        createdAt: new Date(),
        meta: "{}",
        actor: { name: "Ada" },
      }),
      "sign out · Ada",
    );
  });
});
