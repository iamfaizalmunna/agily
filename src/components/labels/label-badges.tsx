import { labelContrastText, type LabelChip } from "@/lib/labels/labels";
import { cn } from "@/lib/cn";

export function LabelBadges({
  labels,
  compact = false,
  className,
}: {
  labels: LabelChip[];
  compact?: boolean;
  className?: string;
}) {
  if (!labels.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {labels.map((label) => (
        <span
          key={label.id}
          className={cn(
            "inline-flex max-w-[9rem] truncate rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            compact && "max-w-[6rem] text-[9px]",
          )}
          style={{
            backgroundColor: label.color,
            color: labelContrastText(label.color),
          }}
          title={label.name}
        >
          {label.name}
        </span>
      ))}
    </div>
  );
}
