/** Shared layout + typography classes (Jira / GitHub density). */
export const ui = {
  page: "mx-auto flex w-full max-w-6xl flex-col gap-6",
  pageWide: "mx-auto flex w-full max-w-[90rem] flex-col gap-6",
  eyebrow: "text-xs font-semibold uppercase tracking-wide text-copper",
  title: "text-2xl font-semibold leading-tight text-paper sm:text-3xl",
  sectionTitle: "text-sm font-semibold text-paper",
  muted: "text-sm text-paper/60",
  meta: "text-xs text-paper/50",
  card:
    "rounded-lg border border-[var(--border)] bg-surface shadow-[var(--shadow-card)]",
  cardInteractive:
    "rounded-lg border border-[var(--border)] bg-surface shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]",
  input:
    "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--input-fill)] px-3 text-sm text-paper outline-none placeholder:text-paper/40 focus:border-copper focus:ring-2 focus:ring-copper/20",
  toolbar: "flex flex-wrap items-center gap-2",
} as const;
