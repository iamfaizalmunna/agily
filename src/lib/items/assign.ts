/* c8 ignore next */
export function filterAssignableIds(
  requested: string[],
  teamUserIds: string[],
) {
  const allowed = new Set(teamUserIds);
  return [...new Set(requested.filter((id) => id.trim()))].filter((id) =>
    allowed.has(id),
  );
}

export function toggleAssignee(ids: string[], userId: string) {
  if (!userId) return [...ids];
  return ids.includes(userId)
    ? ids.filter((id) => id !== userId)
    : [...ids, userId];
}

export function isAssigned(ids: string[], userId: string) {
  return ids.includes(userId);
}

export function personInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0]!}${parts[parts.length - 1]![0]!}`.toUpperCase();
}

/* c8 ignore next */
export function collectAssigneeIds(formData: FormData) {
  return formData
    .getAll("assigneeIds")
    .map((value) => String(value).trim())
    .filter(Boolean);
}
