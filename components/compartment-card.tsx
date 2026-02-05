"use client";

import Link from "next/link";
import type { CabinetCompartment } from "./cabinet-dashboard";

export function CompartmentCard({
  item,
  lens,
  isPinned,
  isCollapsed,
  usageCount,
  onTogglePin,
  onToggleCollapse,
  onUsage,
  onDragStart,
  onDrop,
}: {
  item: CabinetCompartment;
  lens: "calm" | "urgency" | "leverage";
  isPinned: boolean;
  isCollapsed: boolean;
  usageCount: number;
  onTogglePin: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onUsage: (id: string) => void;
  onDragStart: (id: string) => void;
  onDrop: (id: string) => void;
}) {
  const score = lens === "urgency" ? item.urgencyScore : item.leverageScore;
  const highlight =
    lens === "calm"
      ? ""
      : score >= 4
      ? "ring-2 ring-accent/60"
      : score >= 2
      ? "ring-1 ring-ember-600"
      : "";
  const usageLift = usageCount >= 4 ? "shadow-lift" : usageCount >= 2 ? "shadow-soft" : "";

  return (
    <div
      className={`group rounded-3xl border border-ember-700/70 bg-ember-850/80 p-6 ${highlight} ${usageLift} ${item.tone} hover-lift`}
      draggable
      onDragStart={() => onDragStart(item.id)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDrop(item.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="kicker">{item.title}</p>
          <h3 className="text-lg font-semibold text-sand-100">{item.description}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="pill" onClick={() => onTogglePin(item.id)} type="button" aria-pressed={isPinned}>
            {isPinned ? "Pinned" : "Pin"}
          </button>
          <button
            className="pill"
            onClick={() => onToggleCollapse(item.id)}
            type="button"
            aria-pressed={isCollapsed}
          >
            {isCollapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </div>
      {!isCollapsed ? (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {item.stats?.map((stat) => (
              <span key={stat} className="pill">
                {stat}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            {item.items.map((preview) => (
              <div key={preview.title} className="rounded-2xl border border-ember-700/60 bg-ember-900/40 p-3">
                <p className="text-sm font-medium text-sand-100">{preview.title}</p>
                {preview.meta ? <p className="text-xs text-sand-400">{preview.meta}</p> : null}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-sand-400">Collapsed. Expand to preview.</p>
      )}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2 text-xs text-sand-400">
          <span>Urgency {item.urgencyScore}/5</span>
          <span>Leverage {item.leverageScore}/5</span>
        </div>
        <Link href={item.href} className="btn" onClick={() => onUsage(item.id)}>
          {item.primaryAction}
        </Link>
      </div>
    </div>
  );
}
