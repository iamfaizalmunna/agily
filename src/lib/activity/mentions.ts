export type MentionMember = {
  id: string;
  name: string;
  email: string;
};

export function mentionTokens(members: MentionMember[]) {
  const rows: { token: string; userId: string; label: string }[] = [];
  for (const member of members) {
    const local = member.email.split("@")[0]?.toLowerCase() ?? "";
    const compact = member.name.replace(/\s+/g, "");
    rows.push({ token: member.name.toLowerCase(), userId: member.id, label: member.name });
    if (compact) {
      rows.push({ token: compact.toLowerCase(), userId: member.id, label: member.name });
    }
    if (local) {
      rows.push({ token: local, userId: member.id, label: member.name });
    }
  }
  return rows;
}

const HANDLE_RE = /@([A-Za-z0-9][A-Za-z0-9._-]*)/g;

export function parseMentionUserIds(body: string, members: MentionMember[]) {
  const lookup = new Map<string, string>();
  for (const row of mentionTokens(members)) {
    if (!lookup.has(row.token)) lookup.set(row.token, row.userId);
  }
  const ids = new Set<string>();
  for (const match of body.matchAll(HANDLE_RE)) {
    const key = match[1].toLowerCase();
    const userId = lookup.get(key);
    if (userId) ids.add(userId);
  }
  return [...ids];
}

export function mentionSuggestions(
  members: MentionMember[],
  query: string,
) {
  const q = query.trim().toLowerCase();
  if (!q) return members.slice(0, 8);
  return members
    .filter((member) => {
      const local = member.email.split("@")[0]?.toLowerCase() ?? "";
      const compact = member.name.replace(/\s+/g, "").toLowerCase();
      return (
        member.name.toLowerCase().includes(q) ||
        local.includes(q) ||
        compact.includes(q)
      );
    })
    .slice(0, 8);
}
