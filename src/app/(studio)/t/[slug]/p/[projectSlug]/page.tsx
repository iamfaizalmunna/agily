import { notFound } from "next/navigation";
import { FocusDiscussion } from "@/components/focus/focus-discussion";
import { FocusStage } from "@/components/focus/focus-stage";
import { buildActivityFeed } from "@/lib/activity/feed";
import { CreateGroupForm } from "@/components/items/create-group-form";
import { CreateItemForm } from "@/components/items/create-item-form";
import { ItemRow } from "@/components/items/item-row";
import { EmptyState } from "@/components/chrome/empty-state";
import { FilterBar } from "@/components/lenses/filter-bar";
import { Button } from "@/components/ui/button";
import { MobileBoardBack } from "@/components/hub/mobile-board-back";
import { RecentBoardTracker } from "@/components/hub/recent-board-tracker";
import { MobilePage } from "@/components/ui/mobile-page";
import { BoardSettingsBar } from "@/components/views/board-settings-bar";
import { BoardExportLink } from "@/components/views/board-export-link";
import { FlowRiver } from "@/components/views/flow-river";
import { parseBoardDisplayPrefs } from "@/lib/board/kanban";
import {
  parseCustomFields,
  parseFieldSchema,
} from "@/lib/custom-fields/fields";
import { ticketTemplatesFromTeamSettings } from "@/lib/data/templates";
import { resolveWorkflow } from "@/lib/workflow/workflow";
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
import {
  blockedItemIds,
  ganttDependencyIds,
} from "@/lib/dependencies/dependencies";
import {
  getItemFocus,
  getProjectBoard,
  listProjectDependencies,
} from "@/lib/items/queries";
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
    epic?: string;
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
  const workflow = resolveWorkflow(project.workflow);
  const fieldSchema = parseFieldSchema(project.fieldSchema);
  const ticketTemplates = ticketTemplatesFromTeamSettings(ctx.team.settings);
  const dependencyRows = await listProjectDependencies(project.id);

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

  const yearMonth = formatYearMonth(year, month);
  const writable = canWriteBoard(ctx.role) && !project.archived;
  const mayNote = canComment(ctx.role) && !project.archived;
  const mayArchive = canArchiveProject(ctx.role) && !project.archived;
  const studioMembers = ctx.team.members.map((member) => ({
    id: member.user.id,
    name: member.user.name,
    email: member.user.email,
  }));
  const focusFeed = focused
    ? buildActivityFeed(
        focused.events,
        focused.updates.flatMap((comment) => [
          {
            id: comment.id,
            body: comment.body,
            createdAt: comment.createdAt,
            parentId: null,
            user: comment.user,
          },
          ...comment.replies.map((reply) => ({
            id: reply.id,
            body: reply.body,
            createdAt: reply.createdAt,
            parentId: comment.id,
            user: reply.user,
          })),
        ]),
      )
    : [];
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
  const allBoardItems = flattenBoardItems(project.groups);
  const blockedIds = blockedItemIds(
    allBoardItems.map((item) => ({ id: item.id, status: item.status })),
    dependencyRows,
  );
  const matchCtx = { userId: user.id, now, blockedIds };
  const projectEpics = allBoardItems
    .filter((item) => item.type === "epic")
    .map((item) => ({
      id: item.id,
      title: item.title,
      position: item.position,
    }));
  for (const group of project.groups) {
    for (const item of group.items) {
      groupNameByItem.set(item.id, group.name);
    }
  }

  const visible = (item: {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueOn: Date | null;
    assignees: { userId: string }[];
    labels: { labelId: string }[];
    subtasks: { done: boolean }[];
    parentId: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) =>
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
    type: item.type,
    parentId: item.parentId,
    priority: item.priority,
    dueOn: item.dueOn,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
  }));

  const showFilters = view !== "summary";

  return (
    <MobilePage className="gap-4">
      <RecentBoardTracker
        teamSlug={slug}
        projectSlug={projectSlug}
        projectName={project.name}
        view={view}
      />
      <MobileBoardBack slug={slug} />
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
        <div className="flex flex-col gap-2">
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
            epics={projectEpics}
          />
          <div className="flex justify-end">
            <BoardExportLink
              slug={slug}
              projectSlug={projectSlug}
              spec={spec}
              savedId={savedId}
            />
          </div>
        </div>
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

      {view === "list" && !items.length ? (
        <EmptyState
          title="No tickets yet"
          body="Add your first ticket in a section below, or clear filters if you are using a lens."
          action={
            writable
              ? { href: "#create-ticket", label: "Add a ticket" }
              : undefined
          }
        />
      ) : null}

      {view === "list" && items.length ? (
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
                    epics={projectEpics}
                    parent={focused.parent}
                    workflow={workflow}
                    fieldSchema={fieldSchema}
                    customFields={parseCustomFields(focused.customFields)}
                    item={focused}
                    readOnly={!writable}
                    next={focusHref}
                  />
                </ul>
                <FocusDiscussion
                  slug={slug}
                  projectSlug={projectSlug}
                  itemId={focused.id}
                  next={focusHref}
                  canWrite={mayNote}
                  members={studioMembers}
                  feed={focusFeed}
                  comments={focused.updates}
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
          {!items.length ? (
            <EmptyState
              title="Board is empty"
              body="Create tickets from List view or import CSV from board settings."
              action={
                writable
                  ? {
                      href: boardViewHref(slug, projectSlug, "list", yearMonth, {
                        ...lensExtra,
                      }) + "#create-ticket",
                      label: "Go to List",
                    }
                  : undefined
              }
            />
          ) : null}
          {items.length ? (
          <FlowRiver
            slug={slug}
            projectSlug={projectSlug}
            workflow={workflow}
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
              type: item.type,
            }))}
            writable={writable}
            prefs={boardPrefs}
            nameByUserId={nameByUserId}
          />
          ) : null}
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
          slug={slug}
          projectSlug={projectSlug}
          canWrite={writable}
          items={items.map((item) => ({
            id: item.id,
            title: item.title,
            status: item.status,
            type: item.type,
            createdAt: item.createdAt,
            dueOn: item.dueOn,
            dependencyIds: ganttDependencyIds(item.id, dependencyRows),
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
          {project.groups.map((group, index) => (
            <section
              key={group.id}
              id={index === 0 ? "create-ticket" : `group-${group.id}`}
              className="scroll-mt-6 flex flex-col gap-2"
            >
              <h2 className="text-sm font-semibold">{group.name}</h2>
              <CreateItemForm
                slug={slug}
                projectSlug={projectSlug}
                groupId={group.id}
                teamLabels={teamLabels}
                epics={projectEpics}
                templates={ticketTemplates}
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
              epics={projectEpics}
              parent={focused.parent}
              workflow={workflow}
              fieldSchema={fieldSchema}
              customFields={parseCustomFields(focused.customFields)}
              item={focused}
              readOnly={!writable}
              next={focusHref}
            />
          </ul>
          <FocusDiscussion
            slug={slug}
            projectSlug={projectSlug}
            itemId={focused.id}
            next={focusHref}
            canWrite={mayNote}
            members={studioMembers}
            feed={focusFeed}
            comments={focused.updates}
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
                epics={projectEpics}
                parent={focused.parent}
                workflow={workflow}
                fieldSchema={fieldSchema}
                customFields={parseCustomFields(focused.customFields)}
                item={focused}
                readOnly={!writable}
                next={focusHref}
              />
            </ul>
            <FocusDiscussion
              slug={slug}
              projectSlug={projectSlug}
              itemId={focused.id}
              next={focusHref}
              canWrite={mayNote}
              members={studioMembers}
              feed={focusFeed}
              comments={focused.updates}
            />
          </FocusStage>
        </div>
      ) : null}
    </MobilePage>
  );
}
