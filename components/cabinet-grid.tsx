"use client";

import type { CabinetCompartment } from "./cabinet-dashboard";
import { CompartmentCard } from "./compartment-card";

export function CabinetGrid({
  compartments,
  lens,
  pinned,
  collapsed,
  usage,
  onTogglePin,
  onToggleCollapse,
  onUsage,
  onDragStart,
  onDrop,
}: {
  compartments: CabinetCompartment[];
  lens: "calm" | "urgency" | "leverage";
  pinned: string[];
  collapsed: string[];
  usage: Record<string, number>;
  onTogglePin: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onUsage: (id: string) => void;
  onDragStart: (id: string) => void;
  onDrop: (id: string) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
      {compartments.map((item) => (
        <CompartmentCard
          key={item.id}
          item={item}
          lens={lens}
          isPinned={pinned.includes(item.id)}
          isCollapsed={collapsed.includes(item.id)}
          usageCount={usage[item.id] ?? 0}
          onTogglePin={onTogglePin}
          onToggleCollapse={onToggleCollapse}
          onUsage={onUsage}
          onDragStart={onDragStart}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}
