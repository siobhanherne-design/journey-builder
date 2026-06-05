"use client";

import type { DragEvent, ReactNode } from "react";

export interface StepMenuItem {
  type: string;
  label: string;
  color: string;
  icon: ReactNode;
}

export const stepMenuItems: StepMenuItem[] = [
  {
    type: "entry_rule",
    label: "Entry rule",
    color: "#3b82f6",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    ),
  },
  {
    type: "time_delay",
    label: "Delay",
    color: "#d97706",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    type: "experiment",
    label: "A/B Split",
    color: "#d97706",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v8l4 9H5l4-9V3z" />
        <path d="M7 3h10" />
      </svg>
    ),
  },
  {
    type: "goal",
    label: "Goal",
    color: "#22c55e",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    type: "destination",
    label: "Destination",
    color: "#22c55e",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

function onDragStart(event: DragEvent, nodeType: string) {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
}

export function StepMenu({
  items,
  onStepClick,
  draggable,
}: {
  items: StepMenuItem[];
  onStepClick?: (stepType: string) => void;
  draggable?: boolean;
}) {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.label}
          onClick={() => onStepClick?.(item.type)}
          draggable={draggable}
          onDragStart={draggable ? (e) => onDragStart(e, item.type) : undefined}
          className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-[#f5f6fa] transition-colors text-left cursor-pointer ${
            draggable ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${item.color}15`, color: item.color }}
          >
            {item.icon}
          </div>
          <span className="text-[13px] font-medium text-[#1a1b2e]">{item.label}</span>
        </div>
      ))}
    </>
  );
}

export function StepPalette({ onStepClick }: { onStepClick?: (stepType: string) => void }) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-xl border border-[#e5e7f0] shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-1.5 px-1">
      <StepMenu items={stepMenuItems} onStepClick={onStepClick} draggable />
    </div>
  );
}
