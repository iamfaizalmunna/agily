export const SESSION_DAYS = 30;
export const SESSION_COOKIE = "agily_session";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function sessionExpiry(from = new Date(), days = SESSION_DAYS) {
  const expiresAt = new Date(from.getTime());
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}

export function isSessionFresh(expiresAt: Date, now = new Date()) {
  return expiresAt.getTime() > now.getTime();
}
