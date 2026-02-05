"use client";

import { useEffect, useMemo, useState } from "react";

type VaultItem = {
  id: string;
  name: string;
  category: string;
  tags: string;
  encrypted: string;
  iv: string;
  salt: string;
  metadata: string | null;
};

function bufferToBase64(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string) {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;
}

async function deriveKey(password: string, salt: Uint8Array) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptSecret(password: string, plaintext: string) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
  return {
    encrypted: bufferToBase64(encrypted),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
  };
}

async function decryptSecret(password: string, item: VaultItem) {
  const key = await deriveKey(password, new Uint8Array(base64ToBuffer(item.salt)));
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(base64ToBuffer(item.iv)) },
    key,
    base64ToBuffer(item.encrypted)
  );
  return new TextDecoder().decode(decrypted);
}

export function VaultManager({ initialItems }: { initialItems: VaultItem[] }) {
  const [unlocked, setUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [items, setItems] = useState<VaultItem[]>(initialItems);
  const [newEntry, setNewEntry] = useState({ name: "", category: "", tags: "", secret: "" });
  const [decrypted, setDecrypted] = useState<Record<string, string>>({});
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!unlocked) return;
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      setUnlocked(false);
      setMasterPassword("");
      setDecrypted({});
    }, 10 * 60 * 1000);
    setTimer(newTimer);
    return () => clearTimeout(newTimer);
  }, [unlocked]);

  const sortedItems = useMemo(() => items.slice().sort((a, b) => a.name.localeCompare(b.name)), [items]);

  async function handleUnlock(event: React.FormEvent) {
    event.preventDefault();
    if (!masterPassword) return;
    setUnlocked(true);
  }

  async function handleAdd() {
    if (!unlocked) return;
    const encrypted = await encryptSecret(masterPassword, newEntry.secret);
    const response = await fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newEntry.name,
        category: newEntry.category,
        tags: newEntry.tags,
        metadata: "Vault entry",
        ...encrypted,
      }),
    });
    if (response.ok) {
      const payload = await response.json();
      setItems((prev) => [payload.item, ...prev]);
      setNewEntry({ name: "", category: "", tags: "", secret: "" });
    }
  }

  async function handleReveal(item: VaultItem) {
    if (!unlocked) return;
    const secret = await decryptSecret(masterPassword, item);
    setDecrypted((prev) => ({ ...prev, [item.id]: secret }));
    setTimeout(() => {
      setDecrypted((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }, 15000);
  }

  async function handleExport() {
    const response = await fetch("/api/vault/export");
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vault-export.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await fetch("/api/vault/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: text,
    });
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="card space-y-3">
        <p className="kicker">Vault unlock</p>
        <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleUnlock}>
          <input
            className="input"
            type="password"
            placeholder="Vault master password"
            value={masterPassword}
            onChange={(event) => setMasterPassword(event.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            {unlocked ? "Vault unlocked" : "Unlock"}
          </button>
        </form>
        <p className="text-xs text-sand-400">Vault auto-locks after 10 minutes of inactivity.</p>
      </div>
      <div className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="kicker">Add entry</p>
            <p className="text-sm text-sand-400">Encrypt before saving to SQLite.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn" type="button" onClick={handleExport}>
              Export encrypted
            </button>
            <label className="btn cursor-pointer">
              Import
              <input className="hidden" type="file" accept="application/json" onChange={handleImport} />
            </label>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Name" value={newEntry.name} onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })} />
          <input className="input" placeholder="Category" value={newEntry.category} onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })} />
          <input className="input" placeholder="Tags" value={newEntry.tags} onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })} />
          <input className="input" placeholder="Secret" value={newEntry.secret} onChange={(e) => setNewEntry({ ...newEntry, secret: e.target.value })} />
        </div>
        <button className="btn btn-primary" type="button" onClick={handleAdd}>
          Save encrypted entry
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sortedItems.map((item) => (
          <div key={item.id} className="card space-y-3">
            <div>
              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-xs text-sand-400">{item.category} · {item.tags}</p>
            </div>
            <button className="btn" type="button" onClick={() => handleReveal(item)}>
              Reveal for 15s
            </button>
            {decrypted[item.id] ? (
              <div className="rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">
                {decrypted[item.id]}
              </div>
            ) : null}
          </div>
        ))}
        {sortedItems.length === 0 ? (
          <div className="card">
            <p className="text-sm text-sand-400">No vault entries yet.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
