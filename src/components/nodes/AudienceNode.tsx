"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

export type AudienceNodeData = { label: string };
export type AudienceNodeType = Node<AudienceNodeData, "audience">;

export function AudienceNode({ data, selected }: NodeProps<AudienceNodeType>) {
  return (
    <div
      className={`rounded-[10px] bg-white px-4 py-3 min-w-[170px] transition-all ${
        selected
          ? "border border-[#7c5cfc] shadow-[0_0_0_1px_rgba(124,92,252,0.2)]"
          : "border border-[#e5e7f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-white !border-[#a5b4fc]" />
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <div className="text-[11px] text-[#9b9daf] leading-tight">Audience</div>
          <div className="text-[13px] font-medium text-[#1a1b2e] leading-tight">{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-white !border-[#a5b4fc]" />
    </div>
  );
}
