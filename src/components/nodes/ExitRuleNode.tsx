"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { SavedRuleSummary } from "@/lib/types";
import { ConnectorStub } from "./ConnectorStub";

export type ExitRuleNodeData = {
  label: string;
  savedRules?: SavedRuleSummary[];
  estimatedProfiles?: number;
};
export type ExitRuleNodeType = Node<ExitRuleNodeData, "exit_rule">;

function RuleTypeIcon({ ruleType }: { ruleType: string }) {
  if (ruleType === "event") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9daf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />
      </svg>
    );
  }
  if (ruleType === "fact") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9daf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9daf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function ExitRuleNode({ id, data, selected }: NodeProps<ExitRuleNodeType>) {
  const hasSavedRules = data.savedRules && data.savedRules.length > 0;

  return (
    <div
      className={`group relative rounded-xl bg-white px-4 py-3 min-w-[220px] transition-all cursor-pointer ${
        selected
          ? "border border-[#7c5cfc] shadow-[0_0_0_2px_rgba(124,92,252,0.15)]"
          : "border border-[#e5e7f0] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-white !border-[#a5b4fc]" />
      <ConnectorStub nodeId={id} />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#fef2f2] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>
        <div className="text-[13px] font-semibold text-[#1a1b2e] leading-tight">
          {hasSavedRules ? "Exit rule" : data.label}
        </div>
      </div>

      {hasSavedRules && (
        <>
          <div className="mt-2.5 space-y-1.5">
            {data.savedRules!.map((rule, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg bg-[#f5f6fa] px-3 py-2"
              >
                <RuleTypeIcon ruleType={rule.ruleType} />
                <span className="text-[12px] text-[#1a1b2e]">{rule.label}</span>
              </div>
            ))}
          </div>
          {data.estimatedProfiles != null && (
            <div className="mt-2.5 text-[13px] font-semibold text-[#1a1b2e]">
              ~ {data.estimatedProfiles.toLocaleString()}
            </div>
          )}
        </>
      )}
      <Handle type="source" position={Position.Right} className="!bg-white !border-[#a5b4fc]" />
    </div>
  );
}
