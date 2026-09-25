import { notFound } from "next/navigation";
import { LabelsSettings } from "@/components/labels/labels-settings";
import { SettingsForm } from "@/components/teams/settings-form";
import { listTeamLabels } from "@/lib/labels/queries";
import { requireUser } from "@/lib/auth/session";
import {
  canEditSettings,
  parseTeamSettings,
  type TeamRole,
} from "@/lib/rbac/roles";
import { getMembership } from "@/lib/teams/queries";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) notFound();

  const settings = parseTeamSettings(ctx.team.settings);
  const editable = canEditSettings(ctx.role);
  const labels = await listTeamLabels(ctx.team.id);

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Settings
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{ctx.team.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Control who can create boards and invite people.
        </p>
      </div>

      {editable ? (
        <>
          <SettingsForm slug={slug} settings={settings} />
          <LabelsSettings slug={slug} labels={labels} />
        </>
      ) : (
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Read only</p>
          <ul className="mt-3 space-y-2">
            <li>
              Members can create boards:{" "}
              {settings.membersCanCreateProjects ? "Yes" : "No"}
            </li>
            <li>
              Members can invite: {settings.membersCanInvite ? "Yes" : "No"}
            </li>
            <li>
              Default invite role: {settings.defaultInviteRole as TeamRole}
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
