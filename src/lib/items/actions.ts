"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { getMembership } from "@/lib/teams/queries";
import { parseTeamSettings } from "@/lib/rbac/roles";
import { parseCommentBody } from "@/lib/focus/focus";
import {
  canArchiveProject,
  canAssign,
  canComment,
  canCreateProject,
  canWriteBoard,
} from "@/lib/items/permissions";
import { createProjectForTeam } from "@/lib/items/create";
import { validateParentLink, wouldCreateCycle } from "@/lib/items/hierarchy";
import { parseIssueType, type IssueType } from "@/lib/items/issue-type";
import { parseItemPriority } from "@/lib/items/priority";
import { isItemStatus } from "@/lib/items/status";
import { parseDueOn, parseItemTitle } from "@/lib/items/validate";
import {
  collectAssigneeIds,
  filterAssignableIds,
  toggleAssignee,
} from "@/lib/items/assign";
import { collectLabelIds } from "@/lib/labels/labels";
import { parseMentionUserIds, type MentionMember } from "@/lib/activity/mentions";
import { writeItemEvents } from "@/lib/activity/write-events";
import { writeNotices } from "@/lib/notices/write";
import { safeStudioNext } from "@/lib/views/views";

function memberNameMap(
  members: { userId: string; user: { id: string; name: string } }[],
) {
  return new Map(members.map((row) => [row.user.id, row.user.name]));
}

function mentionMembers(
  members: { user: { id: string; name: string; email: string } }[],
): MentionMember[] {
  return members.map((row) => ({
    id: row.user.id,
    name: row.user.name,
    email: row.user.email,
  }));
}

async function resolveParentId(
  teamId: string,
  projectId: string,
  itemId: string | null,
  itemType: IssueType,
  rawParentId: string,
) {
  const trimmed = rawParentId.trim();
  if (!trimmed) return { parentId: null as string | null };
  const parent = await prisma.item.findFirst({
    where: { id: trimmed, projectId, project: { teamId } },
    select: {
      id: true,
      parentId: true,
      type: true,
      status: true,
      title: true,
    },
  });
  if (!parent) return { error: "Epic not found" as const };
  const gate = validateParentLink(
    { id: itemId ?? "new", type: itemType },
    parent,
  );
  if ("error" in gate) return { error: gate.error };
  if (itemId) {
    const rows = await prisma.item.findMany({
      where: { projectId },
      select: {
        id: true,
        parentId: true,
        type: true,
        status: true,
        title: true,
      },
    });
    const map = new Map(rows.map((row) => [row.id, row]));
    if (wouldCreateCycle(itemId, trimmed, map)) {
      return { error: "That parent would create a cycle" as const };
    }
  }
  return { parentId: trimmed };
}

async function replaceItemLabels(
  itemId: string,
  teamId: string,
  rawIds: string[],
) {
  const unique = [...new Set(rawIds)];
  const allowed = await prisma.label.findMany({
    where: { teamId, id: { in: unique } },
    select: { id: true },
  });
  await prisma.$transaction([
    prisma.itemLabel.deleteMany({ where: { itemId } }),
    ...allowed.map((row) =>
      prisma.itemLabel.create({ data: { itemId, labelId: row.id } }),
    ),
  ]);
}

function boardNext(slug: string, projectSlug: string, formData: FormData) {
  return safeStudioNext(
    slug,
    `/t/${slug}/p/${projectSlug}`,
    String(formData.get("next") ?? ""),
  );
}

