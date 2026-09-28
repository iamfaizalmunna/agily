"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { getMembership } from "@/lib/teams/queries";
import { canWriteBoard } from "@/lib/items/permissions";
import {
  CUSTOM_FIELD_TYPES,
  mergeCustomFieldDefs,
  parseFieldSchema,
  serializeFieldSchema,
  type CustomFieldType,
} from "@/lib/custom-fields/fields";
import {
  normalizeWorkflow,
  parseProjectWorkflow,
  serializeWorkflow,
} from "@/lib/workflow/workflow";

export type ProjectSettingsFormState = { error?: string; ok?: boolean };

export async function saveProjectWorkflowAction(
  _prev: ProjectSettingsFormState,
  formData: FormData,
): Promise<ProjectSettingsFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const workflowRaw = String(formData.get("workflow") ?? "");
  const parsed = parseProjectWorkflow(workflowRaw);
  if (!parsed) return { error: "Invalid workflow JSON" };
  const normalized = normalizeWorkflow(parsed);
  if ("error" in normalized) return { error: normalized.error };
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" };
  const project = await prisma.project.findFirst({
    where: { teamId: ctx.team.id, slug: projectSlug, archived: false },
    select: { id: true },
  });
  if (!project) return { error: "Board not found" };
  await prisma.project.update({
    where: { id: project.id },
    data: { workflow: serializeWorkflow(normalized) },
  });
  revalidatePath(`/t/${slug}/p/${projectSlug}`);
  revalidatePath(`/t/${slug}/p/${projectSlug}/settings`);
  return { ok: true };
}

export async function addCustomFieldAction(
  _prev: ProjectSettingsFormState,
  formData: FormData,
): Promise<ProjectSettingsFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const label = String(formData.get("label") ?? "");
  const type = String(formData.get("type") ?? "") as CustomFieldType;
  if (!(CUSTOM_FIELD_TYPES as readonly string[]).includes(type)) {
    return { error: "Unknown field type" };
  }
  const optionsRaw = String(formData.get("options") ?? "");
  const options = optionsRaw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" };
  const project = await prisma.project.findFirst({
    where: { teamId: ctx.team.id, slug: projectSlug, archived: false },
    select: { id: true, fieldSchema: true },
  });
  if (!project) return { error: "Board not found" };
  const current = parseFieldSchema(project.fieldSchema);
  const merged = mergeCustomFieldDefs(current, { label, type, options });
  if ("error" in merged) return { error: merged.error };
  await prisma.project.update({
    where: { id: project.id },
    data: { fieldSchema: serializeFieldSchema(merged) },
  });
  revalidatePath(`/t/${slug}/p/${projectSlug}/settings`);
  return { ok: true };
}

export async function removeCustomFieldAction(
  _prev: ProjectSettingsFormState,
  formData: FormData,
): Promise<ProjectSettingsFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const fieldId = String(formData.get("fieldId") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canWriteBoard(ctx.role)) return { error: "Read only" };
  const project = await prisma.project.findFirst({
    where: { teamId: ctx.team.id, slug: projectSlug, archived: false },
    select: { id: true, fieldSchema: true },
  });
  if (!project) return { error: "Board not found" };
  const current = parseFieldSchema(project.fieldSchema);
  const next = current.filter((row) => row.id !== fieldId);
  if (next.length === current.length) return { error: "Field not found" };
  await prisma.project.update({
    where: { id: project.id },
    data: { fieldSchema: serializeFieldSchema(next) },
  });
  revalidatePath(`/t/${slug}/p/${projectSlug}/settings`);
  return { ok: true };
}
