export function mobileNavHomeActive(path: string, teamSlug: string | undefined) {
  if (!teamSlug) return path === "/home";
  return path === `/t/${teamSlug}`;
}

export function mobileNavBoardsActive(path: string, teamSlug: string | undefined) {
  if (!teamSlug) return false;
  return path.startsWith(`/t/${teamSlug}/p/`);
}

export function mobileNavInboxActive(path: string) {
  return path.endsWith("/notices");
}

export function mobileBoardsHref(teamSlug: string) {
  return `/t/${teamSlug}#studio-boards`;
}

export function mobileCreateHref(
  teamSlug: string,
  projectSlug: string | undefined,
) {
  if (projectSlug) {
    return `/t/${teamSlug}/p/${projectSlug}?view=list#create-ticket`;
  }
  return `/t/${teamSlug}#create-board`;
}
