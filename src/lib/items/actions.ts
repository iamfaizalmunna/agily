"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { getMembership } from "@/lib/teams/queries";
import { parseTeamSettings } from "@/lib/rbac/roles";
import {
  canArchiveProject,
  canAssign,
  canCreateProject,
  canWriteBoard,
} from "@/lib/items/permissions";
import { createProjectForTeam } from "@/lib/items/create";
import { isItemStatus } from "@/lib/items/status";
import { parseDueOn, parseItemTitle } from "@/lib/items/validate";
import {
  collectAssigneeIds,
  filterAssignableIds,
  toggleAssignee,
} from "@/lib/items/assign";

export type BoardFormState = { error?: string };

const projectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().trim().min(1, "Board needs a name").max(80),
});

export async function createProjectAction(
  _prev: BoardFormState,
  formData: FormData,
): Promise<BoardFormState> {
  const user = await requireUser();
  const parsed = projectSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }
  const ctx = await getMembership(user.id, parsed.data.slug);
  if (!ctx) return { error: "Studio not found" };
  const settings = parseTeamSettings(ctx.team.settings);
  if (!canCreateProject(ctx.role, settings)) {
    return { error: "You cannot create boards here" };
  }
  const project = await createProjectForTeam(ctx.team.id, parsed.data.name);
  redirect(`/t/${ctx.team.slug}/p/${project.slug}`);
}

export async function archiveProjectAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");
  if (!canArchiveProject(ctx.role)) return;
  await prisma.project.updateMany({
    where: { teamId: ctx.team.id, slug: projectSlug },
    data: { archived: true },
  });
  redirect(`/t/${slug}`);
}

export async function createGroupAction(
  _prev: BoardFormState,
  formData: FormData,
): Promise<BoardFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Section needs a name" };
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" };
  const project = await prisma.project.findFirst({
    where: { teamId: ctx.team.id, slug: projectSlug, archived: false },
  });
  if (!project) return { error: "Board not found" };
  const last = await prisma.group.aggregate({
    where: { projectId: project.id },
    _max: { position: true },
  });
  await prisma.group.create({
    data: {
      projectId: project.id,
      name,
      position: (last._max.position ?? -1) + 1,
    },
  });
  redirect(`/t/${slug}/p/${projectSlug}`);
}

export async function createItemAction(
  _prev: BoardFormState,
  formData: FormData,
): Promise<BoardFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const groupId = String(formData.get("groupId") ?? "");
  const titleParsed = parseItemTitle(String(formData.get("title") ?? ""));
  if ("error" in titleParsed) return { error: titleParsed.error };
  const due = parseDueOn(String(formData.get("dueOn") ?? ""));
  if ("error" in due) return { error: due.error };
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" };
  const group = await prisma.group.findFirst({
    where: { id: groupId, project: { teamId: ctx.team.id, slug: projectSlug } },
  });
  if (!group) return { error: "Section not found" };
  const last = await prisma.item.aggregate({
    where: { groupId: group.id },
    _max: { position: true },
  });
  const assignMe = formData.get("assignMe") === "on";
  await prisma.item.create({
    data: {
      projectId: group.projectId,
      groupId: group.id,
      title: titleParsed.title,
      body: String(formData.get("body") ?? ""),
      status: "backlog",
      dueOn: due.dueOn,
      position: (last._max.position ?? -1) + 1,
      assignees: assignMe ? { create: { userId: user.id } } : undefined,
    },
  });
  redirect(`/t/${slug}/p/${projectSlug}`);
}

export async function updateItemAction(
  _prev: BoardFormState,
  formData: FormData,
): Promise<BoardFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const titleParsed = parseItemTitle(String(formData.get("title") ?? ""));
  if ("error" in titleParsed) return { error: titleParsed.error };
  const status = String(formData.get("status") ?? "");
  if (!isItemStatus(status)) return { error: "Unknown status" };
  const due = parseDueOn(String(formData.get("dueOn") ?? ""));
  if ("error" in due) return { error: due.error };
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" };
  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      project: { teamId: ctx.team.id, slug: projectSlug },
    },
  });
  if (!item) return { error: "Ticket not found" };
  const teamIds = ctx.team.members.map((m) => m.userId);
  const nextIds = filterAssignableIds(collectAssigneeIds(formData), teamIds);
  await prisma.$transaction([
    prisma.item.update({
      where: { id: item.id },
      data: {
        title: titleParsed.title,
        status,
        dueOn: due.dueOn,
        body: String(formData.get("body") ?? item.body),
      },
    }),
    prisma.itemAssignee.deleteMany({ where: { itemId: item.id } }),
    ...nextIds.map((userId) =>
      prisma.itemAssignee.create({ data: { itemId: item.id, userId } }),
    ),
  ]);
  redirect(`/t/${slug}/p/${projectSlug}`);
}

export async function assignToMeAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");
  if (!canAssign(ctx.role)) return;
  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      project: { teamId: ctx.team.id, slug: projectSlug },
    },
    include: { assignees: true },
  });
  if (!item) return;
  const current = item.assignees.map((row) => row.userId);
  const next = toggleAssignee(current, user.id);
  await prisma.itemAssignee.deleteMany({ where: { itemId: item.id } });
  if (next.length) {
    await prisma.itemAssignee.createMany({
      data: next.map((userId) => ({ itemId: item.id, userId })),
    });
  }
  redirect(`/t/${slug}/p/${projectSlug}`);
}
