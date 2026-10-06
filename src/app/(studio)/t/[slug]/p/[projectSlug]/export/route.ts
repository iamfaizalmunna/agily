import { NextRequest, NextResponse } from "next/server";
import { blockedItemIds } from "@/lib/dependencies/dependencies";
import { buildExportRows, exportRowsToCsv } from "@/lib/data/csv";
import { requireUser } from "@/lib/auth/session";
import { getMembership } from "@/lib/teams/queries";
import {
  getProjectBoard,
  listProjectDependencies,
} from "@/lib/items/queries";
import { labelIdsFromRows } from "@/lib/labels/labels";
import {
  itemMatchesLens,
  parseLensQuery,
  parseLensSpec,
  type LensSpec,
} from "@/lib/lenses/lenses";
import { getLens } from "@/lib/lenses/queries";
import { flattenBoardItems } from "@/lib/views/views";
import {
  contentDispositionAttachment,
  safeDownloadFilename,
} from "@/lib/security/filename";
import { writeSecurityEvent } from "@/lib/security/audit-log";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; projectSlug: string }> },
) {
  const { slug, projectSlug } = await context.params;
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const project = await getProjectBoard(ctx.team.id, projectSlug);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const query = request.nextUrl.searchParams;
  const lensId = query.get("lens");
  const pinned = lensId
    ? await getLens(ctx.team.id, user.id, lensId)
    : null;
  const spec: LensSpec = pinned
    ? parseLensSpec(pinned.spec)
    : parseLensQuery({
        q: query.get("q") ?? undefined,
        status: query.get("status") ?? undefined,
        who: query.get("who") ?? undefined,
        priority: query.get("priority") ?? undefined,
        find: query.get("find") ?? undefined,
        labels: query.get("labels") ?? undefined,
        epic: query.get("epic") ?? undefined,
      });
  const dependencyRows = await listProjectDependencies(project.id);
  const allBoardItems = flattenBoardItems(project.groups);
  const blockedIds = blockedItemIds(
    allBoardItems.map((item) => ({ id: item.id, status: item.status })),
    dependencyRows,
  );
  const now = new Date();
  const matchCtx = { userId: user.id, now, blockedIds };
  const groupNameByItem = new Map<string, string>();
  for (const group of project.groups) {
    for (const item of group.items) {
      groupNameByItem.set(item.id, group.name);
    }
  }
  const filtered = allBoardItems.filter((item) =>
    itemMatchesLens(
      {
        id: item.id,
        title: item.title,
        status: item.status,
        priority: item.priority,
        dueOn: item.dueOn,
        assigneeIds: item.assignees.map((row) => row.userId),
        labelIds: labelIdsFromRows(item.labels),
        subtasks: item.subtasks,
        parentId: item.parentId,
      },
      spec,
      matchCtx,
    ),
  );
  const rows = buildExportRows(
    filtered.map((item) => ({
      title: item.title,
      status: item.status,
      priority: item.priority,
      dueOn: item.dueOn,
      assigneeEmails: item.assignees.map((row) => row.user.email),
      type: item.type,
      groupName: groupNameByItem.get(item.id) ?? "",
    })),
  );
  const csv = exportRowsToCsv(rows);
  await writeSecurityEvent({
    kind: "csv_export",
    actorUserId: user.id,
    teamId: ctx.team.id,
    meta: { projectSlug, rowCount: rows.length },
  });
  const filename = safeDownloadFilename(projectSlug);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": contentDispositionAttachment(filename),
    },
  });
}
