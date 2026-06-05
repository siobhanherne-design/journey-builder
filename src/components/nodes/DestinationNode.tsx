"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { DestinationConfig } from "@/lib/types";
import { destinationPlatforms, destinationAccounts } from "@/lib/mock-data";
import { ConnectorStub } from "./ConnectorStub";

export type DestinationNodeData = {
  label: string;
  channel?: string;
  destinationConfig?: DestinationConfig;
};
export type DestinationNodeType = Node<DestinationNodeData, "destination">;

function PlatformIcon({ platformId }: { platformId: string }) {
  const platform = destinationPlatforms.find((p) => p.id === platformId);
  if (!platform) return null;

  return (
    <div
      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: platform.color }}
    >
      <span className="text-[7px] font-bold text-white leading-none">
        {platform.label.charAt(0)}
      </span>
    </div>
  );
}

export function DestinationNode({ id, data, selected }: NodeProps<DestinationNodeType>) {
  const config = data.destinationConfig;
  const hasConnectors =
    config && config.connectors.some((c) => c.platformId);

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
        <div className="w-8 h-8 rounded-lg bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="text-[13px] font-semibold text-[#1a1b2e] leading-tight">
          {hasConnectors ? "Destination" : data.label}
        </div>
      </div>

      {hasConnectors && (
        <div className="mt-2.5 space-y-1.5">
          {config!.connectors
            .filter((c) => c.platformId)
            .map((c, i) => {
              const platform = destinationPlatforms.find(
                (p) => p.id === c.platformId,
              );
              const accounts = destinationAccounts[c.platformId] || [];
              const account = accounts.find((a) => a.id === c.accountId);
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-[#f5f6fa] px-3 py-2"
                >
                  <PlatformIcon platformId={c.platformId} />
                  <span className="text-[12px] text-[#1a1b2e] truncate">
                    {platform?.label}
                    {account ? ` · ${account.label}` : ""}
                  </span>
                </div>
              );
            })}
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-white !border-[#a5b4fc]" />
    </div>
  );
}
