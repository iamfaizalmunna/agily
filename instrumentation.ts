export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;
  const { assertServerEnv } = await import("@/lib/env/server");
  assertServerEnv();
}
