import type { LabelChip } from "@/lib/labels/labels";
import { cn } from "@/lib/cn";

export function LabelPicker({
  labels,
  selectedIds,
  name = "labelIds",
  disabled = false,
}: {
  labels: LabelChip[];
  selectedIds?: string[];
  name?: string;
  disabled?: boolean;
}) {
  if (!labels.length) {
    return (
      <p className="text-xs text-muted-foreground">
        No labels yet. Owners can add them in studio settings.
      </p>
    );
  }
  const selected = new Set(selectedIds ?? []);
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Labels
      </legend>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => {
          const active = selected.has(label.id);
          return (
            <label
              key={label.id}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                type="checkbox"
                name={name}
                value={label.id}
                defaultChecked={active}
                className="sr-only"
              />
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              <span className="text-foreground">{label.name}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
