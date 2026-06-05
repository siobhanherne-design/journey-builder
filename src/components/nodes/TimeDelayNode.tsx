"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { TimeDelayConfig } from "@/lib/types";
import { ConnectorStub } from "./ConnectorStub";

export type TimeDelayNodeData = {
  label: string;
  duration?: string;
  delayConfig?: TimeDelayConfig;
};
export type TimeDelayNodeType = Node<TimeDelayNodeData, "time_delay">;

export function TimeDelayNode({ id, data, selected }: NodeProps<TimeDelayNodeType>) {
  const config = data.delayConfig;

  return (
    <div
      className={`group relative rounded-xl bg-white px-4 py-3 min-w-[220px] transition-all cursor-pointer ${
        selected
          ? "border border-[#7c5cfc] shadow-[0_0_0_2px_rgba(124,92,252,0.15)]"
          : "border border-[#e5e7f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-white !border-[#a5b4fc]" />
      <ConnectorStub nodeId={id} />
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#fef3c7] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="text-[13px] font-semibold text-[#1a1b2e] leading-tight">
          Time delay
        </div>
      </div>

      {config && (
        <div className="mt-2.5 space-y-1.5">
          <div className="flex items-center gap-2 rounded-lg bg-[#f5f6fa] px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[12px] text-[#1a1b2e]">
              {config.mode === "specific_date" && config.specificDate
                ? (() => {
                    const d = new Date(config.specificDate + "T00:00:00");
                    return `${d.getDate()} ${d.toLocaleString("en-GB", { month: "long" })} ${d.getFullYear()}`;
                  })()
                : config.mode === "dynamic" && config.direction === "is" && config.dynamicDate
                  ? (() => {
                      const d = new Date(config.dynamicDate + "T00:00:00");
                      return `Is ${d.getDate()} ${d.toLocaleString("en-GB", { month: "long" })} ${d.getFullYear()}`;
                    })()
                  : config.mode === "dynamic" && config.direction === "is_between" && config.dynamicDate && config.dynamicDateEnd
                    ? (() => {
                        const d1 = new Date(config.dynamicDate + "T00:00:00");
                        const d2 = new Date(config.dynamicDateEnd + "T00:00:00");
                        return `${d1.getDate()} ${d1.toLocaleString("en-GB", { month: "short" })} – ${d2.getDate()} ${d2.toLocaleString("en-GB", { month: "short" })} ${d2.getFullYear()}`;
                      })()
                    : `${config.value} ${config.unit}${config.mode === "dynamic" ? ` ${config.direction}` : ""}`}
            </span>
          </div>

          {config.mode === "dynamic" && config.dateSourceLabel && (
            <div className="flex items-center gap-2 rounded-lg bg-[#f5f6fa] px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-[12px] text-[#1a1b2e]">
                {config.dateSourceLabel}
              </span>
            </div>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!bg-white !border-[#a5b4fc]" />
    </div>
  );
}
