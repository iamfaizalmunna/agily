import { startOfUtcDay } from "@/lib/views/views";

export type TimelineRow = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  dueOn: Date | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function timelineSpan(items: TimelineRow[], now = new Date()) {
  const today = startOfUtcDay(now).getTime();
  let start = today;
  let end = today + 14 * DAY_MS;

  for (const item of items) {
    const barStart = startOfUtcDay(item.createdAt).getTime();
    const barEnd = item.dueOn
      ? startOfUtcDay(item.dueOn).getTime() + DAY_MS
      : barStart + 3 * DAY_MS;
    start = Math.min(start, barStart);
    end = Math.max(end, barEnd);
  }

  if (end <= start) end = start + 7 * DAY_MS;
  return { start, end, span: end - start };
}

export function timelineBar(
  item: TimelineRow,
  start: number,
  span: number,
) {
  const barStart = startOfUtcDay(item.createdAt).getTime();
  const barEnd = item.dueOn
    ? startOfUtcDay(item.dueOn).getTime() + DAY_MS
    : barStart + 3 * DAY_MS;
  const left = ((barStart - start) / span) * 100;
  const width = Math.max(4, ((barEnd - barStart) / span) * 100);
  return {
    left: Math.max(0, Math.min(100, left)),
    width: Math.max(4, Math.min(100 - left, width)),
  };
}

export function timelineWeekLabels(start: number, span: number, count = 4) {
  const labels: { label: string; left: number }[] = [];
  const step = span / count;
  for (let i = 0; i <= count; i += 1) {
    const at = start + step * i;
    const date = new Date(at);
    labels.push({
      label: date.toISOString().slice(5, 10).replace("-", "/"),
      left: (i / count) * 100,
    });
  }
  return labels;
}

export function todayMarker(now: Date, start: number, span: number) {
  const today = startOfUtcDay(now).getTime() + DAY_MS / 2;
  if (today < start || today > start + span) return null;
  return ((today - start) / span) * 100;
}
