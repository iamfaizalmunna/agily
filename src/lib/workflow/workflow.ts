import {
  ITEM_STATUSES,
  STATUS_LABEL,
  type ItemStatus,
} from "@/lib/items/status";

export type WorkflowStatus = {
  id: string;
  label: string;
  color: string;
};

export type Workflow = {
  statuses: WorkflowStatus[];
};

const STATUS_COLOR: Record<ItemStatus, string> = {
  backlog: "#6b7280",
  ready: "#3b82f6",
  doing: "#f59e0b",
  review: "#a855f7",
  done: "#22c55e",
};

const STATUS_ID_RE = /^[a-z][a-z0-9_-]{0,23}$/;
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function defaultWorkflow(): Workflow {
  return {
    statuses: ITEM_STATUSES.map((id) => ({
      id,
      label: STATUS_LABEL[id],
      color: STATUS_COLOR[id],
    })),
  };
}

export function serializeWorkflow(workflow: Workflow): string {
  return JSON.stringify(workflow);
}

export function parseProjectWorkflow(raw: string): Workflow | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const data = JSON.parse(trimmed) as unknown;
    return workflowFromPayload(data);
  } catch {
    return null;
  }
}

export function workflowFromPayload(data: unknown): Workflow | null {
  if (!data || typeof data !== "object") return null;
  const statuses = (data as { statuses?: unknown }).statuses;
  if (!Array.isArray(statuses) || !statuses.length) return null;
  const parsed: WorkflowStatus[] = [];
  const seen = new Set<string>();
  for (const row of statuses) {
    if (!row || typeof row !== "object") return null;
    const id = String((row as { id?: unknown }).id ?? "").trim();
    const label = String((row as { label?: unknown }).label ?? "").trim();
    const color = String((row as { color?: unknown }).color ?? "").trim();
    if (!STATUS_ID_RE.test(id) || !label || !HEX_COLOR_RE.test(color)) {
      return null;
    }
    if (seen.has(id)) return null;
    seen.add(id);
    parsed.push({ id, label, color });
  }
  return { statuses: parsed };
}

export function resolveWorkflow(raw: string | null | undefined): Workflow {
  const parsed = raw ? parseProjectWorkflow(raw) : null;
  if (!parsed) return defaultWorkflow();
  const normalized = normalizeWorkflow(parsed);
  if ("error" in normalized) return defaultWorkflow();
  return normalized;
}

export function normalizeWorkflow(
  input: Workflow,
): Workflow | { error: string } {
  const byId = new Map(input.statuses.map((row) => [row.id, row]));
  for (const required of ITEM_STATUSES) {
    if (!byId.has(required)) {
      return { error: `Workflow must include status "${required}"` };
    }
  }
  const ordered: WorkflowStatus[] = [];
  const seen = new Set<string>();
  for (const row of input.statuses) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    ordered.push(row);
  }
  if (!ordered.length) return { error: "Workflow needs at least one status" };
  return { statuses: ordered };
}

export function isWorkflowStatus(workflow: Workflow, value: string): boolean {
  return workflow.statuses.some((row) => row.id === value);
}

export function workflowStatusIds(workflow: Workflow): string[] {
  return workflow.statuses.map((row) => row.id);
}

export function visibleWorkflowStatuses(
  workflow: Workflow,
  hideDone: boolean,
): readonly string[] {
  if (!hideDone) return workflow.statuses.map((row) => row.id);
  return workflow.statuses
    .filter((row) => row.id !== "done")
    .map((row) => row.id);
}

export function workflowStatusLabel(workflow: Workflow, id: string): string {
  const row = workflow.statuses.find((status) => status.id === id);
  if (row) return row.label;
  if ((STATUS_LABEL as Record<string, string>)[id]) {
    return (STATUS_LABEL as Record<string, string>)[id];
  }
  return id;
}

export function workflowStatusColor(workflow: Workflow, id: string): string {
  const row = workflow.statuses.find((status) => status.id === id);
  if (row) return row.color;
  if ((STATUS_COLOR as Record<string, string>)[id]) {
    return (STATUS_COLOR as Record<string, string>)[id];
  }
  return STATUS_COLOR.backlog;
}
