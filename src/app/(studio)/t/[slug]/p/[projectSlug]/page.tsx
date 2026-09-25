import { notFound } from "next/navigation";
import { CommentThread } from "@/components/focus/comment-thread";
import { FocusStage } from "@/components/focus/focus-stage";
import { CreateGroupForm } from "@/components/items/create-group-form";
import { CreateItemForm } from "@/components/items/create-item-form";
import { ItemRow } from "@/components/items/item-row";
import { FilterBar } from "@/components/lenses/filter-bar";
import { Button } from "@/components/ui/button";
import { BoardSettingsBar } from "@/components/views/board-settings-bar";
import { FlowRiver } from "@/components/views/flow-river";
import { parseBoardDisplayPrefs } from "@/lib/board/kanban";
import {
  labelIdsFromRows,
  mapLabelChips,
} from "@/lib/labels/labels";
import { listTeamLabels } from "@/lib/labels/queries";
import { OrbitMonth } from "@/components/views/orbit-month";
import { ProjectTabs } from "@/components/views/project-tabs";
import { SummaryDashboard } from "@/components/views/summary-dashboard";
import { TicketList } from "@/components/views/ticket-list";
import { TimelineChart } from "@/components/views/timeline-chart";
import { requireUser } from "@/lib/auth/session";
import { parseFocusId, withFocus } from "@/lib/focus/focus";
import { archiveProjectAction } from "@/lib/items/actions";
import {
  canArchiveProject,
  canComment,
  canWriteBoard,
} from "@/lib/items/permissions";
import { getItemFocus, getProjectBoard } from "@/lib/items/queries";
import { getLens, listLenses } from "@/lib/lenses/queries";
import {
  itemMatchesLens,
  lensQueryRecord,
  parseLensQuery,
  parseLensSpec,
  type LensSpec,
} from "@/lib/lenses/lenses";
import { getMembership } from "@/lib/teams/queries";
import {
  BOARD_VIEW_LABEL,
  boardViewHref,
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
  searchParams: Promise<{
    view?: string;
    ym?: string;
    q?: string;
    status?: string;
    who?: string;
    priority?: string;
    find?: string;
    labels?: string;
    lens?: string;
    focus?: string;
    lane?: string;
    hideDone?: string;
    compact?: string;
  }>;
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

  const savedRows = await listLenses(ctx.team.id, user.id);
  const saved = savedRows.map((row) => ({
    id: row.id,
    name: row.name,
    spec: parseLensSpec(row.spec),
  }));
  const pinned = query.lens
    ? await getLens(ctx.team.id, user.id, query.lens)
    : null;
  const spec: LensSpec = pinned
    ? parseLensSpec(pinned.spec)
    : parseLensQuery(query);
  const savedId = pinned?.id;
  const lensExtra = lensQueryRecord(spec, savedId);
  const focusId = parseFocusId(query.focus);
  const focused = focusId
    ? await getItemFocus(ctx.team.id, projectSlug, focusId)
    : null;
  const closeHref = boardViewHref(
    slug,
    projectSlug,
    view,
    formatYearMonth(year, month),
    lensExtra,
  );
  const focusHref = focused
    ? boardViewHref(
        slug,
        projectSlug,
        view,
        formatYearMonth(year, month),
        withFocus(lensExtra, focused.id),
      )
    : closeHref;
  const now = new Date();
  const matchCtx = { userId: user.id, now };

  const yearMonth = formatYearMonth(year, month);
  const writable = canWriteBoard(ctx.role) && !project.archived;
  const mayNote = canComment(ctx.role) && !project.archived;
  const mayArchive = canArchiveProject(ctx.role) && !project.archived;
  const people = ctx.team.members.map((member) => ({
    id: member.user.id,
    name: member.user.name,
  }));
  const nameByUserId = new Map(people.map((person) => [person.id, person.name]));
  const boardPrefs = parseBoardDisplayPrefs(query);
  const teamLabels = await listTeamLabels(ctx.team.id);
  const focusedLabels = focused ? mapLabelChips(focused.labels) : [];
  const focusedSubtasks = focused
    ? focused.subtasks.map((row) => ({
        id: row.id,
        title: row.title,
        done: row.done,
        position: row.position,
      }))
    : [];

  const groupNameByItem = new Map<string, string>();
  for (const group of project.groups) {
    for (const item of group.items) {
      groupNameByItem.set(item.id, group.name);
    }
  }

  const visible = (item: {
    title: string;
    status: string;
    priority: string;
    dueOn: Date | null;
    assignees: { userId: string }[];
    labels: { labelId: string }[];
    subtasks: { done: boolean }[];
    createdAt?: Date;
    updatedAt?: Date;
  }) =>
    itemMatchesLens(
      {
        title: item.title,
        status: item.status,
        priority: item.priority,
        dueOn: item.dueOn,
        assigneeIds: item.assignees.map((row) => row.userId),
        labelIds: labelIdsFromRows(item.labels),
        subtasks: item.subtasks,
      },
      spec,
      matchCtx,
    );

  const items = flattenBoardItems(project.groups)
    .filter(visible)
    .map((item) => ({
      ...item,
      href: boardViewHref(
        slug,
        projectSlug,
        view,
        yearMonth,
        withFocus(lensExtra, item.id),
      ),
      people: item.assignees.map((row) => row.user),
      groupName: groupNameByItem.get(item.id),
      labels: mapLabelChips(item.labels),
      labelIds: labelIdsFromRows(item.labels),
      subtasks: item.subtasks.map((row) => ({
        id: row.id,
        title: row.title,
        done: row.done,
        position: row.position,
      })),
    }));

  const summaryRows = items.map((item) => ({
    id: item.id,
    title: item.title,
    status: item.status,
    priority: item.priority,
    dueOn: item.dueOn,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
  }));

  const showFilters = view !== "summary";

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {BOARD_VIEW_LABEL[view]}
          </p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{project.name}</h1>
          {project.archived ? (
            <p className="mt-1 text-sm text-muted-foreground">This board is archived.</p>
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

      <ProjectTabs
        slug={slug}
        projectSlug={projectSlug}
        view={view}
        yearMonth={yearMonth}
        extra={lensExtra}
      />

      {showFilters ? (
        <FilterBar
          slug={slug}
          projectSlug={projectSlug}
          view={view}
          yearMonth={yearMonth}
          spec={spec}
          savedId={savedId}
          saved={saved}
          people={people}
          teamLabels={teamLabels}
        />
      ) : null}

      {view === "summary" ? (
        <SummaryDashboard
          items={summaryRows}
          now={now}
          focusHref={(id) =>
            boardViewHref(
              slug,
              projectSlug,
              "list",
              yearMonth,
              withFocus(lensExtra, id),
            )
          }
        />
      ) : null}

      {view === "list" ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <TicketList
            items={items.map((item) => ({
              id: item.id,
              title: item.title,
              status: item.status,
              priority: item.priority,
              dueOn: item.dueOn,
              href: item.href,
              people: item.people,
              position: item.position,
              projectSlug,
              groupName: item.groupName,
              active: focusId === item.id,
              labels: item.labels,
              subtasks: item.subtasks,
            }))}
            selectedId={focusId ?? undefined}
          />
          <div className="hidden rounded-lg border border-border bg-card lg:block">
            {focused ? (
              <div className="flex flex-col gap-4 p-4">
                <ul>
                  <ItemRow
                    slug={slug}
                    projectSlug={projectSlug}
                    currentUserId={user.id}
                    people={people}
                    teamLabels={teamLabels}
                    itemLabels={focusedLabels}
                    subtasks={focusedSubtasks}
                    item={focused}
                    readOnly={!writable}
                    next={focusHref}
                  />
                </ul>
                <CommentThread
                  slug={slug}
                  projectSlug={projectSlug}
                  itemId={focused.id}
                  next={focusHref}
                  notes={focused.updates}
                  canWrite={mayNote}
                />
              </div>
            ) : (
              <p className="p-6 text-sm text-muted-foreground">
                Pick a ticket from the list to open details on the right.
              </p>
            )}
          </div>
        </div>
      ) : null}

      {view === "flow" ? (
        <div className="flex flex-col gap-3">
          <BoardSettingsBar
            slug={slug}
            projectSlug={projectSlug}
            prefs={boardPrefs}
            lensExtra={lensExtra}
          />
          <FlowRiver
            slug={slug}
            projectSlug={projectSlug}
            items={items.map((item) => ({
              id: item.id,
              title: item.title,
              status: item.status,
              priority: item.priority,
              dueOn: item.dueOn,
              href: item.href,
              people: item.people,
              position: item.position,
              projectSlug,
              labels: item.labels,
              subtasks: item.subtasks.map((row) => ({ done: row.done })),
            }))}
            writable={writable}
            prefs={boardPrefs}
            nameByUserId={nameByUserId}
          />
        </div>
      ) : null}

      {view === "orbit" ? (
        <OrbitMonth
          slug={slug}
          projectSlug={projectSlug}
          year={year}
          month={month}
          items={items}
          extra={lensExtra}
        />
      ) : null}

      {view === "timeline" ? (
        <TimelineChart
          items={items.map((item) => ({
            id: item.id,
            title: item.title,
            status: item.status,
            createdAt: item.createdAt,
            dueOn: item.dueOn,
            href: boardViewHref(
              slug,
              projectSlug,
              view,
              yearMonth,
              withFocus(lensExtra, item.id),
            ),
          }))}
        />
      ) : null}

      {view === "list" && writable ? (
        <>
          {project.groups.map((group) => (
            <section key={group.id} id={`group-${group.id}`} className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold">{group.name}</h2>
              <CreateItemForm
                slug={slug}
                projectSlug={projectSlug}
                groupId={group.id}
                teamLabels={teamLabels}
              />
            </section>
          ))}
          <CreateGroupForm slug={slug} projectSlug={projectSlug} />
        </>
      ) : null}

      {focused && view !== "list" ? (
        <FocusStage closeHref={closeHref}>
          <ul>
            <ItemRow
              slug={slug}
              projectSlug={projectSlug}
              currentUserId={user.id}
              people={people}
              teamLabels={teamLabels}
              itemLabels={focusedLabels}
              subtasks={focusedSubtasks}
              item={focused}
              readOnly={!writable}
              next={focusHref}
            />
          </ul>
          <CommentThread
            slug={slug}
            projectSlug={projectSlug}
            itemId={focused.id}
            next={focusHref}
            notes={focused.updates}
            canWrite={mayNote}
          />
        </FocusStage>
      ) : null}

      {focused && view === "list" ? (
        <div className="lg:hidden">
          <FocusStage closeHref={closeHref}>
            <ul>
              <ItemRow
                slug={slug}
                projectSlug={projectSlug}
                currentUserId={user.id}
                people={people}
                teamLabels={teamLabels}
                itemLabels={focusedLabels}
                subtasks={focusedSubtasks}
                item={focused}
                readOnly={!writable}
                next={focusHref}
              />
            </ul>
            <CommentThread
              slug={slug}
              projectSlug={projectSlug}
              itemId={focused.id}
              next={focusHref}
              notes={focused.updates}
              canWrite={mayNote}
            />
          </FocusStage>
        </div>
      ) : null}
    </section>
  );
}
