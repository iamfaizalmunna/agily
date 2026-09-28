"use client";

import { useMemo, useState } from "react";
import { mentionSuggestions, type MentionMember } from "@/lib/activity/mentions";

export function MentionTextarea({
  name,
  rows = 3,
  placeholder,
  members,
  required,
}: {
  name: string;
  rows?: number;
  placeholder: string;
  members: MentionMember[];
  required?: boolean;
}) {
  const [value, setValue] = useState("");
  const [query, setQuery] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (query === null) return [];
    return mentionSuggestions(members, query);
  }, [members, query]);

  const onChange = (next: string) => {
    setValue(next);
    const at = next.lastIndexOf("@");
    if (at < 0) {
      setQuery(null);
      return;
    }
    const tail = next.slice(at + 1);
    if (tail.includes(" ") || tail.includes("\n")) {
      setQuery(null);
      return;
    }
    setQuery(tail);
  };

  const pick = (member: MentionMember) => {
    const at = value.lastIndexOf("@");
    const prefix = at >= 0 ? value.slice(0, at) : value;
    const handle = member.name.replace(/\s+/g, "");
    setValue(`${prefix}@${handle} `);
    setQuery(null);
  };

  return (
    <div className="relative flex flex-col gap-2">
      <textarea
        name={name}
        rows={rows}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-paper/10 bg-paper/[0.04] px-4 py-3 text-base text-paper outline-none placeholder:text-paper/35 focus:border-copper/70"
      />
      {suggestions.length ? (
        <ul
          className="absolute bottom-full left-0 z-20 mb-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg"
          role="listbox"
        >
          {suggestions.map((member) => (
            <li key={member.id}>
              <button
                type="button"
                className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => pick(member)}
              >
                <span className="font-medium">{member.name}</span>
                <span className="text-xs text-muted-foreground">{member.email}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
