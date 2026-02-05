"use client";

import { useEffect, useMemo, useState } from "react";
import { CabinetGrid } from "./cabinet-grid";

type PreviewItem = {
  title: string;
  meta?: string;
};

export type CabinetCompartment = {
  id: string;
  title: string;
  href: string;
  description: string;
  tone: string;
  primaryAction: string;
  urgencyScore: number;
  leverageScore: number;
  items: PreviewItem[];
  stats?: string[];
};

export type BudgetSummary = {
  weekSpend: string;
  monthSpend: string;
  weekLimit: string;
  monthLimit: string;
  weekPercent: number;
  monthPercent: number;
  state: "calm" | "warning" | "urgent";
};

const LENS_LABELS = {
  calm: "Calm Lens",
  urgency: "Urgency Lens",
  leverage: "Leverage Lens",
};

export function CabinetDashboard({
  compartments,
  budgetSummary,
}: {
  compartments: CabinetCompartment[];
  budgetSummary: BudgetSummary | null;
}) {
  const [lens, setLens] = useState<"calm" | "urgency" | "leverage">("calm");
  const [order, setOrder] = useState<string[]>(compartments.map((item) => item.id));
  const [pinned, setPinned] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    const storedOrder = window.localStorage.getItem("cabinet-order");
    const storedPinned = window.localStorage.getItem("cabinet-pinned");
    const storedCollapsed = window.localStorage.getItem("cabinet-collapsed");
    const storedUsage = window.localStorage.getItem("cabinet-usage");
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
    if (storedPinned) {
      setPinned(JSON.parse(storedPinned));
    }
    if (storedCollapsed) {
      setCollapsed(JSON.parse(storedCollapsed));
    }
    if (storedUsage) {
      setUsage(JSON.parse(storedUsage));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("cabinet-order", JSON.stringify(order));
  }, [order]);

  useEffect(() => {
    window.localStorage.setItem("cabinet-pinned", JSON.stringify(pinned));
  }, [pinned]);

  useEffect(() => {
    window.localStorage.setItem("cabinet-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    window.localStorage.setItem("cabinet-usage", JSON.stringify(usage));
  }, [usage]);

  const orderedCompartments = useMemo(() => {
    const map = new Map(compartments.map((item) => [item.id, item]));
    const ordered = order.map((id) => map.get(id)).filter(Boolean) as CabinetCompartment[];
    const remaining = compartments.filter((item) => !order.includes(item.id));
    const all = [...ordered, ...remaining];
    const pinnedSet = new Set(pinned);
    return [
      ...all.filter((item) => pinnedSet.has(item.id)),
      ...all.filter((item) => !pinnedSet.has(item.id)),
    ];
  }, [compartments, order, pinned]);

  function togglePinned(id: string) {
    setPinned((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function toggleCollapsed(id: string) {
    setCollapsed((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function handleUsage(id: string) {
    setUsage((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    setOrder((prev) => {
      const next = prev.length ? [...prev] : compartments.map((item) => item.id);
      const fromIndex = next.indexOf(draggedId);
      const toIndex = next.indexOf(targetId);
      if (fromIndex === -1 || toIndex === -1) return next;
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, draggedId);
      return next;
    });
    setDraggedId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker">Cabinet</p>
          <h2 className="text-2xl font-semibold text-sand-100">Your creative operations cabinet</h2>
          <p className="text-sm text-sand-400">
            Orient fast. Act deliberately. Let the cabinet hold the chaos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 rounded-full border border-ember-700 bg-ember-850 px-2 py-1">
          {(["calm", "urgency", "leverage"] as const).map((mode) => (
            <button
              key={mode}
              className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                lens === mode ? "bg-accent text-ember-950" : "text-sand-300 hover:bg-ember-800"
              }`}
              onClick={() => setLens(mode)}
              type="button"
            >
              {LENS_LABELS[mode]}
            </button>
          ))}
        </div>
      </div>

      {budgetSummary ? (
        <div className="panel flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="kicker">Budget pulse</p>
            <p className="text-lg font-semibold text-sand-100">This week + month</p>
            <p className="text-sm text-sand-400">
              Keep spend calm to protect leverage and creative bandwidth.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sand-400">This week</p>
              <p className="text-xl font-semibold text-sand-100">
                {budgetSummary.weekSpend} <span className="text-sm text-sand-400">/ {budgetSummary.weekLimit}</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sand-400">This month</p>
              <p className="text-xl font-semibold text-sand-100">
                {budgetSummary.monthSpend} <span className="text-sm text-sand-400">/ {budgetSummary.monthLimit}</span>
              </p>
            </div>
            <div className="flex items-center">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  budgetSummary.state === "urgent"
                    ? "bg-wine text-sand-100"
                    : budgetSummary.state === "warning"
                    ? "bg-brass text-ember-950"
                    : "bg-petrol text-sand-100"
                }`}
              >
                {budgetSummary.state === "urgent"
                  ? "Spend locked"
                  : budgetSummary.state === "warning"
                  ? "Spend cautious"
                  : "Spend calm"}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <CabinetGrid
        compartments={orderedCompartments}
        lens={lens}
        pinned={pinned}
        collapsed={collapsed}
        usage={usage}
        onTogglePin={togglePinned}
        onToggleCollapse={toggleCollapsed}
        onUsage={handleUsage}
        onDragStart={setDraggedId}
        onDrop={handleDrop}
      />
    </div>
  );
}
