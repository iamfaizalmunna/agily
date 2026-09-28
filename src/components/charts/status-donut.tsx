import type { DonutSegment } from "@/lib/views/analytics";

const SLICE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 142 76% 36%))",
  "hsl(var(--chart-3, 38 92% 50%))",
  "hsl(var(--chart-4, 217 91% 60%))",
  "hsl(var(--chart-5, 280 65% 60%))",
];

export function StatusDonut({ segments }: { segments: DonutSegment[] }) {
  if (!segments.length) {
    return <p className="text-sm text-muted-foreground">No tickets to chart.</p>;
  }
  const size = 120;
  const radius = 44;
  const stroke = 14;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0 -rotate-90"
        role="img"
        aria-label="Status distribution"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        {segments.map((segment, index) => {
          const length = (segment.percent / 100) * circumference;
          const gap = circumference - length;
          return (
            <circle
              key={segment.status}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={SLICE_COLORS[index % SLICE_COLORS.length]}
              strokeWidth={stroke}
              strokeDasharray={`${length} ${gap}`}
              strokeDashoffset={-(segment.offset / 100) * circumference}
            />
          );
        })}
      </svg>
      <ul className="flex flex-1 flex-col gap-1.5 text-sm">
        {segments.map((segment, index) => (
          <li key={segment.status} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: SLICE_COLORS[index % SLICE_COLORS.length] }}
              />
              {segment.label}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {segment.count} ({segment.percent}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
