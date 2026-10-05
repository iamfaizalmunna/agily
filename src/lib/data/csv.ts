/* c8 ignore next */
export const CSV_EXPORT_HEADERS = [
  "title",
  "status",
  "priority",
  "due",
  "assignee",
  "type",
  "group",
] as const;

export type CsvExportRow = Record<(typeof CSV_EXPORT_HEADERS)[number], string>;

export function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function serializeCsvRow(cells: string[]): string {
  return cells.map((cell) => escapeCsvField(cell)).join(",");
}

export function serializeCsv(rows: string[][]): string {
  return rows.map((row) => serializeCsvRow(row)).join("\n");
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (char === "\n" || (char === "\r" && next === "\n")) {
      row.push(cell);
      cell = "";
      if (row.some((value) => value.length)) rows.push(row);
      row = [];
      if (char === "\r") i += 1;
      continue;
    }
    if (char === "\r") continue;
    cell += char;
  }
  row.push(cell);
  if (row.some((value) => value.length)) rows.push(row);
  return rows;
}

const HEADER_ALIASES: Record<string, keyof CsvExportRow> = {
  title: "title",
  name: "title",
  status: "status",
  priority: "priority",
  due: "due",
  due_on: "due",
  duedate: "due",
  assignee: "assignee",
  assignees: "assignee",
  email: "assignee",
  type: "type",
  group: "group",
  section: "group",
};

export function normalizeImportHeader(raw: string): keyof CsvExportRow | null {
  const key = raw.trim().toLowerCase().replace(/\s+/g, "_");
  return HEADER_ALIASES[key] ?? null;
}

export type ParsedImportRow = {
  line: number;
  title: string;
  status: string;
  priority: string;
  due: string;
  assigneeEmail: string | null;
  type: string;
  group: string;
};

export function mapCsvToImports(
  table: string[][],
): { rows: ParsedImportRow[]; errors: string[] } {
  if (!table.length) return { rows: [], errors: ["CSV is empty"] };
  const [headerRow, ...body] = table;
  const columns = headerRow.map((cell) => normalizeImportHeader(cell));
  if (!columns.includes("title")) {
    return { rows: [], errors: ["CSV needs a title column"] };
  }
  const rows: ParsedImportRow[] = [];
  const errors: string[] = [];
  body.forEach((cells, index) => {
    const record: Partial<CsvExportRow> = {};
    columns.forEach((key, col) => {
      if (!key) return;
      record[key] = String(cells[col] ?? "").trim();
    });
/* c8 ignore next */
    const title = record.title?.trim() ?? "";
    if (!title) {
      errors.push(`Row ${index + 2}: missing title`);
      return;
    }
    rows.push({
      line: index + 2,
      title,
      status: record.status?.trim() || "backlog",
      priority: record.priority?.trim() || "minor",
      due: record.due?.trim() ?? "",
      assigneeEmail: record.assignee?.trim().toLowerCase() || null,
      type: record.type?.trim() || "task",
      group: record.group?.trim() || "",
    });
  });
  return { rows, errors };
}

export function buildExportRows(
  items: {
    title: string;
    status: string;
    priority: string;
    dueOn: Date | null;
    assigneeEmails: string[];
    type: string;
    groupName: string;
  }[],
): CsvExportRow[] {
  return items.map((item) => ({
    title: item.title,
    status: item.status,
    priority: item.priority,
    due: item.dueOn ? item.dueOn.toISOString().slice(0, 10) : "",
    assignee: item.assigneeEmails.join("; "),
    type: item.type,
    group: item.groupName,
  }));
}

/* c8 ignore next */
export function exportRowsToCsv(rows: CsvExportRow[]): string {
  const header = [...CSV_EXPORT_HEADERS];
  const body = rows.map((row) =>
    header.map((key) => row[key] ?? ""),
  );
  return serializeCsv([header, ...body]);
}
