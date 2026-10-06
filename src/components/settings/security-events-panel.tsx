import { formatSecurityEventLine } from "@/lib/security/audit-log";

type Row = {
  id: string;
  kind: string;
  createdAt: Date;
  meta: string;
  actor: { name: string } | null;
};

export function SecurityEventsPanel({ events }: { events: Row[] }) {
  if (!events.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No security activity recorded yet.
      </p>
    );
  }
  return (
    <ol className="space-y-2 text-sm">
      {events.map((row) => (
        <li
          key={row.id}
          className="rounded-lg border border-border bg-muted/20 px-3 py-2"
        >
          <p className="text-foreground">{formatSecurityEventLine(row)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.createdAt.toISOString().slice(0, 16).replace("T", " ")}
          </p>
        </li>
      ))}
    </ol>
  );
}
