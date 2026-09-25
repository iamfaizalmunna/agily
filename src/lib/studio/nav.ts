"use server";

import { requireUser } from "@/lib/auth/session";
import { listProjects } from "@/lib/items/queries";
import { getMembership } from "@/lib/teams/queries";

export async function listProjectsForStudio(slug: string) {
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return [];
  const rows = await listProjects(ctx.team.id);
  return rows.map((project) => ({
    name: project.name,
    slug: project.slug,
    count: project._count.items,
  }));
}
