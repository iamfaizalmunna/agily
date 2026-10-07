import { notFound } from "next/navigation";
import { LabelsSettings } from "@/components/labels/labels-settings";
import { TicketTemplatesInfo } from "@/components/teams/ticket-templates-info";
import { SettingsForm } from "@/components/teams/settings-form";
import {
  SettingsLayout,
  type SettingsNavItem,
} from "@/components/settings/settings-layout";
import { listTeamLabels } from "@/lib/labels/queries";
import { requireUser } from "@/lib/auth/session";
import {
  canEditSettings,
  parseTeamSettings,
  type TeamRole,
} from "@/lib/rbac/roles";
import { getMembership } from "@/lib/teams/queries";
import { listRecentSecurityEvents } from "@/lib/security/audit-log";
import { SecurityEventsPanel } from "@/components/settings/security-events-panel";
import { NotificationPrefsPanel } from "@/components/notices/notification-prefs-panel";

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
  const isOwner = ctx.role === "owner";
  const securityEvents = isOwner
    ? await listRecentSecurityEvents(ctx.team.id, 50)
    : [];
  const base = `/t/${slug}/settings`;

  const nav: SettingsNavItem[] = [
    {
      id: "general",
      label: "General",
      href: `${base}#general`,
      icon: "nav.settings",
    },
    {
      id: "notifications",
      label: "Notifications",
      href: `${base}#notifications`,
      icon: "nav.notices",
    },
    {
      id: "labels",
      label: "Labels",
      href: `${base}#labels`,
      icon: "action.tag",
    },
    {
      id: "templates",
      label: "Templates",
      href: `${base}#templates`,
      icon: "action.workflow",
    },
    ...(isOwner
      ? ([
          {
            id: "security",
            label: "Security",
            href: `${base}#security`,
            icon: "action.shield" as const,
          },
        ] satisfies SettingsNavItem[])
      : []),
  ];

  return (
    <SettingsLayout
      title="Studio settings"
      description={ctx.team.name}
      items={nav}
      defaultSection="general"
    >
      <section id="notifications" className="scroll-mt-6">
        <h2 className="mb-3 text-lg font-medium text-foreground">Notifications</h2>
        <NotificationPrefsPanel />
      </section>

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
          {isOwner ? (
            <section id="security" className="scroll-mt-6">
              <h2 className="mb-3 text-lg font-medium text-foreground">
                Recent security activity
              </h2>
              <SecurityEventsPanel events={securityEvents} />
            </section>
          ) : null}
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
