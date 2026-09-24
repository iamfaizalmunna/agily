export function teamSlugFromPath(path: string) {
  const match = path.match(/^\/t\/([^/]+)/);
  return match?.[1] ?? null;
}

export function projectSlugFromPath(path: string) {
  const match = path.match(/^\/t\/[^/]+\/p\/([^/]+)/);
  return match?.[1] ?? null;
}

export function studioMark(name: string | undefined) {
  const letter = name?.trim().slice(0, 1).toUpperCase();
  return letter || "A";
}
