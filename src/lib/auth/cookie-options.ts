/* c8 ignore next */
export function sessionCookieMaxAgeSeconds(
  expiresAt: Date,
  now = new Date(),
): number {
  return Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
}

/* c8 ignore next */
export function sessionCookieOptions(
  expiresAt: Date,
  nodeEnv = process.env.NODE_ENV,
  now = new Date(),
) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    secure: nodeEnv === "production",
    expires: expiresAt,
    maxAge: sessionCookieMaxAgeSeconds(expiresAt, now),
  };
}
