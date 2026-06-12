"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { SavedRuleSummary } from "@/lib/types";
import { ConnectorStub } from "./ConnectorStub";

export type EntryRuleNodeData = {
  label: string;
  stepLabel?: string;
  savedRules?: SavedRuleSummary[];
  estimatedProfiles?: number;
};
export type EntryRuleNodeType = Node<EntryRuleNodeData, "entry_rule">;

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

export function EntryRuleNode({ id, data, selected }: NodeProps<EntryRuleNodeType>) {
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
        <div className="w-8 h-8 rounded-lg bg-[#eff6ff] border border-[#dbeafe] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </div>
        <div className="text-[13px] font-semibold text-[#1a1b2e] leading-tight">
          {hasSavedRules ? "Entry rule" : data.label}
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