export type BoardFormState = { error?: string; projectSlug?: string };

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
  return { projectSlug: project.slug };
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
  const type = parseIssueType(String(formData.get("type") ?? ""));
  const parentResolved = await resolveParentId(
    ctx.team.id,
    group.projectId,
    null,
    type,
    String(formData.get("parentId") ?? ""),
  );
  if ("error" in parentResolved) return { error: parentResolved.error };
  const item = await prisma.item.create({
    data: {
      projectId: group.projectId,
      groupId: group.id,
      parentId: parentResolved.parentId,
      title: titleParsed.title,
      body: String(formData.get("body") ?? ""),
      type,
      status: "backlog",
      priority: parseItemPriority(String(formData.get("priority") ?? "")),
      dueOn: due.dueOn,
      position: (last._max.position ?? -1) + 1,
      assignees: assignMe ? { create: { userId: user.id } } : undefined,
    },
  });
  await replaceItemLabels(item.id, ctx.team.id, collectLabelIds(formData));
  redirect(boardNext(slug, projectSlug, formData));
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
  const priority = parseItemPriority(String(formData.get("priority") ?? ""));
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
    include: { assignees: true },
  });
  if (!item) return { error: "Ticket not found" };
  const teamIds = ctx.team.members.map((m) => m.userId);
  const nextIds = filterAssignableIds(collectAssigneeIds(formData), teamIds);
  const current = item.assignees.map((row) => row.userId);
  const added = nextIds.filter((id) => !current.includes(id));
  const type = parseIssueType(String(formData.get("type") ?? item.type));
  const parentResolved = await resolveParentId(
    ctx.team.id,
    item.projectId,
    item.id,
    type,
    String(formData.get("parentId") ?? ""),
  );
  if ("error" in parentResolved) return { error: parentResolved.error };
  const names = memberNameMap(ctx.team.members);
  const before = {
    status: item.status,
    priority: item.priority,
    dueOn: item.dueOn,
    assigneeIds: current,
  };
  const after = {
    status,
    priority,
    dueOn: due.dueOn,
    assigneeIds: nextIds,
  };
  await prisma.$transaction([
    prisma.item.update({
      where: { id: item.id },
      data: {
        title: titleParsed.title,
        status,
        priority,
        type,
        parentId: parentResolved.parentId,
        dueOn: due.dueOn,
        body: String(formData.get("body") ?? item.body),
      },
    }),
    prisma.itemAssignee.deleteMany({ where: { itemId: item.id } }),
    ...nextIds.map((userId) =>
      prisma.itemAssignee.create({ data: { itemId: item.id, userId } }),
    ),
  ]);
  await writeItemEvents(item.id, user.id, before, after, names);
  await replaceItemLabels(item.id, ctx.team.id, collectLabelIds(formData));
  await writeNotices({
    teamId: ctx.team.id,
    slug,
    projectSlug,
    itemId: item.id,
    itemTitle: titleParsed.title,
    actorId: user.id,
    actorName: user.name,
    kind: "assigned",
    userIds: added,
  });
  redirect(boardNext(slug, projectSlug, formData));
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
  const names = memberNameMap(ctx.team.members);
  const before = {
    status: item.status,
    priority: item.priority,
    dueOn: item.dueOn,
    assigneeIds: current,
  };
  await prisma.itemAssignee.deleteMany({ where: { itemId: item.id } });
  if (next.length) {
    await prisma.itemAssignee.createMany({
      data: next.map((userId) => ({ itemId: item.id, userId })),
    });
  }
  await writeItemEvents(
    item.id,
    user.id,
    before,
    {
      status: item.status,
      priority: item.priority,
      dueOn: item.dueOn,
      assigneeIds: next,
    },
    names,
  );
  redirect(boardNext(slug, projectSlug, formData));
}

async function nextPositionInStatus(projectId: string, status: string) {
  const last = await prisma.item.aggregate({
    where: { projectId, status },
    _max: { position: true },
  });
  return (last._max.position ?? -1) + 1;
}

export async function moveItemStatusQuickAction(
  slug: string,
  projectSlug: string,
  itemId: string,
  status: string,
): Promise<{ error?: string }> {
  if (!isItemStatus(status)) return { error: "Unknown status" };
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" };
  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      project: { teamId: ctx.team.id, slug: projectSlug },
    },
    select: {
      id: true,
      projectId: true,
      status: true,
      priority: true,
      dueOn: true,
      assignees: { select: { userId: true } },
    },
  });
  if (!item) return { error: "Ticket not found" };
  const position = await nextPositionInStatus(item.projectId, status);
  const names = memberNameMap(ctx.team.members);
  const assigneeIds = item.assignees.map((row) => row.userId);
  await prisma.item.update({
    where: { id: item.id },
    data: { status, position },
  });
  await writeItemEvents(
    item.id,
    user.id,
    {
      status: item.status,
      priority: item.priority,
      dueOn: item.dueOn,
      assigneeIds,
    },
    {
      status,
      priority: item.priority,
      dueOn: item.dueOn,
      assigneeIds,
    },
    names,
  );
  return {};
}

