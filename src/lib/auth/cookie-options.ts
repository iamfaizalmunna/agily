export function sessionCookieOptions(
  expiresAt: Date,
  nodeEnv = process.env.NODE_ENV,
) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    secure: nodeEnv === "production",
    expires: expiresAt,
  };
}
