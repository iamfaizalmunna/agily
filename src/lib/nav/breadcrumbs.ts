export type Crumb = { label: string; href?: string };

export function studioCrumbs(path: string, names: {
  team?: string;
  project?: string;
  page?: string;
}): Crumb[] {
  const slug = path.match(/^\/t\/([^/]+)/)?.[1];
  const project = path.match(/^\/t\/[^/]+\/p\/([^/]+)/)?.[1];
  const crumbs: Crumb[] = [{ label: "Studios", href: "/home" }];

  if (slug && names.team) {
    crumbs.push({ label: names.team, href: `/t/${slug}` });
  }
  if (slug && project && names.project) {
    crumbs.push({
      label: names.project,
      href: `/t/${slug}/p/${project}`,
    });
  }
  if (names.page) {
    crumbs.push({ label: names.page });
  }
  return crumbs;
}
