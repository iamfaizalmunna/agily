export function suggestDuplicateProjectName(name: string): string {
  const trimmed = name.trim();
  const copyMatch = / \(copy(?: (\d+))?\)$/.exec(trimmed);
  if (!copyMatch) return `${trimmed} (copy)`;
  const n = copyMatch[1] ? Number(copyMatch[1]) + 1 : 2;
  const base = trimmed.replace(/ \(copy(?: \d+)?\)$/, "");
  return `${base} (copy ${n})`;
}
