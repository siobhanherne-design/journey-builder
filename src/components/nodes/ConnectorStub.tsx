"use client";

import { useConnector } from "../ConnectorContext";

export function ConnectorStub({ nodeId }: { nodeId: string }) {
  const { pendingSourceId, onConnectorClick } = useConnector();
  const isActive = pendingSourceId === nodeId;

  return (
    <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-full flex items-center transition-opacity duration-150 ${
      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
    }`}>
      <svg width="24" height="2" className="flex-shrink-0">
        <line x1="0" y1="1" x2="24" y2="1" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="4 5" />
      </svg>
      <button
        onClick={(e) => {
          e.stopPropagation();
          const btn = e.currentTarget.getBoundingClientRect();
          const nodeEl = e.currentTarget.closest('[data-id]') as HTMLElement | null;
          const nodeRect = nodeEl?.getBoundingClientRect();
          const centerY = nodeRect ? nodeRect.top + nodeRect.height / 2 : btn.top + btn.height / 2;
          onConnectorClick(nodeId, { x: btn.right + 12, y: centerY });
        }}
        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
          isActive
            ? "border-[#7c5cfc] bg-[#7c5cfc] shadow-[0_0_0_3px_rgba(124,92,252,0.15)]"
            : "border-[#e5e7f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:border-[#a5b4fc] hover:shadow-[0_1px_4px_rgba(124,92,252,0.15)]"
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive ? "white" : "#1a1b2e"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
