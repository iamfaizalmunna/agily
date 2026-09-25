import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "../src/lib/auth/demo-accounts";
import type { TeamRole } from "../src/lib/rbac/roles";
import { seedDemoStudio } from "./seed/demo-studio";

const prisma = new PrismaClient();
export const E2E_TEAM_SLUG = "northwind";
export const E2E_PROJECT_SLUG = "atlas";

async function upsertDemoUser(
  passwordHash: string,
  email: string,
  name: string,
) {
  return prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const users = new Map<TeamRole, string>();

  for (const account of DEMO_ACCOUNTS) {
    const user = await upsertDemoUser(
      passwordHash,
      account.email,
      account.name,
    );
    users.set(account.role, user.id);
  }

  await seedDemoStudio(prisma, users);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
