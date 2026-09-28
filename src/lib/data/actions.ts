"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { getMembership } from "@/lib/teams/queries";
import { canWriteBoard, canCreateProject } from "@/lib/items/permissions";
import { parseTeamSettings } from "@/lib/rbac/roles";
import { uniqueSlug } from "@/lib/teams/tokens";
import { mapCsvToImports, parseCsv } from "@/lib/data/csv";
import { validateImportRow } from "@/lib/data/import-validate";
import { suggestDuplicateProjectName } from "@/lib/data/duplicate";
import { resolveWorkflow } from "@/lib/workflow/workflow";
import { defaultGroupSeed } from "@/lib/items/defaults";

export type DataFormState = { error?: string; ok?: boolean; imported?: number };

export async function importBoardCsvAction(
  _prev: DataFormState,
  formData: FormData,
): Promise<DataFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const csvText = String(formData.get("csv") ?? "");
  if (!csvText.trim()) return { error: "Paste CSV content" };
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" };
  const project = await prisma.project.findFirst({
    where: { teamId: ctx.team.id, slug: projectSlug, archived: false },
    include: { groups: { orderBy: { position: "asc" } } },
  });
  if (!project) return { error: "Board not found" };
  const workflow = resolveWorkflow(project.workflow);
  const table = parseCsv(csvText);
  const { rows, errors: parseErrors } = mapCsvToImports(table);
  if (parseErrors.length && !rows.length) {
    return { error: parseErrors[0] };
  }
  const emailToUserId = new Map(
    ctx.team.members.map((member) => [
      member.user.email.toLowerCase(),
      member.userId,
    ]),
  );
  const defaultGroup =
    project.groups[0] ??
    (
      await prisma.group.create({
        data: {
          projectId: project.id,
          name: defaultGroupSeed()[0].name,
          position: 0,
        },
      })
    );
  const groupByName = new Map(
    project.groups.map((group) => [group.name.toLowerCase(), group.id]),
  );
  const validated: ReturnType<typeof validateImportRow>[] = [];
  for (const row of rows) {
    const result = validateImportRow(row, workflow);
    if ("error" in result) {
      return { error: `Line ${result.line}: ${result.error}` };
    }
    validated.push(result);
  }
  let imported = 0;
  for (const row of validated) {
    if (!("title" in row)) continue;
    const groupId =
      row.group && groupByName.get(row.group.toLowerCase())
        ? groupByName.get(row.group.toLowerCase())!
        : defaultGroup.id;
    const last = await prisma.item.aggregate({
      where: { groupId },
      _max: { position: true },
    });
    const assigneeId = row.assigneeEmail
      ? emailToUserId.get(row.assigneeEmail)
      : undefined;
    await prisma.item.create({
      data: {
        projectId: project.id,
        groupId,
        title: row.title,
        status: row.status,
        priority: row.priority,
        type: row.type,
        dueOn: row.dueOn,
        position: (last._max.position ?? -1) + 1,
        assignees: assigneeId
          ? { create: { userId: assigneeId } }
          : undefined,
      },
    });
    imported += 1;
  }
  revalidatePath(`/t/${slug}/p/${projectSlug}`);
  return { ok: true, imported };
}

export async function duplicateProjectAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");
  const settings = parseTeamSettings(ctx.team.settings);
  if (!canCreateProject(ctx.role, settings)) return;
  const source = await prisma.project.findFirst({
    where: { teamId: ctx.team.id, slug: projectSlug, archived: false },
    include: {
      groups: {
        orderBy: { position: "asc" },
        include: {
          items: {
            orderBy: { position: "asc" },
            include: {
              assignees: true,
              labels: true,
              subtasks: { orderBy: { position: "asc" } },
            },
          },
        },
      },
    },
  });
  if (!source) return;
  const name = suggestDuplicateProjectName(source.name);
  const newSlug = uniqueSlug(name);
  const created = await prisma.project.create({
    data: {
      teamId: ctx.team.id,
      name,
      slug: newSlug,
      workflow: source.workflow,
      fieldSchema: source.fieldSchema,
      groups: {
        create: source.groups.map((group) => ({
          name: group.name,
          position: group.position,
        })),
      },
    },
    include: { groups: { orderBy: { position: "asc" } } },
  });
  const groupMap = new Map<string, string>();
  source.groups.forEach((group, index) => {
    const target = created.groups[index];
    if (target) groupMap.set(group.id, target.id);
  });
  const itemMap = new Map<string, string>();
  for (const group of source.groups) {
    const targetGroupId = groupMap.get(group.id);
    if (!targetGroupId) continue;
    for (const item of group.items) {
      const copy = await prisma.item.create({
        data: {
          projectId: created.id,
          groupId: targetGroupId,
          title: item.title,
          body: item.body,
          type: item.type,
          status: item.status,
          priority: item.priority,
          dueOn: item.dueOn,
          position: item.position,
          customFields: item.customFields,
          assignees: {
            create: item.assignees.map((row) => ({ userId: row.userId })),
          },
          labels: {
            create: item.labels.map((row) => ({ labelId: row.labelId })),
          },
          subtasks: {
            create: item.subtasks.map((row) => ({
              title: row.title,
              done: row.done,
              position: row.position,
            })),
          },
        },
      });
      itemMap.set(item.id, copy.id);
    }
  }
  for (const group of source.groups) {
    for (const item of group.items) {
      if (!item.parentId) continue;
      const newId = itemMap.get(item.id);
      const newParentId = itemMap.get(item.parentId);
      if (newId && newParentId) {
        await prisma.item.update({
          where: { id: newId },
          data: { parentId: newParentId },
        });
      }
    }
  }
  redirect(`/t/${slug}/p/${newSlug}`);
}
