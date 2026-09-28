import { notFound } from "next/navigation";
import { LabelsSettings } from "@/components/labels/labels-settings";
import { TicketTemplatesInfo } from "@/components/teams/ticket-templates-info";
import { SettingsForm } from "@/components/teams/settings-form";
import { SettingsLayout } from "@/components/settings/settings-layout";
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
  const base = `/t/${slug}/settings`;

  const nav = [
    { id: "general", label: "General", href: `${base}#general` },
    { id: "labels", label: "Labels", href: `${base}#labels` },
    { id: "templates", label: "Templates", href: `${base}#templates` },
  ];

  return (
    <SettingsLayout
      title="Studio settings"
      description={ctx.team.name}
      items={nav}
      defaultSection="general"
    >
      {editable ? (
        <>
          <section id="general" className="scroll-mt-6">
            <SettingsForm slug={slug} settings={settings} />
          </section>
          <section id="labels" className="scroll-mt-6">
            <LabelsSettings slug={slug} labels={labels} />
          </section>
          <section id="templates" className="scroll-mt-6">
            <TicketTemplatesInfo settingsJson={ctx.team.settings} />
          </section>
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
    </SettingsLayout>
  );
}
