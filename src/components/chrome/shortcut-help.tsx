"use client";

const ROWS = [
  { keys: "⌘K / Ctrl+K", action: "Command palette — search & jump" },
  { keys: "?", action: "Show this sheet" },
  { keys: "Esc", action: "Close Lens, help, or focus" },
  { keys: "/", action: "Open Lens" },
  { keys: "g then p", action: "Go to Pulse" },
  { keys: "g then e", action: "Go to People" },
  { keys: "g then h", action: "Your studios" },
  { keys: "1–5", action: "Summary / List / Board / Calendar / Timeline" },
];

export function ShortcutHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-label="Close shortcuts"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcut-title"
        className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-lg"
        data-testid="shortcut-help"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="shortcut-title" className="text-xl font-semibold text-foreground">
            Keyboard
          </h2>
          <button
            type="button"
            className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <ul className="flex flex-col gap-3">
          {ROWS.map((row) => (
            <li
              key={row.keys}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="font-mono text-primary">{row.keys}</span>
              <span className="text-muted-foreground">{row.action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
