/** Map URL hash to an active settings section id. */
export function resolveSettingsSection(
  hash: string,
  defaultSection: string,
  validIds: readonly string[],
): string {
  const id = hash.replace(/^#/, "").trim();
  if (id && validIds.includes(id)) return id;
  return defaultSection;
}
