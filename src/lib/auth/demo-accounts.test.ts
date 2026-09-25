import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEMO_ACCOUNT_COUNT,
  DEMO_ACCOUNTS,
  DEMO_EMAIL_DOMAIN,
  DEMO_PASSWORD,
} from "@/lib/auth/demo-accounts";

describe("demo accounts", () => {
  it("lists four studio roles with one shared password", () => {
    assert.equal(DEMO_PASSWORD, "password123");
    assert.equal(DEMO_EMAIL_DOMAIN, "agily.com");
    assert.deepEqual(
      DEMO_ACCOUNTS.map((row) => row.role),
      ["owner", "admin", "member", "viewer"],
    );
    assert.equal(new Set(DEMO_ACCOUNTS.map((row) => row.email)).size, 4);
    assert.equal(DEMO_ACCOUNTS.at(-1)?.name, "Viewer");
    assert.equal(DEMO_ACCOUNTS.at(-1)?.email, "viewer@agily.com");
    assert.equal(DEMO_ACCOUNT_COUNT, 4);
  });
});
