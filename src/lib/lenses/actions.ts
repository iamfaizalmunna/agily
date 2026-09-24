"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import {
  parseLensName,
  parseLensSpec,
  stringifyLensSpec,
} from "@/lib/lenses/lenses";
import { prisma } from "@/lib/db/prisma";
import { getMembership } from "@/lib/teams/queries";
import { safeStudioNext } from "@/lib/views/views";

export type LensFormState = { error?: string };

function lensNext(slug: string, formData: FormData) {
  return safeStudioNext(slug, `/t/${slug}`, String(formData.get("next") ?? ""));
}

export async function saveLensAction(
  _prev: LensFormState,
  formData: FormData,
): Promise<LensFormState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const named = parseLensName(String(formData.get("name") ?? ""));
  if ("error" in named) return { error: named.error };
  const spec = stringifyLensSpec(parseLensSpec(String(formData.get("spec") ?? "")));
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  const last = await prisma.filterLens.aggregate({
    where: { teamId: ctx.team.id, userId: user.id },
    _max: { position: true },
  });
  try {
    await prisma.filterLens.create({
      data: {
        teamId: ctx.team.id,
        userId: user.id,
        name: named.name,
        spec,
        position: (last._max.position ?? -1) + 1,
      },
    });
  } catch {
    return { error: "You already kept that name" };
  }
  redirect(lensNext(slug, formData));
}

export async function deleteLensAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const lensId = String(formData.get("lensId") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");
  await prisma.filterLens.deleteMany({
    where: { id: lensId, teamId: ctx.team.id, userId: user.id },
  });
  redirect(lensNext(slug, formData));
}
