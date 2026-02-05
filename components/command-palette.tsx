"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Command = {
  label: string;
  href: string;
};

export function CommandPalette({ commands }: { commands: Command[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return commands.filter((cmd) => cmd.label.toLowerCase().includes(normalized));
  }, [commands, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6">
      <div className="w-full max-w-lg rounded-3xl border border-ember-700/70 bg-ember-850 p-4 shadow-soft">
        <input
          className="input"
          placeholder="Jump to..."
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="mt-4 space-y-2">
          {filtered.map((command) => (
            <button
              key={command.href}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm text-sand-200 hover:bg-ember-800"
              onClick={() => {
                router.push(command.href);
                setOpen(false);
              }}
            >
              <span>{command.label}</span>
              <span className="text-xs text-sand-400">↵</span>
            </button>
          ))}
          {filtered.length === 0 ? (
            <p className="text-sm text-sand-400">No results.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
