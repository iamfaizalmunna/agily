import type { PrismaClient } from "@prisma/client";
import { defaultGroupSeed } from "../../src/lib/items/defaults";
import {
  DEFAULT_TEAM_SETTINGS,
  stringifyTeamSettings,
  type TeamRole,
} from "../../src/lib/rbac/roles";

export const DEMO_TEAM_SLUG = "northwind";

type SeedUser = { id: string; role: TeamRole };

type TicketSeed = {
  title: string;
  body?: string;
  status: string;
  priority: string;
  group: "Now" | "Next" | "Later";
  assignees: TeamRole[];
  labels?: string[];
  dueDays?: number;
  comments?: { role: TeamRole; body: string }[];
};

const NORTHWIND_LABELS: { name: string; color: string }[] = [
  { name: "Bug", color: "#ef4444" },
  { name: "Feature", color: "#3b82f6" },
  { name: "Design", color: "#8b5cf6" },
  { name: "Tech debt", color: "#64748b" },
  { name: "QA", color: "#22c55e" },
  { name: "Docs", color: "#eab308" },
  { name: "Performance", color: "#f97316" },
  { name: "Security", color: "#ec4899" },
];

const ATLAS_TICKETS: TicketSeed[] = [
  {
    title: "Redesign sprint board filters",
    status: "doing",
    priority: "major",
    group: "Now",
    labels: ["Feature", "Design"],
    assignees: ["member"],
    dueDays: 2,
    body: "Match Jira quick filters: priority, status, assignee, and text search.",
    comments: [
      { role: "admin", body: "Use the shared filter bar component on every view." },
      { role: "member", body: "Priority chips are wired — testing search next." },
    ],
  },
  {
    title: "OAuth login spike",
    status: "review",
    priority: "critical",
    group: "Now",
    labels: ["Security", "Docs"],
    assignees: ["admin", "member"],
    dueDays: -2,
    body: "Out of scope for local-only build — document why we skip it.",
  },
  {
    title: "Mobile bottom nav polish",
    status: "ready",
    priority: "minor",
    group: "Now",
    assignees: ["member"],
    dueDays: 5,
  },
  {
    title: "Burndown chart on Summary",
    status: "backlog",
    priority: "trivial",
    group: "Next",
    assignees: [],
    dueDays: 14,
  },
  {
    title: "Drag-and-drop on Flow board",
    status: "doing",
    priority: "major",
    group: "Now",
    labels: ["Feature", "QA"],
    assignees: ["admin"],
    dueDays: 21,
  },
  {
    title: "Timeline dependency lines",
    status: "doing",
    priority: "minor",
    group: "Next",
    assignees: ["viewer"],
    dueDays: 7,
  },
  {
    title: "Seed demo data script",
    status: "done",
    priority: "minor",
    group: "Later",
    assignees: ["owner"],
    dueDays: -5,
    comments: [{ role: "owner", body: "Shipped with prisma seed." }],
  },
  {
    title: "Settings page for invite defaults",
    status: "done",
    priority: "major",
    group: "Later",
    assignees: ["admin"],
    dueDays: -1,
  },
  {
    title: "List view split-pane detail",
    status: "review",
    priority: "critical",
    group: "Now",
    assignees: ["owner", "admin"],
    dueDays: 0,
    body: "Desktop shows inline detail; mobile keeps slide-over.",
  },
  {
    title: "Calendar orbit month navigation",
    status: "ready",
    priority: "minor",
    group: "Later",
    assignees: ["member"],
    dueDays: 10,
  },
  {
    title: "Unread notices badge",
    status: "doing",
    priority: "minor",
    group: "Now",
    assignees: ["admin"],
    dueDays: 3,
  },
  {
    title: "Viewer read-only regression pass",
    status: "backlog",
    priority: "trivial",
    group: "Later",
    assignees: ["viewer"],
  },
];

const MOBILE_TICKETS: TicketSeed[] = [
  {
    title: "Push notification permissions",
    status: "review",
    priority: "major",
    group: "Now",
    assignees: ["member"],
    dueDays: 4,
  },
  {
    title: "Offline sync for board view",
    status: "doing",
    priority: "critical",
    group: "Now",
    assignees: ["admin", "member"],
    dueDays: 8,
  },
  {
    title: "Haptic feedback on drag",
    status: "ready",
    priority: "minor",
    group: "Next",
    assignees: ["viewer"],
    dueDays: 12,
  },
  {
    title: "App Store screenshots",
    status: "backlog",
    priority: "trivial",
    group: "Later",
    assignees: ["owner"],
    dueDays: 20,
  },
];

const PLATFORM_TICKETS: TicketSeed[] = [
  {
    title: "API rate limiting",
    status: "doing",
    priority: "critical",
    group: "Now",
    assignees: ["admin"],
    dueDays: 1,
  },
  {
    title: "Database backup docs",
    status: "ready",
    priority: "minor",
    group: "Next",
    assignees: ["owner"],
    dueDays: 6,
  },
  {
    title: "Health check endpoint",
    status: "done",
    priority: "trivial",
    group: "Later",
    assignees: ["member"],
    dueDays: -4,
  },
];

