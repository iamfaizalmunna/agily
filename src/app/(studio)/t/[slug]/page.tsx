import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/chrome/empty-state";
import { CreateProjectForm } from "@/components/items/create-project-form";
import { TicketChip } from "@/components/views/ticket-chip";
import { requireUser } from "@/lib/auth/session";
import { canCreateProject } from "@/lib/items/permissions";
import { listProjects, listTeamItems } from "@/lib/items/queries";
import { parseTeamSettings } from "@/lib/rbac/roles";
import { getMembership } from "@/lib/teams/queries";
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
    new Date(),
  );

  const chip = (id: string) => {
    const item = rows.find((row) => row.id === id);
    if (!item) return null;
    return (
      <TicketChip
        href={`/t/${slug}/p/${item.project.slug}?focus=${item.id}`}
        title={item.title}
        status={item.status}
        dueOn={item.dueOn}
        people={item.assignees.map((row) => row.user)}
      />
    );
  };

  return (
    <section className="flex flex-col gap-8">
      <div>
        <p className="font-display text-xs tracking-[0.22em] text-copper uppercase">
          Pulse
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-paper sm:text-5xl">
          {ctx.team.name}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/50 sm:text-base">
          Morning stream from the same tickets. Ledger, Flow, and Orbit live on
          each board.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl text-paper">Mine</h2>
        {buckets.mine.length ? (
          buckets.mine.map((item) => (
            <div key={item.id}>{chip(item.id)}</div>
          ))
        ) : (
          <p className="text-sm text-paper/40">Nothing assigned to you.</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl text-paper">Overdue</h2>
        {buckets.overdue.length ? (
          buckets.overdue.map((item) => (
            <div key={item.id}>{chip(item.id)}</div>
          ))
        ) : (
          <p className="text-sm text-paper/40">Nothing late.</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl text-paper">Recently assigned</h2>
        {buckets.recent.length ? (
          buckets.recent.map((item) => (
            <div key={item.id}>{chip(item.id)}</div>
          ))
        ) : (
          <p className="text-sm text-paper/40">No recent assigns.</p>
        )}
      </section>

      {projects.length ? (
        <ul className="flex flex-col gap-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/t/${slug}/p/${project.slug}`}
                className="flex min-h-14 items-center justify-between rounded-2xl border border-paper/10 px-4"
              >
                <span>{project.name}</span>
                <span className="text-xs text-paper/40">
                  {project._count.items} tickets
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No boards yet"
          body="Open a board to add Now / Next / Later sections and tickets."
        />
      )}

      <Link
        href={`/t/${slug}/people`}
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-paper/15 px-5 text-sm text-paper"
      >
        People
      </Link>

      {mayCreate ? (
        <div>
          <h2 className="mb-4 font-display text-xl text-paper">Open a board</h2>
          <CreateProjectForm slug={slug} />
        </div>
      ) : null}
    </section>
  );
}
