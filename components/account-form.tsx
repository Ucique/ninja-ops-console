"use client";

import { useState } from "react";

export function AccountForm() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleUpdate() {
    const response = await fetch("/api/auth/login", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setStatus(response.ok ? "Password updated" : "Update failed");
  }

  return (
    <div className="card space-y-4">
      <p className="kicker">Account</p>
      <p className="text-sm text-sand-400">Change your password after first login.</p>
      <input
        className="input"
        type="password"
        placeholder="New password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button className="btn btn-primary" type="button" onClick={handleUpdate}>
        Update password
      </button>
      {status ? <p className="text-xs text-sand-400">{status}</p> : null}
    </div>
  );
}
