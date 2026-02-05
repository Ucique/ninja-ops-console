"use client";

import { useState } from "react";

type Settings = {
  workingHours: string;
  timezone: string;
  priorityRules: string;
  urgentDefinition: string;
  openclawPaths: string;
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSave() {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(response.ok ? "Saved" : "Save failed");
  }

  return (
    <div className="card space-y-4">
      <div>
        <p className="kicker">Preferences</p>
        <p className="text-sm text-slate-500">Tune your working hours and urgency rules.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="input" value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} />
        <input className="input" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
        <input className="input" value={form.priorityRules} onChange={(e) => setForm({ ...form, priorityRules: e.target.value })} />
        <input className="input" value={form.urgentDefinition} onChange={(e) => setForm({ ...form, urgentDefinition: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">OpenClaw artifact paths</label>
        <textarea
          className="input mt-2 h-24"
          value={form.openclawPaths}
          onChange={(e) => setForm({ ...form, openclawPaths: e.target.value })}
        />
      </div>
      <button className="btn btn-primary" type="button" onClick={handleSave}>
        Save settings
      </button>
      {status ? <p className="text-xs text-slate-500">{status}</p> : null}
    </div>
  );
}
