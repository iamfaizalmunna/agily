#!/usr/bin/env node
/**
 * CI audit policy — see docs/SECURITY_EXCEPTIONS.md.
 * Fails on critical; logs high (mostly dev toolchain) without blocking main.
 */
import { execSync } from "node:child_process";

function auditJson() {
  try {
    return JSON.parse(execSync("npm audit --json", { encoding: "utf8" }));
  } catch (error) {
    const stdout = error.stdout?.toString?.() ?? "";
    if (stdout) return JSON.parse(stdout);
    throw error;
  }
}

const report = auditJson();
const meta = report.metadata?.vulnerabilities ?? {};

if ((meta.critical ?? 0) > 0) {
  console.error("npm audit: critical vulnerabilities present");
  process.exit(1);
}

if ((meta.high ?? 0) > 0) {
  console.warn(
    `npm audit: ${meta.high} high — tracked in docs/SECURITY_EXCEPTIONS.md (CI does not fail on high until resolved)`,
  );
}

console.log("npm audit CI check passed");
process.exit(0);
