"use client";

import { Handle, Position, type NodeProps, type Node, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useConnector } from "../ConnectorContext";

export interface SplitPath {
  id: string;
  label: string;
  percentage: number;
}

export type SplitNodeData = {
  label: string;
  paths?: SplitPath[];
};
export type SplitNodeType = Node<SplitNodeData, "split">;

const PATH_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function defaultPaths(): SplitPath[] {
  return [
    { id: "a", label: "Path A", percentage: 50 },
    { id: "b", label: "Path B", percentage: 50 },
  ];
}

function SplitConnectorStub({ nodeId, handleId }: { nodeId: string; handleId: string }) {
  const { pendingSourceId, onConnectorClick } = useConnector();
  const isActive = pendingSourceId === `${nodeId}__${handleId}`;

  return (
    <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-full flex items-center transition-opacity duration-150 ${
      isActive ? "opacity-100" : "opacity-0 group-hover/path:opacity-100"
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
          const centerY = nodeRect ? btn.top + btn.height / 2 : btn.top + btn.height / 2;
          onConnectorClick(`${nodeId}__${handleId}`, { x: btn.right + 12, y: centerY });
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

export function SplitNode({ id, data, selected }: NodeProps<SplitNodeType>) {
  const { updateNodeData } = useReactFlow();
  const paths = data.paths || defaultPaths();

  const updatePercentage = useCallback(
    (pathId: string, rawValue: string) => {
      const newVal = Math.max(0, Math.min(100, parseInt(rawValue) || 0));
      const oldPath = paths.find((p) => p.id === pathId);
      if (!oldPath) return;

      const delta = newVal - oldPath.percentage;
      const others = paths.filter((p) => p.id !== pathId);
      const othersTotal = others.reduce((s, p) => s + p.percentage, 0);

      const updated = paths.map((p) => {
        if (p.id === pathId) return { ...p, percentage: newVal };
        if (othersTotal === 0) {
          return { ...p, percentage: Math.round((100 - newVal) / others.length) };
        }
        const share = p.percentage / othersTotal;
        return { ...p, percentage: Math.max(0, Math.round(p.percentage - delta * share)) };
      });

      const total = updated.reduce((s, p) => s + p.percentage, 0);
      if (total !== 100 && others.length > 0) {
        const lastOther = updated.find((p) => p.id !== pathId && p.percentage > 0) || updated.find((p) => p.id !== pathId);
        if (lastOther) lastOther.percentage += 100 - total;
      }

      updateNodeData(id, { paths: updated });
    },
    [id, paths, updateNodeData],
  );

  const addPath = useCallback(() => {
    const nextIndex = paths.length;
    const letter = PATH_LETTERS[nextIndex] || `${nextIndex + 1}`;
    const newPath: SplitPath = {
      id: letter.toLowerCase(),
      label: `Path ${letter}`,
      percentage: 0,
    };
    const allPaths = [...paths, newPath];
    const evenSplit = Math.floor(100 / allPaths.length);
    const remainder = 100 - evenSplit * allPaths.length;
    const balanced = allPaths.map((p, i) => ({
      ...p,
      percentage: evenSplit + (i === 0 ? remainder : 0),
    }));
    updateNodeData(id, { paths: balanced });
  }, [id, paths, updateNodeData]);

  return (
    <div
      className={`group relative rounded-xl bg-white px-4 py-3 min-w-[260px] transition-all cursor-pointer ${
        selected
          ? "border border-[#7c5cfc] shadow-[0_0_0_2px_rgba(124,92,252,0.15)]"
          : "border border-[#e5e7f0] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-white !border-[#a5b4fc]" />

      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3h6v8l4 9H5l4-9V3z" />
            <path d="M7 3h10" />
          </svg>
        </div>
        <div className="text-[13px] font-semibold text-[#1a1b2e] leading-tight">
          A/B Split
        </div>
      </div>

      <div className="space-y-2">
        {paths.map((path, i) => (
          <div key={path.id} className="group/path relative flex items-center gap-2 rounded-lg bg-[#f5f6fa] px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9daf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M2 12h5" />
              <path d="M7 5v14" />
              <path d="m7 5 8 3.5" />
              <path d="m7 19 8-3.5" />
            </svg>
            <span className="text-[12px] text-[#1a1b2e] flex-1">{path.label}</span>
            <input
              type="number"
              min={0}
              max={100}
              value={path.percentage}
              onChange={(e) => updatePercentage(path.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-14 rounded-md bg-white border border-[#e5e7f0] px-2 py-1 text-[12px] text-[#1a1b2e] text-right focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30"
            />
            <span className="text-[12px] text-[#9b9daf]">%</span>

            <Handle
              type="source"
              position={Position.Right}
              id={path.id}
              className="!bg-white !border-[#a5b4fc] !right-0"
              style={{ top: "50%", right: 0, transform: "translateY(-50%)" }}
            />
            <SplitConnectorStub nodeId={id} handleId={path.id} />
          </div>
        ))}
      </div>

      {paths.length < 5 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addPath();
          }}
          className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#9b9daf] hover:text-[#7c5cfc] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add split
        </button>
      )}
    </div>
  );
}
