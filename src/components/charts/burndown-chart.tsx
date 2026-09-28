import type { BurndownPoint } from "@/lib/views/analytics";

export function BurndownChart({
  points,
  scope,
}: {
  points: BurndownPoint[];
  scope: number;
}) {
  if (!points.length) {
    return <p className="text-sm text-muted-foreground">No burndown data yet.</p>;
  }
  const width = 320;
  const height = 160;
  const pad = 24;
  const maxY = Math.max(scope, ...points.map((row) => row.remaining), 1);
  const step = (width - pad * 2) / Math.max(points.length - 1, 1);
  const y = (value: number) =>
    height - pad - (value / maxY) * (height - pad * 2);

  const line = (key: "remaining" | "ideal") =>
    points
      .map((row, index) => {
        const x = pad + index * step;
        return `${index === 0 ? "M" : "L"}${x},${y(row[key])}`;
      })
      .join(" ");

  return (
    <div className="flex flex-col gap-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-40 w-full text-muted-foreground"
        role="img"
        aria-label="Burndown chart"
      >
        <path
          d={line("ideal")}
          fill="none"
          stroke="currentColor"
          strokeDasharray="4 4"
          strokeWidth="1.5"
          opacity={0.5}
        />
        <path
          d={line("remaining")}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
      </svg>
      <div className="flex justify-between text-[0.65rem] uppercase tracking-wide text-muted-foreground">
        <span>{points[0]?.label}</span>
        <span className="text-primary">Actual</span>
        <span>Dashed ideal</span>
        <span>{points.at(-1)?.label}</span>
      </div>
    </div>
  );
}
