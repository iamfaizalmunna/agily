/* c8 ignore next */
/** Map URL hash to an active settings section id. */
/* c8 ignore next */
export function resolveSettingsSection(
  hash: string,
  defaultSection: string,
  validIds: readonly string[],
): string {
  const id = hash.replace(/^#/, "").trim();
  if (id && validIds.includes(id)) return id;
  return defaultSection;
}
