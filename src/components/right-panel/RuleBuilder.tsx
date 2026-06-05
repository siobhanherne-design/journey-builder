"use client";

import { useState, useEffect, useRef } from "react";
import type { Rule, Junction, PanelMode, SavedRuleSummary } from "@/lib/types";
import { createEmptyRule } from "@/lib/types";
import { eventTypes, factGroups, audienceSegments } from "@/lib/mock-data";
import { RuleRow } from "./RuleRow";
import { AndOrToggle } from "./AndOrToggle";
import { AudienceSummary } from "./AudienceSummary";
import { PlusIcon, CloseIcon } from "./icons";

interface RuleBuilderProps {
  mode: PanelMode;
  onClose: () => void;
  onSave: (data: { summaries: SavedRuleSummary[]; rules: Rule[]; junctions: Junction[] }) => void;
  initialRules?: Rule[];
  initialJunctions?: Junction[];
  onDraftChange?: (rules: Rule[], junctions: Junction[]) => void;
}

const modeConfig: Record<PanelMode, { title: string; subtitle: string }> = {
  rule: {
    title: "Entry rule",
    subtitle: "Who and when will profiles enter this journey",
  },
  exit: {
    title: "Exit rule",
    subtitle: "When profiles should exit",
  },
  goal: {
    title: "Goal",
    subtitle: "What makes this journey successful",
  },
};

function getRuleLabel(rule: Rule): string | null {
  if (rule.ruleType === "event") {
    const ev = eventTypes.find((e) => e.id === rule.categoryName);
    return ev?.label || null;
  }
  if (rule.ruleType === "fact") {
    const fact = factGroups.find((g) => g.id === rule.categoryName);
    return fact?.label || null;
  }
  if (rule.ruleType === "audience") {
    const seg = audienceSegments.find((a) => a.id === rule.audienceName);
    return seg?.label || null;
  }
  return null;
}

export function RuleBuilder({ mode, onClose, onSave, initialRules, initialJunctions, onDraftChange }: RuleBuilderProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules?.length ? initialRules : [createEmptyRule()]);
  const [junctions, setJunctions] = useState<Junction[]>(initialJunctions || []);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    onDraftChange?.(rules, junctions);
  }, [rules, junctions, onDraftChange]);

  const config = modeConfig[mode];

  const handleRuleChange = (index: number, updatedRule: Rule) => {
    const updated = [...rules];
    updated[index] = updatedRule;
    setRules(updated);
  };

  const handleAddRule = () => {
    setRules([...rules, createEmptyRule()]);
    setJunctions([...junctions, "AND"]);
  };

  const handleDeleteRule = (index: number) => {
    if (rules.length <= 1) return;
    const newRules = rules.filter((_, i) => i !== index);
    const newJunctions = [...junctions];
    if (index === 0 && newJunctions.length > 0) {
      newJunctions.shift();
    } else if (index > 0) {
      newJunctions.splice(index - 1, 1);
    }
    setRules(newRules);
    setJunctions(newJunctions);
  };

  const handleDuplicateRule = (index: number) => {
    const clone: Rule = {
      ...rules[index],
      id: Date.now() + Math.random(),
      properties: rules[index].properties.map((p) => ({
        ...p,
        id: Date.now() + Math.random(),
      })),
    };
    const newRules = [...rules];
    newRules.splice(index + 1, 0, clone);
    const newJunctions = [...junctions];
    newJunctions.splice(index, 0, "AND");
    setRules(newRules);
    setJunctions(newJunctions);
  };

  const handleJunctionChange = (index: number, value: Junction) => {
    const updated = [...junctions];
    updated[index] = value;
    setJunctions(updated);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-2 border-b border-[#e5e7f0]">
        <div className="flex items-start gap-3">
          {mode === "goal" ? (
            <div className="w-8 h-8 rounded-lg bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
          ) : mode === "exit" ? (
            <div className="w-8 h-8 rounded-lg bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#eff6ff] border border-[#dbeafe] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
          )}
          <div>
            <h2 className="text-[14px] font-bold text-[#1a1b2e]">{config.title}</h2>
            <p className="text-[12px] text-[#9b9daf]">{config.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f5f6fa] text-[#9b9daf] hover:text-[#6c6e82] transition-colors mt-0.5"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Rules list */}
      <div className="flex-1 overflow-y-auto picker-scroll px-5 py-3 space-y-0 bg-[#FBFBFB]">
        {rules.map((rule, index) => (
          <div key={rule.id}>
            {index > 0 && (
              <AndOrToggle
                value={junctions[index - 1] || "AND"}
                onChange={(val) => handleJunctionChange(index - 1, val)}
              />
            )}
            <RuleRow
              rule={rule}
              mode={mode}
              onChange={(updatedRule) => handleRuleChange(index, updatedRule)}
              onDuplicate={() => handleDuplicateRule(index)}
              onDelete={() => handleDeleteRule(index)}
              showDelete={rules.length > 1}
              isFirst={index === 0}
            />
          </div>
        ))}

        {rules.some((r) => r.ruleType != null) && (
          <div className="pt-4">
            <button
              onClick={handleAddRule}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium text-[#1a1b2e] border border-[#e5e7f0] rounded-lg hover:bg-[#f5f6fa] transition-colors bg-white"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Add rule
            </button>
          </div>
        )}

      </div>

      {/* Sticky summary + footer */}
      <div className="flex-shrink-0 border-t border-[#e5e7f0] bg-white">
        <div className="px-5">
          <AudienceSummary rules={rules} junctions={junctions} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#e5e7f0] flex-shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-[12px] font-medium text-[#1a1b2e] border border-[#e5e7f0] rounded-lg hover:bg-[#f5f6fa] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            const summaries: SavedRuleSummary[] = rules
              .filter((r) => r.ruleType)
              .map((r) => ({ ruleType: r.ruleType!, label: getRuleLabel(r) || "" }))
              .filter((s) => s.label);
            onSave({ summaries, rules, junctions });
            onClose();
          }}
          className="px-4 py-1.5 text-[12px] font-medium text-white bg-[#1a1b2e] rounded-lg hover:bg-[#2d2e42] transition-colors"
        >
          Save rule
        </button>
      </div>
    </div>
  );
}
