import { FocusDiscussion } from "@/components/focus/focus-discussion";
import { ItemRow } from "@/components/items/item-row";
import type { ActivityFeedEntry } from "@/lib/activity/feed";
import type { MentionMember } from "@/lib/activity/mentions";
import type { CustomFieldDef, CustomFieldValues } from "@/lib/custom-fields/fields";
import type { LabelChip } from "@/lib/labels/labels";
import type { SubtaskRow } from "@/lib/subtasks/subtasks";
import type { Workflow } from "@/lib/workflow/workflow";

type Person = { id: string; name: string };

export function ListTicketDetail({
  slug,
  projectSlug,
  currentUserId,
  people,
  teamLabels,
  itemLabels,
  subtasks,
  epics,
  parent,
  workflow,
  fieldSchema,
  customFields,
  item,
  readOnly,
  next,
  focusHref,
  mayNote,
  studioMembers,
  feed,
  comments,
  focusDetail = false,
}: {
  slug: string;
  projectSlug: string;
  currentUserId: string;
  people: Person[];
  teamLabels: LabelChip[];
  itemLabels: LabelChip[];
  subtasks: SubtaskRow[];
  epics: { id: string; title: string; position: number }[];
  parent: {
    id: string;
    title: string;
    type: string;
    position: number;
  } | null;
  workflow: Workflow;
  fieldSchema: CustomFieldDef[];
  customFields: CustomFieldValues;
  item: Parameters<typeof ItemRow>[0]["item"];
  readOnly: boolean;
  next: string;
  focusHref: string;
  mayNote: boolean;
  studioMembers: MentionMember[];
  feed: ActivityFeedEntry[];
  comments: Parameters<typeof FocusDiscussion>[0]["comments"];
  focusDetail?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <ul>
        <ItemRow
          slug={slug}
          projectSlug={projectSlug}
          currentUserId={currentUserId}
          people={people}
          teamLabels={teamLabels}
          itemLabels={itemLabels}
          subtasks={subtasks}
          epics={epics}
          parent={parent}
          workflow={workflow}
          fieldSchema={fieldSchema}
          customFields={customFields}
          item={item}
          readOnly={readOnly}
          next={next}
          focusDetail={focusDetail}
        />
      </ul>
      <FocusDiscussion
        slug={slug}
        projectSlug={projectSlug}
        itemId={item.id}
        next={focusHref}
        canWrite={mayNote}
        members={studioMembers}
        feed={feed}
        comments={comments}
      />
    </div>
  );
}
