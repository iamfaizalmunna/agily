"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { canEditSettings } from "@/lib/rbac/roles";
import { getMembership } from "@/lib/teams/queries";
import {
  normalizeLabelColor,
  parseLabelName,
} from "@/lib/labels/labels";

export type LabelFormState = { error?: string };

export async function createLabelAction(
  _prev: LabelFormState,
  formData: FormData,
): Promise<LabelFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const parsed = parseLabelName(String(formData.get("name") ?? ""));
  if ("error" in parsed) return { error: parsed.error };
  const color = normalizeLabelColor(String(formData.get("color") ?? ""));
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canEditSettings(ctx.role)) return { error: "Read only" };
  try {
    await prisma.label.create({
      data: { teamId: ctx.team.id, name: parsed.name, color },
    });
  } catch {
    return { error: "That label name already exists" };
  }
  revalidatePath(`/t/${slug}/settings`);
  return {};
}

export async function updateLabelAction(
  _prev: LabelFormState,
  formData: FormData,
): Promise<LabelFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const labelId = String(formData.get("labelId") ?? "");
  const parsed = parseLabelName(String(formData.get("name") ?? ""));
  if ("error" in parsed) return { error: parsed.error };
  const color = normalizeLabelColor(String(formData.get("color") ?? ""));
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canEditSettings(ctx.role)) return { error: "Read only" };
  const updated = await prisma.label.updateMany({
    where: { id: labelId, teamId: ctx.team.id },
    data: { name: parsed.name, color },
  });
  if (!updated.count) return { error: "Label not found" };
  revalidatePath(`/t/${slug}/settings`);
  return {};
}

export async function deleteLabelAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const labelId = String(formData.get("labelId") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");
  if (!canEditSettings(ctx.role)) return;
  await prisma.label.deleteMany({
    where: { id: labelId, teamId: ctx.team.id },
  });
  revalidatePath(`/t/${slug}/settings`);
  redirect(`/t/${slug}/settings`);
}
