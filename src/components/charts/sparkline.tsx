export function Sparkline({
  values,
  labels,
}: {
  values: number[];
  labels: string[];
}) {
  if (!values.length) {
    return <p className="text-sm text-muted-foreground">No completions yet.</p>;
  }
  const width = 240;
  const height = 56;
  const pad = 4;
  const max = Math.max(...values, 1);
  const step = (width - pad * 2) / Math.max(values.length - 1, 1);
  const points = values
    .map((value, index) => {
      const x = pad + index * step;
      const y = height - pad - (value / max) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col gap-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-14 w-full text-primary"
        role="img"
        aria-label="Completed per day"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
      <div className="flex justify-between text-[0.65rem] text-muted-foreground">
        <span>{labels[0]}</span>
        <span>{labels.at(-1)}</span>
      </div>
    </div>
  );
}
