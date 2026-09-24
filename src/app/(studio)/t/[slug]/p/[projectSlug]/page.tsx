import { notFound } from "next/navigation";
import { CreateGroupForm } from "@/components/items/create-group-form";
import { CreateItemForm } from "@/components/items/create-item-form";
import { ItemRow } from "@/components/items/item-row";
import { Button } from "@/components/ui/button";
import { FlowRiver } from "@/components/views/flow-river";
import { OrbitMonth } from "@/components/views/orbit-month";
import { ViewSwitcher } from "@/components/views/view-switcher";
import { requireUser } from "@/lib/auth/session";
import { archiveProjectAction } from "@/lib/items/actions";
import { canArchiveProject, canWriteBoard } from "@/lib/items/permissions";
import { getProjectBoard } from "@/lib/items/queries";
import { getMembership } from "@/lib/teams/queries";
import {
  flattenBoardItems,
  formatYearMonth,
  parseBoardView,
  parseYearMonth,
} from "@/lib/views/views";

export default async function ProjectBoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; projectSlug: string }>;
  searchParams: Promise<{ view?: string; ym?: string }>;
}) {
  const { slug, projectSlug } = await params;
  const query = await searchParams;
  const view = parseBoardView(query.view);
  const { year, month } = parseYearMonth(query.ym);
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) notFound();

  const project = await getProjectBoard(ctx.team.id, projectSlug);
  if (!project) notFound();

  const writable = canWriteBoard(ctx.role) && !project.archived;
  const mayArchive = canArchiveProject(ctx.role) && !project.archived;
  const people = ctx.team.members.map((member) => ({
    id: member.user.id,
    name: member.user.name,
  }));
  const items = flattenBoardItems(project.groups).map((item) => ({
    ...item,
    href: `/t/${slug}/p/${projectSlug}#item-${item.id}`,
    people: item.assignees.map((row) => row.user),
  }));

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs tracking-[0.22em] text-copper uppercase">
            {view}
          </p>
          <h1 className="mt-3 font-display text-3xl text-paper sm:text-4xl">
            {project.name}
          </h1>
          {project.archived ? (
            <p className="mt-2 text-sm text-paper/45">This board is archived.</p>
          ) : null}
        </div>
        {mayArchive ? (
          <form action={archiveProjectAction}>
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="projectSlug" value={projectSlug} />
            <Button type="submit" variant="quiet">
              Archive
            </Button>
          </form>
        ) : null}
      </div>

      <ViewSwitcher
        slug={slug}
        projectSlug={projectSlug}
        view={view}
        yearMonth={formatYearMonth(year, month)}
      />

      {view === "flow" ? <FlowRiver items={items} /> : null}
      {view === "orbit" ? (
        <OrbitMonth
          slug={slug}
          projectSlug={projectSlug}
          year={year}
          month={month}
          items={items}
        />
      ) : null}

      {view === "ledger" ? (
        <>
          {project.groups.map((group) => (
            <section
              key={group.id}
              id={`group-${group.id}`}
              className="flex flex-col gap-3"
            >
              <h2 className="font-display text-xl text-paper">{group.name}</h2>
              {group.items.length ? (
                <ul className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <ItemRow
                      key={item.id}
                      slug={slug}
                      projectSlug={projectSlug}
                      currentUserId={user.id}
                      people={people}
                      item={item}
                      readOnly={!writable}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-paper/40">Empty section.</p>
              )}
              {writable ? (
                <CreateItemForm
                  slug={slug}
                  projectSlug={projectSlug}
                  groupId={group.id}
                />
              ) : null}
            </section>
          ))}
          {writable ? (
            <CreateGroupForm slug={slug} projectSlug={projectSlug} />
          ) : null}
        </>
      ) : null}
    </section>
  );
}
