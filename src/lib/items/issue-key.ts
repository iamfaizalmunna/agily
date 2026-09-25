export function issueKeyPrefix(projectSlug: string): string {
  const parts = projectSlug.split(/[-_]/).filter(Boolean);
  if (!parts.length) return "TKT";
  if (parts.length === 1) {
    return parts[0].slice(0, 3).toUpperCase();
  }
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("").slice(0, 4);
}

export function formatIssueKey(projectSlug: string, position: number): string {
  return `${issueKeyPrefix(projectSlug)}-${position + 1}`;
}
