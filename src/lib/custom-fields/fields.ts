export const CUSTOM_FIELD_TYPES = ["text", "number", "select"] as const;
export type CustomFieldType = (typeof CUSTOM_FIELD_TYPES)[number];

export type CustomFieldDef = {
  id: string;
  key: string;
  label: string;
  type: CustomFieldType;
  options?: string[];
};

export type CustomFieldValues = Record<string, string | number | null>;

const FIELD_ID_RE = /^[a-z][a-z0-9_-]{0,23}$/;
const FIELD_KEY_RE = /^[a-z][a-z0-9_]{0,23}$/;

export function serializeFieldSchema(defs: CustomFieldDef[]): string {
  return JSON.stringify(defs);
}

export function parseFieldSchema(raw: string): CustomFieldDef[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  try {
    const data = JSON.parse(trimmed) as unknown;
    return fieldSchemaFromPayload(data) ?? [];
  } catch {
    return [];
  }
}

export function fieldSchemaFromPayload(data: unknown): CustomFieldDef[] | null {
  if (!Array.isArray(data)) return null;
  const defs: CustomFieldDef[] = [];
  const seen = new Set<string>();
  for (const row of data) {
    if (!row || typeof row !== "object") return null;
    const id = String((row as { id?: unknown }).id ?? "").trim();
    const key = String((row as { key?: unknown }).key ?? "").trim();
    const label = String((row as { label?: unknown }).label ?? "").trim();
    const type = String((row as { type?: unknown }).type ?? "").trim();
    if (
      !FIELD_ID_RE.test(id) ||
      !FIELD_KEY_RE.test(key) ||
      !label ||
      !(CUSTOM_FIELD_TYPES as readonly string[]).includes(type)
    ) {
      return null;
    }
    if (seen.has(id)) return null;
    seen.add(id);
    const def: CustomFieldDef = {
      id,
      key,
      label,
      type: type as CustomFieldType,
    };
    if (type === "select") {
      const options = (row as { options?: unknown }).options;
      if (!Array.isArray(options) || !options.length) return null;
      const cleaned = options
        .map((value) => String(value).trim())
        .filter(Boolean);
      if (!cleaned.length) return null;
      def.options = cleaned;
    }
    defs.push(def);
  }
  return defs;
}

export function serializeCustomFields(values: CustomFieldValues): string {
  return JSON.stringify(values);
}

export function parseCustomFields(raw: string): CustomFieldValues {
  const trimmed = raw.trim();
  if (!trimmed) return {};
  try {
    const data = JSON.parse(trimmed) as unknown;
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const out: CustomFieldValues = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === null) out[key] = null;
      else if (typeof value === "number" && Number.isFinite(value)) {
        out[key] = value;
      } else if (typeof value === "string") out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

export function slugifyFieldKey(label: string): string {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 23);
  return base || "field";
}

export function validateFieldValue(
  def: CustomFieldDef,
  raw: string,
): string | number | null | { error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (def.type === "text") {
    if (trimmed.length > 500) return { error: `${def.label} is too long` };
    return trimmed;
  }
  if (def.type === "number") {
    const num = Number(trimmed);
    if (!Number.isFinite(num)) {
      return { error: `${def.label} must be a number` };
    }
    return num;
  }
  const options = def.options ?? [];
  if (!options.includes(trimmed)) {
    return { error: `Pick a value for ${def.label}` };
  }
  return trimmed;
}

export function collectCustomFieldsFromForm(
  defs: CustomFieldDef[],
  formData: FormData,
): { values: CustomFieldValues } | { error: string } {
  const values: CustomFieldValues = {};
  for (const def of defs) {
    const raw = String(formData.get(`cf_${def.id}`) ?? "");
    const parsed = validateFieldValue(def, raw);
    if (parsed && typeof parsed === "object" && "error" in parsed) {
      return { error: parsed.error };
    }
    values[def.id] = parsed as string | number | null;
  }
  return { values };
}

export function mergeCustomFieldDefs(
  current: CustomFieldDef[],
  input: {
    label: string;
    type: CustomFieldType;
    options?: string[];
  },
): CustomFieldDef[] | { error: string } {
  const label = input.label.trim();
  if (!label) return { error: "Field label is required" };
  const type = input.type;
  if (!(CUSTOM_FIELD_TYPES as readonly string[]).includes(type)) {
    return { error: "Unknown field type" };
  }
  const keyBase = slugifyFieldKey(label);
  let key = keyBase;
  let n = 2;
  const usedKeys = new Set(current.map((row) => row.key));
  while (usedKeys.has(key)) {
    key = `${keyBase}_${n}`;
    n += 1;
  }
  const id = `f_${key}`;
  if (current.some((row) => row.id === id)) {
    return { error: "Field already exists" };
  }
  const def: CustomFieldDef = {
    id,
    key,
    label,
    type,
  };
  if (type === "select") {
    const options = (input.options ?? [])
      .map((value) => value.trim())
      .filter(Boolean);
    if (!options.length) return { error: "Select fields need options" };
    def.options = options;
  }
  return [...current, def];
}
