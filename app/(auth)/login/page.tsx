"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("change-me");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? "Login failed");
      setLoading(false);
      return;
    }
    window.location.href = "/";
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Ninja Ops Console</p>
        <h1 className="text-2xl font-semibold">Sign in to continue</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Use your local credentials to access the command center.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label className="block text-sm font-medium">Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button className="btn btn-primary w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Default seed user: admin@example.com / change-me
      </p>
    </div>
  );
}
