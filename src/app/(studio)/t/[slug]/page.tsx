import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateProjectForm } from "@/components/items/create-project-form";
import { requireUser } from "@/lib/auth/session";
import { canCreateProject } from "@/lib/items/permissions";
import { listProjects } from "@/lib/items/queries";
import { parseTeamSettings } from "@/lib/rbac/roles";
import { getMembership } from "@/lib/teams/queries";

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
          You are {ctx.role}. Boards share one ticket model. Four views come in
          phase 5 — this is the same rows, sparse.
        </p>
      </div>

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
        <p className="text-sm text-paper/45">No boards yet.</p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href={`/t/${slug}/people`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-paper/15 px-5 text-sm text-paper"
        >
          People
        </Link>
      </div>

      {mayCreate ? (
        <div>
          <h2 className="mb-4 font-display text-xl text-paper">Open a board</h2>
          <CreateProjectForm slug={slug} />
        </div>
      ) : null}
    </section>
  );
}
