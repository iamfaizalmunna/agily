import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CustomFieldDef, CustomFieldValues } from "@/lib/custom-fields/fields";

export function ItemCustomFields({
  defs,
  values,
}: {
  defs: CustomFieldDef[];
  values: CustomFieldValues;
}) {
  if (!defs.length) return null;

  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Custom fields
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {defs.map((def) => {
          const current = values[def.id];
          const value =
            current === null || current === undefined ? "" : String(current);
          if (def.type === "select") {
            return (
              <Select
                key={def.id}
                name={`cf_${def.id}`}
                defaultValue={value}
                className="h-10 px-3 text-sm"
              >
                <option value="">—</option>
                {(def.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            );
          }
          return (
            <Input
              key={def.id}
              name={`cf_${def.id}`}
              type={def.type === "number" ? "number" : "text"}
              defaultValue={value}
              placeholder={def.label}
              aria-label={def.label}
            />
          );
        })}
      </div>
    </fieldset>
  );
}
