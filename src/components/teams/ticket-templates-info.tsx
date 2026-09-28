import {
  DEFAULT_TICKET_TEMPLATES,
  ticketTemplatesFromTeamSettings,
} from "@/lib/data/templates";

export function TicketTemplatesInfo({ settingsJson }: { settingsJson: string }) {
  const templates = ticketTemplatesFromTeamSettings(settingsJson);
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold">Ticket templates</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Studio-wide starters when adding tickets. Custom templates can be stored
          in team settings JSON; otherwise these defaults apply.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {templates.map((template) => (
          <li
            key={template.id}
            className="rounded-md border border-border px-3 py-2 text-sm"
          >
            <p className="font-medium">{template.name}</p>
            <p className="text-xs text-muted-foreground">
              {template.type} · {template.priority}
            </p>
          </li>
        ))}
      </ul>
      {templates.length === DEFAULT_TICKET_TEMPLATES.length ? (
        <p className="text-xs text-muted-foreground">
          Using built-in templates:{" "}
          {DEFAULT_TICKET_TEMPLATES.map((row) => row.name).join(", ")}.
        </p>
      ) : null}
    </div>
  );
}
