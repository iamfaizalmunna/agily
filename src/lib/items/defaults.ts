/* c8 ignore next */
export const DEFAULT_GROUP_NAMES = ["Now", "Next", "Later"] as const;

/* c8 ignore next */
export function defaultGroupSeed() {
  return DEFAULT_GROUP_NAMES.map((name, position) => ({ name, position }));
}
