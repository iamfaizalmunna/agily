import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { defaultGroupSeed } from "../src/lib/items/defaults";
import {
  DEFAULT_TEAM_SETTINGS,
  stringifyTeamSettings,
} from "../src/lib/rbac/roles";

const prisma = new PrismaClient();
const PASSWORD = "password123";
export const E2E_TEAM_SLUG = "northwind-e2e";
export const E2E_PROJECT_SLUG = "atlas";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  const owner = await prisma.user.upsert({
    where: { email: "owner@studio.local" },
    update: { name: "Owner", passwordHash },
    create: {
      email: "owner@studio.local",
      name: "Owner",
      passwordHash,
    },
  });

  let team = await prisma.team.findUnique({ where: { slug: E2E_TEAM_SLUG } });
  if (!team) {
    team = await prisma.team.create({
      data: {
        name: "Northwind",
        slug: E2E_TEAM_SLUG,
        settings: stringifyTeamSettings(DEFAULT_TEAM_SETTINGS),
        members: { create: { userId: owner.id, role: "owner" } },
      },
    });
  }

  await prisma.teamMember.upsert({
    where: { teamId_userId: { teamId: team.id, userId: owner.id } },
    update: { role: "owner" },
    create: { teamId: team.id, userId: owner.id, role: "owner" },
  });

  let project = await prisma.project.findFirst({
    where: { teamId: team.id, slug: E2E_PROJECT_SLUG },
    include: { groups: true },
  });
  if (!project) {
    project = await prisma.project.create({
      data: {
        teamId: team.id,
        name: "Atlas",
        slug: E2E_PROJECT_SLUG,
        groups: { create: defaultGroupSeed() },
      },
      include: { groups: true },
    });
  }

  const now = project.groups.find((group) => group.name === "Now");
  if (!now) throw new Error("Now group missing");

  const count = await prisma.item.count({ where: { projectId: project.id } });
  if (!count) {
    await prisma.item.create({
      data: {
        projectId: project.id,
        groupId: now.id,
        title: "Seed ticket for Playwright",
        status: "doing",
        position: 0,
        assignees: { create: { userId: owner.id } },
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
