"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { canWriteBoard } from "@/lib/items/permissions";
import { getMembership } from "@/lib/teams/queries";
import { parseSubtaskTitle } from "@/lib/subtasks/subtasks";

export type SubtaskFormState = { error?: string };

async function assertItemWrite(
  userId: string,
  slug: string,
  projectSlug: string,
  itemId: string,
) {
  const ctx = await getMembership(userId, slug);
  if (!ctx) return { error: "Studio not found" as const };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" as const };
  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      project: { teamId: ctx.team.id, slug: projectSlug },
    },
    select: { id: true },
  });
  if (!item) return { error: "Ticket not found" as const };
  return { item };
}

export async function createSubtaskAction(
  _prev: SubtaskFormState,
  formData: FormData,
): Promise<SubtaskFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const parsed = parseSubtaskTitle(String(formData.get("title") ?? ""));
  if ("error" in parsed) return { error: parsed.error };
  const gate = await assertItemWrite(user.id, slug, projectSlug, itemId);
  if ("error" in gate) return { error: gate.error };
  const last = await prisma.subtask.aggregate({
    where: { itemId },
    _max: { position: true },
  });
  await prisma.subtask.create({
    data: {
      itemId,
      title: parsed.title,
      position: (last._max.position ?? -1) + 1,
    },
  });
  revalidatePath(`/t/${slug}/p/${projectSlug}`);
  return {};
}

export async function toggleSubtaskAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const subtaskId = String(formData.get("subtaskId") ?? "");
  const gate = await assertItemWrite(user.id, slug, projectSlug, itemId);
  if ("error" in gate) return;
  const row = await prisma.subtask.findFirst({
    where: { id: subtaskId, itemId },
  });
  if (!row) return;
  await prisma.subtask.update({
    where: { id: row.id },
    data: { done: !row.done },
  });
  revalidatePath(`/t/${slug}/p/${projectSlug}`);
}

export async function deleteSubtaskAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const subtaskId = String(formData.get("subtaskId") ?? "");
  const gate = await assertItemWrite(user.id, slug, projectSlug, itemId);
  if ("error" in gate) return;
  await prisma.subtask.deleteMany({
    where: { id: subtaskId, itemId },
  });
  revalidatePath(`/t/${slug}/p/${projectSlug}`);
}
