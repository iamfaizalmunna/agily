import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/chrome/empty-state";
import { CreateProjectForm } from "@/components/items/create-project-form";
import { TicketChip } from "@/components/views/ticket-chip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { canCreateProject } from "@/lib/items/permissions";
import { listProjects, listTeamItems } from "@/lib/items/queries";
import { parseTeamSettings } from "@/lib/rbac/roles";
import { getMembership } from "@/lib/teams/queries";
import {
  studioOverdueByBoard,
  studioOverdueTotal,
} from "@/lib/views/analytics";
import { pulseBuckets } from "@/lib/views/views";

export default async function TeamHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) notFound();

  const settings = parseTeamSettings(ctx.team.settings);
  const mayCreate = canCreateProject(ctx.role, settings);
  const projects = await listProjects(ctx.team.id);
  const rows = await listTeamItems(ctx.team.id);
  const now = new Date();
  const buckets = pulseBuckets(
    rows.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      dueOn: item.dueOn,
      updatedAt: item.updatedAt,
      assigneeIds: item.assignees.map((row) => row.userId),
    })),
    user.id,
    now,
  );
  const overdueBoards = studioOverdueByBoard(
    rows.map((item) => ({
      projectSlug: item.project.slug,
      projectName: item.project.name,
      status: item.status,
      dueOn: item.dueOn,
    })),
    now,
  );
  const studioOverdue = studioOverdueTotal(overdueBoards);

  const chip = (id: string) => {
    const item = rows.find((row) => row.id === id);
    if (!item) return null;
    return (
      <TicketChip
        href={`/t/${slug}/p/${item.project.slug}?view=list&focus=${item.id}`}
        title={item.title}
        status={item.status}
        priority={item.priority}
        dueOn={item.dueOn}
        people={item.assignees.map((row) => row.user)}
        position={item.position}
        projectSlug={item.project.slug}
      />
    );
  };

  return (
    <section className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Pulse
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{ctx.team.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your morning stream across every board in this studio.
        </p>
      </div>

      {studioOverdue > 0 ? (
        <Card className="border-destructive/40 bg-destructive/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-destructive">
                Studio overdue
              </p>
              <p className="text-xs text-muted-foreground">
                Across all boards in this studio
              </p>
            </div>
            <Badge variant="destructive">{studioOverdue}</Badge>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {overdueBoards.map((board) => (
              <li key={board.projectSlug}>
                <Link href={`/t/${slug}/p/${board.projectSlug}`}>
                  <Badge variant="outline" className="hover:bg-muted">
                    {board.projectName} · {board.overdue}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <PulseCard title="Mine" count={buckets.mine.length}>
          {buckets.mine.length
            ? buckets.mine.map((item) => <div key={item.id}>{chip(item.id)}</div>)
            : <p className="text-sm text-muted-foreground">Nothing assigned to you.</p>}
        </PulseCard>
        <PulseCard title="Overdue" count={buckets.overdue.length} tone="destructive">
          {buckets.overdue.length
            ? buckets.overdue.map((item) => <div key={item.id}>{chip(item.id)}</div>)
            : <p className="text-sm text-muted-foreground">Nothing late.</p>}
        </PulseCard>
        <PulseCard title="Recently assigned" count={buckets.recent.length}>
          {buckets.recent.length
            ? buckets.recent.map((item) => <div key={item.id}>{chip(item.id)}</div>)
            : <p className="text-sm text-muted-foreground">No recent assigns.</p>}
        </PulseCard>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Boards</h2>
          <Badge variant="secondary">{projects.length}</Badge>
        </div>
        {projects.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/t/${slug}/p/${project.slug}`}>
                  <Card className="flex items-center justify-between p-4 transition-colors hover:border-primary/40 hover:bg-muted/30">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {project._count.items} tickets
                    </span>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No boards yet"
            body="Open a board to add sections and tickets."
          />
        )}
      </section>

      {mayCreate ? (
        <Card id="create-board" className="scroll-mt-6 p-6">
          <h2 className="text-lg font-semibold">Open a board</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Each board gets Summary, List, Board, Calendar, and Timeline views.
          </p>
          <div className="mt-4">
            <CreateProjectForm slug={slug} />
          </div>
        </Card>
      ) : null}
    </section>
  );
}

function PulseCard({
  title,
  count,
  tone,
  children,
}: {
  title: string;
  count: number;
  tone?: "destructive";
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Badge variant={tone === "destructive" && count ? "destructive" : "outline"}>
          {count}
        </Badge>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </Card>
  );
}