function dueFromDays(days: number | undefined, base: Date) {
  if (days === undefined) return null;
  const date = new Date(base);
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(12, 0, 0, 0);
  return date;
}

async function ensureProject(
  prisma: PrismaClient,
  teamId: string,
  name: string,
  slug: string,
) {
  let project = await prisma.project.findFirst({
    where: { teamId, slug },
    include: { groups: true },
  });
  if (!project) {
    project = await prisma.project.create({
      data: {
        teamId,
        name,
        slug,
        groups: { create: defaultGroupSeed() },
      },
      include: { groups: true },
    });
  }
  return project;
}

async function ensureTeamLabels(prisma: PrismaClient, teamId: string) {
  const map = new Map<string, string>();
  for (const def of NORTHWIND_LABELS) {
    const row = await prisma.label.upsert({
      where: { teamId_name: { teamId, name: def.name } },
      update: { color: def.color },
      create: { teamId, name: def.name, color: def.color },
    });
    map.set(def.name, row.id);
  }
  return map;
}

async function seedTickets(
  prisma: PrismaClient,
  projectId: string,
  groups: { id: string; name: string }[],
  users: Map<TeamRole, string>,
  tickets: TicketSeed[],
  base: Date,
  labelIds: Map<string, string>,
) {
  const existing = await prisma.item.count({ where: { projectId } });
  if (existing >= tickets.length) return;

  const groupByName = new Map(groups.map((g) => [g.name, g.id]));
  let position = existing;

  for (const ticket of tickets) {
    const groupId = groupByName.get(ticket.group);
    if (!groupId) continue;

    const duplicate = await prisma.item.findFirst({
      where: { projectId, title: ticket.title },
    });
    if (duplicate) continue;

    const assigneeIds = ticket.assignees
      .map((role) => users.get(role))
      .filter((id): id is string => Boolean(id));

    const item = await prisma.item.create({
      data: {
        projectId,
        groupId,
        title: ticket.title,
        body: ticket.body ?? "",
        status: ticket.status,
        priority: ticket.priority,
        dueOn: dueFromDays(ticket.dueDays, base),
        position,
        assignees: assigneeIds.length
          ? { create: assigneeIds.map((userId) => ({ userId })) }
          : undefined,
      },
    });

    for (const note of ticket.comments ?? []) {
      const userId = users.get(note.role);
      if (!userId) continue;
      await prisma.itemUpdate.create({
        data: { itemId: item.id, userId, body: note.body },
      });
    }

    for (const name of ticket.labels ?? []) {
      const labelId = labelIds.get(name);
      if (!labelId) continue;
      await prisma.itemLabel.upsert({
        where: { itemId_labelId: { itemId: item.id, labelId } },
        update: {},
        create: { itemId: item.id, labelId },
      });
    }

    position += 1;
  }
}

export async function seedDemoStudio(
  prisma: PrismaClient,
  users: Map<TeamRole, string>,
) {
  const base = new Date("2026-09-24T12:00:00.000Z");
  const ownerId = users.get("owner");
  if (!ownerId) return;

  let team = await prisma.team.findFirst({
    where: { OR: [{ slug: DEMO_TEAM_SLUG }, { name: "Northwind" }] },
  });

  if (!team) {
    team = await prisma.team.create({
      data: {
        name: "Northwind",
        slug: DEMO_TEAM_SLUG,
        settings: stringifyTeamSettings(DEFAULT_TEAM_SETTINGS),
      },
    });
  } else if (team.slug !== DEMO_TEAM_SLUG) {
    team = await prisma.team.update({
      where: { id: team.id },
      data: { slug: DEMO_TEAM_SLUG },
    });
  }

  for (const [role, userId] of users) {
    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: team.id, userId } },
      update: { role },
      create: { teamId: team.id, userId, role },
    });
  }

  const labelIds = await ensureTeamLabels(prisma, team.id);

  const atlas = await ensureProject(prisma, team.id, "Atlas", "atlas");
  const platform = await ensureProject(prisma, team.id, "Platform", "platform");
  const mobile = await ensureProject(prisma, team.id, "Mobile", "mobile");

  await seedTickets(prisma, atlas.id, atlas.groups, users, ATLAS_TICKETS, base, labelIds);
  await seedTickets(
    prisma,
    platform.id,
    platform.groups,
    users,
    PLATFORM_TICKETS,
    base,
    labelIds,
  );
  await seedTickets(
    prisma,
    mobile.id,
    mobile.groups,
    users,
    MOBILE_TICKETS,
    base,
    labelIds,
  );

  const ownerUserId = users.get("owner");
  if (ownerUserId) {
    await prisma.filterLens.upsert({
      where: {
        teamId_userId_name: {
          teamId: team.id,
          userId: ownerUserId,
          name: "My critical",
        },
      },
      update: {
        spec: JSON.stringify({ kind: "mine", priority: "critical" }),
      },
      create: {
        teamId: team.id,
        userId: ownerUserId,
        name: "My critical",
        spec: JSON.stringify({ kind: "mine", priority: "critical" }),
        position: 0,
      },
    });
  }
}
