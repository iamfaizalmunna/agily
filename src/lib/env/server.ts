const MIN_SESSION_SECRET_LEN = 32;

export type ServerEnvIssue = { key: string; message: string };

export function validateServerEnv(
  env: Record<string, string | undefined> = process.env,
): ServerEnvIssue[] {
  const issues: ServerEnvIssue[] = [];
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    issues.push({ key: "DATABASE_URL", message: "DATABASE_URL is required" });
  }

  const secret = env.SESSION_SECRET?.trim() ?? "";
  const nodeEnv = env.NODE_ENV ?? "development";
  if (nodeEnv === "production") {
    if (secret.length < MIN_SESSION_SECRET_LEN) {
      issues.push({
        key: "SESSION_SECRET",
        message: `SESSION_SECRET must be at least ${MIN_SESSION_SECRET_LEN} characters in production`,
      });
    }
  } else if (!secret) {
    issues.push({
      key: "SESSION_SECRET",
      message: "SESSION_SECRET is required (use a long random string in .env)",
    });
  }

  return issues;
}

export function assertServerEnv(
  env: Record<string, string | undefined> = process.env,
) {
  const issues = validateServerEnv(env);
  if (!issues.length) return;
  const detail = issues.map((row) => `${row.key}: ${row.message}`).join("; ");
  throw new Error(`Invalid server environment — ${detail}`);
}
