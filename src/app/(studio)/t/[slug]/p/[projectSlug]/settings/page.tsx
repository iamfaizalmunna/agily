import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectBoardSettings } from "@/components/projects/project-board-settings";
import { ProjectDataTools } from "@/components/projects/project-data-tools";
import { requireUser } from "@/lib/auth/session";
import { parseFieldSchema } from "@/lib/custom-fields/fields";
import { canWriteBoard } from "@/lib/items/permissions";
import { getMembership } from "@/lib/teams/queries";
import { prisma } from "@/lib/db/prisma";
import { resolveWorkflow } from "@/lib/workflow/workflow";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string }>;
}) {
  const { slug, projectSlug } = await params;
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) notFound();

  const project = await prisma.project.findFirst({
    where: { teamId: ctx.team.id, slug: projectSlug, archived: false },
    select: { id: true, name: true, workflow: true, fieldSchema: true },
  });
  if (!project) notFound();

  const writable = canWriteBoard(ctx.role);
  const workflow = resolveWorkflow(project.workflow);
  const fieldSchema = parseFieldSchema(project.fieldSchema);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href={`/t/${slug}/p/${projectSlug}?view=flow`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to board
      </Link>
      {writable ? (
        <>
          <ProjectBoardSettings
            slug={slug}
            projectSlug={projectSlug}
            projectName={project.name}
            workflow={workflow}
            fieldSchema={fieldSchema}
          />
          <ProjectDataTools
            slug={slug}
            projectSlug={projectSlug}
            exportHref={`/t/${slug}/p/${projectSlug}/export`}
          />
        </>
      ) : (
        <section className="mx-auto max-w-2xl rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Read only</p>
          <p className="mt-2">
            Workflow columns: {workflow.statuses.map((row) => row.label).join(" → ")}
          </p>
        </section>
      )}
    </div>
  );
}
