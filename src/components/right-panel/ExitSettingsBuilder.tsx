"use client";

import { useState } from "react";
import type { Rule, Junction } from "@/lib/types";
import { createEmptyRule } from "@/lib/types";
import { RuleRow } from "./RuleRow";
import { AndOrToggle } from "./AndOrToggle";
import { CloseIcon, PlusIcon, ChevronDownIcon } from "./icons";

interface ExitSettingsBuilderProps {
  onClose: () => void;
}

function InlineRuleBuilder({
  mode,
  rules,
  junctions,
  onRulesChange,
  onJunctionsChange,
}: {
  mode: "goal" | "exit";
  rules: Rule[];
  junctions: Junction[];
  onRulesChange: (rules: Rule[]) => void;
  onJunctionsChange: (junctions: Junction[]) => void;
}) {
  const hasRules = rules.some((r) => r.ruleType !== null);

  const handleRuleChange = (index: number, updatedRule: Rule) => {
    const updated = [...rules];
    updated[index] = updatedRule;
    onRulesChange(updated);
  };

  const handleAddRule = () => {
    onRulesChange([...rules, createEmptyRule()]);
    onJunctionsChange([...junctions, "AND"]);
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
    onRulesChange(newRules);
    onJunctionsChange(newJunctions);
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
    onRulesChange(newRules);
    onJunctionsChange(newJunctions);
  };

  const handleJunctionChange = (index: number, value: Junction) => {
    const updated = [...junctions];
    updated[index] = value;
    onJunctionsChange(updated);
  };

  return (
    <div className="space-y-0 pt-4">
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

      {hasRules && (
        <div className="pt-3">
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
  );
}

export function ExitSettingsBuilder({ onClose }: ExitSettingsBuilderProps) {
  const [goalRules, setGoalRules] = useState<Rule[]>([createEmptyRule()]);
  const [goalJunctions, setGoalJunctions] = useState<Junction[]>([]);
  const [goalOpen, setGoalOpen] = useState(false);
  const [exitRules, setExitRules] = useState<Rule[]>([createEmptyRule()]);
  const [exitJunctions, setExitJunctions] = useState<Junction[]>([]);
  const [exitOpen, setExitOpen] = useState(false);
  const [durationValue, setDurationValue] = useState<number>(30);
  const [durationUnit, setDurationUnit] = useState<string>("days");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-2 border-b border-[#e5e7f0]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#f5f6fa] border border-[#e5e7f0] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1b2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-[#1a1b2e]">Exit settings</h2>
            <p className="text-[12px] text-[#9b9daf]">How and when are profiles removed from the journey.</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f5f6fa] text-[#9b9daf] hover:text-[#6c6e82] transition-colors mt-0.5"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto picker-scroll px-5 py-4 space-y-3 bg-[#FBFBFB]">
        {/* Exit rules row */}
        <div className="rounded-xl border border-[#e5e7f0] bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#ef444415", color: "#ef4444" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-[#1a1b2e]">Exit rules</h3>
                <span className="px-1.5 py-0.5 text-[10px] font-medium text-[#9b9daf] bg-[#f5f6fa] border border-[#e5e7f0] rounded leading-none">Optional</span>
              </div>
              <p className="text-[11px] text-[#9b9daf]">Remove profiles when conditions occur</p>
            </div>
            {!exitOpen && (
              <button
                onClick={() => setExitOpen(true)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#6c6e82] border border-[#e5e7f0] rounded-lg hover:bg-[#f5f6fa] transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add exit rule
              </button>
            )}
          </div>
          {exitOpen && (
            <InlineRuleBuilder
              mode="exit"
              rules={exitRules}
              junctions={exitJunctions}
              onRulesChange={setExitRules}
              onJunctionsChange={setExitJunctions}
            />
          )}
        </div>

        {/* Goals row */}
        <div className="rounded-xl border border-[#e5e7f0] bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#22c55e15", color: "#22c55e" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-[#1a1b2e]">Goals</h3>
                <span className="px-1.5 py-0.5 text-[10px] font-medium text-[#9b9daf] bg-[#f5f6fa] border border-[#e5e7f0] rounded leading-none">Optional</span>
              </div>
              <p className="text-[11px] text-[#9b9daf]">Track what success looks like</p>
            </div>
            {!goalOpen && (
              <button
                onClick={() => setGoalOpen(true)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#6c6e82] border border-[#e5e7f0] rounded-lg hover:bg-[#f5f6fa] transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add goal
              </button>
            )}
          </div>
          {goalOpen && (
            <InlineRuleBuilder
              mode="goal"
              rules={goalRules}
              junctions={goalJunctions}
              onRulesChange={setGoalRules}
              onJunctionsChange={setGoalJunctions}
            />
          )}
        </div>

        {/* Expiration row */}
        <div className="rounded-xl border border-[#e5e7f0] bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#6c6e8215", color: "#6c6e82" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-semibold text-[#1a1b2e]">Expiration</h3>
              <p className="text-[11px] text-[#9b9daf]">Max time a profile remains in this journey</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <input
                type="number"
                min={1}
                value={durationValue}
                onChange={(e) => setDurationValue(parseInt(e.target.value) || 1)}
                className="w-14 rounded-md bg-[#fbfbfb] border border-[#e5e7f0] px-2 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 text-center"
              />
              <div className="relative">
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                  className="appearance-none rounded-md bg-[#fbfbfb] border border-[#e5e7f0] pl-2.5 pr-6 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 cursor-pointer"
                >
                  <option value="days">days</option>
                  <option value="weeks">weeks</option>
                </select>
                <ChevronDownIcon className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-[#9b9daf] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#e5e7f0] flex-shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-[12px] font-medium text-[#1a1b2e] border border-[#e5e7f0] rounded-lg hover:bg-[#f5f6fa] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-[12px] font-medium text-white bg-[#1a1b2e] rounded-lg hover:bg-[#2d2e42] transition-colors"
        >
          Save settings
        </button>
      </div>
    </div>
  );
}