export async function reorderKanbanColumnAction(
  slug: string,
  projectSlug: string,
  status: string,
  orderedIds: string[],
): Promise<{ error?: string }> {
  if (!isItemStatus(status)) return { error: "Unknown status" };
  if (!orderedIds.length) return {};
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" };
  const project = await prisma.project.findFirst({
    where: { teamId: ctx.team.id, slug: projectSlug, archived: false },
    select: { id: true },
  });
  if (!project) return { error: "Board not found" };
  const rows = await prisma.item.findMany({
    where: {
      projectId: project.id,
      status,
      id: { in: orderedIds },
    },
    select: { id: true },
  });
  if (rows.length !== orderedIds.length) {
    return { error: "Tickets must stay in the same column" };
  }
  await prisma.$transaction(
    orderedIds.map((id, position) =>
      prisma.item.update({
        where: { id },
        data: { position },
      }),
    ),
  );
  return {};
}

export async function moveItemStatusAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!isItemStatus(status)) return;
  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");
  if (!canWriteBoard(ctx.role)) return;
  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      project: { teamId: ctx.team.id, slug: projectSlug },
    },
    include: { assignees: true },
  });
  if (!item) return;
  const names = memberNameMap(ctx.team.members);
  const assigneeIds = item.assignees.map((row) => row.userId);
  await prisma.item.update({
    where: { id: item.id },
    data: { status },
  });
  await writeItemEvents(
    item.id,
    user.id,
    {
      status: item.status,
      priority: item.priority,
      dueOn: item.dueOn,
      assigneeIds,
    },
    {
      status,
      priority: item.priority,
      dueOn: item.dueOn,
      assigneeIds,
    },
    names,
  );
  redirect(boardNext(slug, projectSlug, formData));
}

export async function addCommentAction(
  _prev: BoardFormState,
  formData: FormData,
): Promise<BoardFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const note = parseCommentBody(String(formData.get("body") ?? ""));
  if ("error" in note) return { error: note.error };
  const parentId = String(formData.get("parentId") ?? "").trim() || null;
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canComment(ctx.role)) return { error: "Read only" };
  const members = mentionMembers(ctx.team.members);
  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      project: { teamId: ctx.team.id, slug: projectSlug },
    },
    include: { assignees: true },
  });
  if (!item) return { error: "Ticket not found" };
  let parentAuthorId: string | null = null;
  if (parentId) {
    const parent = await prisma.itemUpdate.findFirst({
      where: { id: parentId, itemId: item.id },
      select: { userId: true },
    });
    if (!parent) return { error: "Reply not found" };
    parentAuthorId = parent.userId;
  }
  await prisma.itemUpdate.create({
    data: {
      itemId: item.id,
      userId: user.id,
      body: note.body,
      parentId,
    },
  });
  const mentioned = parseMentionUserIds(note.body, members);
  if (mentioned.length) {
    await writeNotices({
      teamId: ctx.team.id,
      slug,
      projectSlug,
      itemId: item.id,
      itemTitle: item.title,
      actorId: user.id,
      actorName: user.name,
      kind: "mention",
      userIds: mentioned,
      snippet: note.body,
    });
  }
  if (parentAuthorId) {
    await writeNotices({
      teamId: ctx.team.id,
      slug,
      projectSlug,
      itemId: item.id,
      itemTitle: item.title,
      actorId: user.id,
      actorName: user.name,
      kind: "reply",
      userIds: [parentAuthorId],
      snippet: note.body,
    });
  } else {
    await writeNotices({
      teamId: ctx.team.id,
      slug,
      projectSlug,
      itemId: item.id,
      itemTitle: item.title,
      actorId: user.id,
      actorName: user.name,
      kind: "note",
      userIds: item.assignees.map((row) => row.userId),
    });
  }
  redirect(boardNext(slug, projectSlug, formData));
}

export async function updateGanttDueAction(
  slug: string,
  projectSlug: string,
  itemId: string,
  end: Date,
): Promise<{ error?: string }> {
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" };
  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      project: { teamId: ctx.team.id, slug: projectSlug },
    },
    include: { assignees: true },
  });
  if (!item) return { error: "Ticket not found" };
  const names = memberNameMap(ctx.team.members);
  const assigneeIds = item.assignees.map((row) => row.userId);
  const before = {
    status: item.status,
    priority: item.priority,
    dueOn: item.dueOn,
    assigneeIds,
  };
  await prisma.item.update({
    where: { id: item.id },
    data: { dueOn: end },
  });
  await writeItemEvents(
    item.id,
    user.id,
    before,
    {
      status: item.status,
      priority: item.priority,
      dueOn: end,
      assigneeIds,
    },
    names,
  );
  return {};
}
