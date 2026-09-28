"use server";

import { requireUser } from "@/lib/auth/session";
import { formatIssueKey } from "@/lib/items/issue-key";
import { getMembership } from "@/lib/teams/queries";
import { prisma } from "@/lib/db/prisma";
import {
  rankSearchHits,
  type SearchableTicket,
} from "@/lib/search/search";

export type StudioSearchHit = {
  id: string;
  title: string;
  key: string;
  projectSlug: string;
  projectName: string;
  status: string;
  labelNames: string[];
  href: string;
};

export async function searchStudioAction(
  slug: string,
  query: string,
): Promise<StudioSearchHit[]> {
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return [];
  const trimmed = query.trim();
  if (!trimmed) return [];

  const rows = await prisma.item.findMany({
    where: { project: { teamId: ctx.team.id, archived: false } },
    include: {
      project: { select: { slug: true, name: true } },
      labels: { include: { label: { select: { name: true } } } },
    },
    orderBy: { updatedAt: "desc" },
    take: 250,
  });

  const searchable: SearchableTicket[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    projectSlug: row.project.slug,
    position: row.position,
    labelNames: row.labels.map((link) => link.label.name),
  }));

  const ranked = rankSearchHits(trimmed, searchable).slice(0, 12);
  const byId = new Map(rows.map((row) => [row.id, row]));

  return ranked.map((hit) => {
    const row = byId.get(hit.id)!;
    const projectSlug = row.project.slug;
    return {
      id: row.id,
      title: row.title,
      key: formatIssueKey(projectSlug, row.position),
      projectSlug,
      projectName: row.project.name,
      status: row.status,
      labelNames: hit.labelNames,
      href: `/t/${slug}/p/${projectSlug}?view=list&focus=${row.id}`,
    };
  });
}
