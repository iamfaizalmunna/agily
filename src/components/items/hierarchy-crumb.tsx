import Link from "next/link";
import { formatIssueKey } from "@/lib/items/issue-key";
import { ISSUE_TYPE_LABEL, parseIssueType } from "@/lib/items/issue-type";

export function HierarchyCrumb({
  slug,
  projectSlug,
  parent,
  childType,
}: {
  slug: string;
  projectSlug: string;
  parent: { id: string; title: string; type: string; position: number };
  childType: string;
}) {
  const parentType = parseIssueType(parent.type);
  const type = parseIssueType(childType);
  const epicKey = formatIssueKey(projectSlug, parent.position);
  const href = `/t/${slug}/p/${projectSlug}?view=list&focus=${parent.id}`;

  return (
    <p className="text-xs text-muted-foreground">
      <Link href={href} className="font-medium text-primary hover:underline">
        {ISSUE_TYPE_LABEL[parentType]} {epicKey} · {parent.title}
      </Link>
      <span className="mx-1">›</span>
      <span>{ISSUE_TYPE_LABEL[type]}</span>
    </p>
  );
}
