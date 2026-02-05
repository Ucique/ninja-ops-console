"use client";

import { useState } from "react";

export function ArtifactImporter() {
  const [path, setPath] = useState("");
  const [content, setContent] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleImport() {
    setStatus(null);
    const response = await fetch("/api/artifacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    if (!response.ok) {
      setStatus("Unable to read file. Use manual paste.");
      return;
    }
    const payload = await response.json();
    setContent(payload.content);
  }

  return (
    <div className="card space-y-4">
      <div>
        <p className="kicker">Artifacts</p>
        <p className="text-sm text-slate-500">
          Import OpenClaw outputs by pasting a local path or manual content.
        </p>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          className="input"
          placeholder="/path/to/artifact.md"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
        <button className="btn" type="button" onClick={handleImport}>
          Import file
        </button>
      </div>
      {status ? <p className="text-xs text-amber-500">{status}</p> : null}
      <textarea
        className="input h-40"
        placeholder="Paste artifact content manually..."
        value={content ?? ""}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}
