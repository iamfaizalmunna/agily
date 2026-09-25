import type { TeamRole } from "@/lib/rbac/roles";

/** Same convention as ZenFlow demo users (`*@zenflowai.com` / `password123`). */
export const DEMO_EMAIL_DOMAIN = "agily.com";
export const DEMO_PASSWORD = "password123";

export type DemoAccount = {
  email: string;
  name: string;
  role: TeamRole;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: `owner@${DEMO_EMAIL_DOMAIN}`, name: "Owner", role: "owner" },
  { email: `admin@${DEMO_EMAIL_DOMAIN}`, name: "Admin", role: "admin" },
  { email: `member@${DEMO_EMAIL_DOMAIN}`, name: "Member", role: "member" },
  { email: `viewer@${DEMO_EMAIL_DOMAIN}`, name: "Viewer", role: "viewer" },
];

export const DEMO_ACCOUNT_COUNT = DEMO_ACCOUNTS.length;
