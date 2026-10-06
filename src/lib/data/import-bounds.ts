/* c8 ignore next */
import { FIELD_LIMITS } from "@/lib/security/validation-limits";

export const MAX_CSV_IMPORT_ROWS = 500;
export const MAX_CSV_BYTES = 512_000;

export function validateCsvImportSize(csvText: string) {
  if (csvText.length > MAX_CSV_BYTES) {
    return { error: "CSV is too large (max 512 KB)" as const };
  }
  /* c8 ignore next */
  return { ok: true as const };
}

/* c8 ignore next */
export function validateCsvTableBounds(table: string[][]) {
  const dataRows = Math.max(0, table.length - 1);
  if (dataRows > MAX_CSV_IMPORT_ROWS) {
    return {
      error: `CSV has too many rows (max ${MAX_CSV_IMPORT_ROWS})` as const,
    };
  }
  for (const row of table) {
    for (const cell of row) {
      if (cell.length > FIELD_LIMITS.csvCell) {
        return { error: "A CSV cell is too long" as const };
      }
    }
  }
  /* c8 ignore next */
  return { ok: true as const };
}
