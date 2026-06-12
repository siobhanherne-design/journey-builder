"use client";

import { useState } from "react";
import type { Rule, RuleProperty, PanelMode } from "@/lib/types";
import type { PropertyDef } from "@/lib/types";
import {
  eventTypes,
  factGroups,
  audienceSegments,
  operators,
  timeUnits,
} from "@/lib/mock-data";
import { CategoryPicker } from "./CategoryPicker";
import { CopyIcon, TrashIcon, PlusIcon, ChevronDownIcon } from "./icons";

function RuleTypeIcon({ type }: { type: string | null }) {
  if (type === "event") {
    return (
      <span className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center bg-[#fff3e0]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />
        </svg>
      </span>
    );
  }
  if (type === "fact") {
    return (
      <span className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center bg-[#fce7f3]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      </span>
    );
  }
  if (type === "audience") {
    return (
      <span className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center bg-[#ede9fe]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c5cfc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </span>
    );
  }
  return null;
}

interface RuleRowProps {
  rule: Rule;
  mode: PanelMode;
  onChange: (updatedRule: Rule) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  showDelete: boolean;
  isFirst?: boolean;
}

function SelectDropdown({
  value,
  onChange,
  options,
  placeholder,
  className: extraClass,
}: {
  value: string | null;
  onChange: (val: string) => void;
  options: { id: string; label: string }[];
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={`relative ${extraClass || ""}`}>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-md pl-3 pr-7 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 transition-all cursor-pointer ${
          value ? "bg-[#fbfbfb] border border-[#e5e7f0]" : "bg-white border border-[#e5e7f0]"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b9daf] pointer-events-none" />
    </div>
  );
}

function getPropertyDefs(ruleType: string | null, categoryName: string | null): PropertyDef[] {
  if (ruleType === "event") return eventTypes.find((e) => e.id === categoryName)?.properties || [];
  if (ruleType === "fact") return factGroups.find((g) => g.id === categoryName)?.properties || [];
  return [];
}

function InlinePropertyFields({
  property,
  propertyDefs,
  onUpdate,
}: {
  property: RuleProperty;
  propertyDefs: PropertyDef[];
  onUpdate: (updates: Partial<RuleProperty>) => void;
}) {
  const propertyOptions = propertyDefs.map((p) => ({ id: p.name, label: p.name }));

  const selectedPropDef = property.propertyName
    ? propertyDefs.find((p) => p.name === property.propertyName)
    : null;

  const isDate = selectedPropDef?.type === "date";
  const dateOps = selectedPropDef?.operators || [];
  const dateUnits = selectedPropDef?.units || [];
  const selectedDateOp = isDate && property.operator
    ? dateOps.find((o) => o.label === property.operator)
    : null;

  const opType = selectedPropDef?.type || "string";
  const availableOperators = isDate
    ? dateOps.map((o) => ({ id: o.label, label: o.label }))
    : operators[opType] || operators.string;

  const valueOptions = selectedPropDef?.values
    ? selectedPropDef.values.map((v) => ({ id: v, label: v }))
    : [];

  return (
    <>
      <SelectDropdown
        value={property.propertyName}
        onChange={(val) => {
          const def = propertyDefs.find((p) => p.name === val);
          if (def?.type === "date") {
            onUpdate({ propertyName: val, operator: "was within the last", value: "5", unit: "days" });
          } else {
            onUpdate({ propertyName: val, operator: null, value: null, unit: null });
          }
        }}
        options={propertyOptions}
        placeholder="Select property"
        className="flex-1 min-w-0"
      />
      {property.propertyName && !isDate && (
        <>
          <SelectDropdown
            value={property.operator}
            onChange={(val) => onUpdate({ operator: val })}
            options={availableOperators}
            placeholder="is"
            className="flex-shrink-0"
          />
          {valueOptions.length > 0 ? (
            <SelectDropdown
              value={property.value}
              onChange={(val) => onUpdate({ value: val })}
              options={valueOptions}
              placeholder="Value"
              className="flex-1 min-w-0"
            />
          ) : (
            <input
              type="text"
              value={property.value || ""}
              onChange={(e) => onUpdate({ value: e.target.value })}
              placeholder="Value"
              className={`flex-1 min-w-0 rounded-md px-3 py-1.5 text-[12px] text-[#1a1b2e] placeholder:text-[#b0b2c0] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 transition-all ${
                property.value ? "bg-[#fbfbfb] border border-[#e5e7f0]" : "bg-white border border-[#e5e7f0]"
              }`}
            />
          )}
        </>
      )}
      {property.propertyName && isDate && (
        <>
          <SelectDropdown
            value={property.operator}
            onChange={(val) => {
              const op = dateOps.find((o) => o.label === val);
              if (op?.requiresUnit) {
                onUpdate({ operator: val, value: "5", unit: "days" });
              } else {
                onUpdate({ operator: val, value: null, unit: null });
              }
            }}
            options={availableOperators}
            placeholder="Condition"
            className="flex-shrink-0"
          />
          {selectedDateOp?.requiresUnit && (
            <>
              <input
                type="number"
                min={1}
                value={property.value || ""}
                onChange={(e) => onUpdate({ value: e.target.value })}
                className="w-14 rounded-md border border-[#e5e7f0] bg-[#fbfbfb] px-2 py-1.5 text-[12px] text-[#1a1b2e] text-center focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 transition-all"
              />
              <SelectDropdown
                value={property.unit || null}
                onChange={(val) => onUpdate({ unit: val })}
                options={dateUnits.map((u) => ({ id: u, label: u }))}
                placeholder="unit"
                className="flex-shrink-0"
              />
              {selectedDateOp.suffix && (
                <span className="text-[12px] text-[#636363] flex-shrink-0">{selectedDateOp.suffix}</span>
              )}
            </>
          )}
          {selectedDateOp && !selectedDateOp.requiresUnit && selectedDateOp.inputType === "datepicker-range" ? (
            <>
              <input
                type="date"
                value={property.value || ""}
                onChange={(e) => onUpdate({ value: e.target.value })}
                className="flex-1 min-w-0 rounded-md border border-[#e5e7f0] bg-[#fbfbfb] px-3 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 transition-all cursor-pointer"
              />
              <span className="text-[12px] text-[#636363]">and</span>
              <input
                type="date"
                value={property.unit || ""}
                onChange={(e) => onUpdate({ unit: e.target.value })}
                className="flex-1 min-w-0 rounded-md border border-[#e5e7f0] bg-[#fbfbfb] px-3 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 transition-all cursor-pointer"
              />
            </>
          ) : selectedDateOp && !selectedDateOp.requiresUnit && selectedDateOp.inputType === "datepicker" ? (
            <input
              type="date"
              value={property.value || ""}
              onChange={(e) => onUpdate({ value: e.target.value })}
              className="flex-1 min-w-0 rounded-md border border-[#e5e7f0] bg-[#fbfbfb] px-3 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 transition-all cursor-pointer"
            />
          ) : null}
        </>
      )}
    </>
  );
}

export function RuleRow({
  rule,
  mode,
  onChange,
  onDuplicate,
  onDelete,
  showDelete,
  isFirst = true,
}: RuleRowProps) {
  const [timingOpen, setTimingOpen] = useState(rule.timeframeValue !== null);

  const isReversed = rule.includeExclude === "Exclude";

  const cardTitle = isReversed
    ? (mode === "rule"
        ? "Don't include profiles who"
        : mode === "exit"
          ? "Don't remove profiles when"
          : "Don't track outcomes when")
    : (mode === "rule"
        ? (isFirst ? "Add profiles who" : "Profiles who")
        : mode === "exit"
          ? "Remove profiles when"
          : "Track outcomes when");

  const selectedLabel = (() => {
    if (rule.ruleType === "event") return eventTypes.find((e) => e.id === rule.categoryName)?.label || null;
    if (rule.ruleType === "fact") return factGroups.find((g) => g.id === rule.categoryName)?.label || null;
    if (rule.ruleType === "audience") return audienceSegments.find((a) => a.id === rule.audienceName)?.label || null;
    return null;
  })();

  const hasSelection = !!(rule.ruleType && selectedLabel);
  const propertyDefs = getPropertyDefs(rule.ruleType, rule.categoryName);

  const handlePickerSelect = (selection: {
    ruleType: "event" | "fact" | "audience";
    categoryName?: string;
    audienceName?: string;
    propertyName?: string | null;
  }) => {
    if (selection.ruleType === "audience") {
      onChange({
        ...rule,
        ruleType: "audience",
        audienceName: selection.audienceName || null,
        categoryName: null,
        properties: [],
      });
    } else if (selection.ruleType === "event") {
      const properties = selection.propertyName
        ? [{ id: Date.now() + Math.random(), propertyName: selection.propertyName, operator: null, value: null }]
        : [];
      onChange({
        ...rule,
        ruleType: "event",
        categoryName: selection.categoryName || null,
        audienceName: null,
        properties,
        timeframeValue: 30,
        timeframeUnit: "Days",
      });
    } else {
      const properties = selection.propertyName
        ? [{ id: Date.now() + Math.random(), propertyName: selection.propertyName, operator: null, value: null }]
        : [];
      onChange({
        ...rule,
        ruleType: "fact",
        categoryName: selection.categoryName || null,
        audienceName: null,
        properties,
      });
    }
  };

  const handlePropertyAdd = () => {
    onChange({
      ...rule,
      properties: [
        ...rule.properties,
        { id: Date.now() + Math.random(), propertyName: null, operator: null, value: null },
      ],
    });
  };

  const handlePropertyUpdate = (index: number, updates: Partial<RuleProperty>) => {
    const newProps = [...rule.properties];
    newProps[index] = { ...newProps[index], ...updates };
    onChange({ ...rule, properties: newProps });
  };

  const handlePropertyRemove = (index: number) => {
    onChange({ ...rule, properties: rule.properties.filter((_, i) => i !== index) });
  };

  const categoryOptions = rule.ruleType === "event"
    ? eventTypes.map((e) => ({ id: e.id, label: e.label }))
    : rule.ruleType === "fact"
      ? factGroups.map((g) => ({ id: g.id, label: g.label }))
      : rule.ruleType === "audience"
        ? audienceSegments.map((a) => ({ id: a.id, label: a.label }))
        : [];

  return (
    <div className="rounded-xl border border-[#e5e7f0] bg-white overflow-hidden">
      {/* Header: title + actions */}
      <div className="flex items-center justify-between px-4 pt-4 pb-0">
        <h3 className="text-[13px] font-semibold text-[#1a1b2e]">
          {isReversed && <span className="text-[#ef4444]">Don&apos;t </span>}
          {isReversed ? cardTitle.replace(/^Don't /, "") : cardTitle}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={onDuplicate}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f5f6fa] text-[#9b9daf] hover:text-[#6c6e82] transition-colors"
            title="Duplicate"
          >
            <CopyIcon />
          </button>
          {showDelete && (
            <button
              onClick={onDelete}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f5f6fa] text-[#9b9daf] hover:text-[#6c6e82] transition-colors"
              title="Delete"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>

      {/* Rule body */}
      <div className="px-4 pt-2 pb-5 space-y-2">
        {!hasSelection ? (
          <CategoryPicker onSelect={handlePickerSelect} />
        ) : (
          <>
            {/* Main rule row: icon + category + first property inline */}
            <div className="flex items-center gap-2">
              <RuleTypeIcon type={rule.ruleType} />
              <SelectDropdown
                value={rule.ruleType === "audience" ? rule.audienceName : rule.categoryName}
                onChange={(val) => {
                  if (rule.ruleType === "audience") {
                    onChange({ ...rule, audienceName: val });
                  } else {
                    onChange({ ...rule, categoryName: val, properties: [], timeframeValue: null });
                  }
                }}
                options={categoryOptions}
                placeholder="Select"
                className="w-[160px] flex-shrink-0"
              />
              {rule.ruleType !== "audience" && rule.properties.length > 0 && (
                <InlinePropertyFields
                  property={rule.properties[0]}
                  propertyDefs={propertyDefs}
                  onUpdate={(updates) => handlePropertyUpdate(0, updates)}
                />
              )}
              <button
                onClick={() => {
                  if (rule.properties.length <= 1) {
                    onChange({ ...rule, ruleType: null, categoryName: null, audienceName: null, properties: [], timeframeValue: null });
                  } else {
                    handlePropertyRemove(0);
                  }
                }}
                className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-[#f5f6fa] text-[#9b9daf] hover:text-[#6c6e82] transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Additional property rows */}
            {rule.ruleType !== "audience" && rule.properties.slice(1).map((prop, i) => (
              <div key={prop.id} className="flex items-center gap-2">
                <span className="flex-shrink-0 flex items-center gap-1.5 text-[12px] text-[#636363]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                    <path d="M2 0v8h10" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  and
                </span>
                <InlinePropertyFields
                  property={prop}
                  propertyDefs={propertyDefs}
                  onUpdate={(updates) => handlePropertyUpdate(i + 1, updates)}
                />
                <button
                  onClick={() => handlePropertyRemove(i + 1)}
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-[#f5f6fa] text-[#9b9daf] hover:text-[#6c6e82] transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Timing section (collapsible) */}
            {rule.ruleType === "event" && timingOpen && (
              <>
                <button
                  onClick={() => setTimingOpen(false)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#636363] tracking-wide uppercase hover:text-[#1a1b2e] transition-colors"
                >
                  Timing
                  <ChevronDownIcon className="w-3 h-3 rotate-180" />
                </button>
                <div className="flex items-center gap-2 flex-wrap">
                  <SelectDropdown
                    value="at_least"
                    onChange={() => {}}
                    options={[{ id: "at_least", label: "At least" }, { id: "at_most", label: "At most" }, { id: "exactly", label: "Exactly" }]}
                    placeholder="At least"
                    className="flex-shrink-0"
                  />
                  <input
                    type="number"
                    min={1}
                    value={rule.coOccurrenceValue}
                    onChange={(e) => onChange({ ...rule, coOccurrenceValue: parseInt(e.target.value) || 1 })}
                    className="w-14 rounded-md border border-[#e5e7f0] bg-[#fbfbfb] px-2 py-1.5 text-[12px] text-[#1a1b2e] text-center focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 transition-all"
                  />
                  <span className="text-[12px] text-[#636363]">time, in the last</span>
                  <input
                    type="number"
                    min={1}
                    value={rule.timeframeValue || 30}
                    onChange={(e) => onChange({ ...rule, timeframeValue: parseInt(e.target.value) || 30 })}
                    className="w-14 rounded-md border border-[#e5e7f0] bg-[#fbfbfb] px-2 py-1.5 text-[12px] text-[#1a1b2e] text-center focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 transition-all"
                  />
                  <SelectDropdown
                    value={rule.timeframeUnit.toLowerCase()}
                    onChange={(val) => onChange({ ...rule, timeframeUnit: val.charAt(0).toUpperCase() + val.slice(1) })}
                    options={timeUnits.map((u) => ({ id: u.toLowerCase(), label: u.toLowerCase() }))}
                    placeholder="days"
                    className="flex-shrink-0"
                  />
                </div>
              </>
            )}

            {/* Bottom row: Add property + timing toggle + reverse toggle */}
            {rule.ruleType !== "audience" && (
              <div className="flex items-center justify-between pt-0.5 pl-[22px]">
                <button
                  onClick={handlePropertyAdd}
                  className="inline-flex items-center gap-1 text-[12px] text-[#7c5cfc] hover:text-[#6b4ce0] transition-colors"
                >
                  <PlusIcon className="w-3 h-3" />
                  Add property
                </button>
                <div className="flex items-center gap-3">
                  {rule.ruleType === "event" && !timingOpen && (
                    <button
                      onClick={() => {
                        setTimingOpen(true);
                        if (!rule.timeframeValue) {
                          onChange({ ...rule, timeframeValue: 30, timeframeUnit: "Days" });
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#636363] tracking-wide uppercase hover:text-[#1a1b2e] transition-colors"
                    >
                      Timing
                      <ChevronDownIcon className="w-3 h-3" />
                    </button>
                  )}
                  <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <span className="text-[11px] text-[#636363]">Reverse rule</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isReversed}
                      onClick={() => onChange({ ...rule, includeExclude: isReversed ? "Include" : "Exclude" })}
                      className={`relative w-8 h-[18px] rounded-full transition-colors ${
                        isReversed ? "bg-[#1a1b2e]" : "bg-[#d1d5db]"
                      }`}
                    >
                      <span
                        className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform shadow-sm ${
                          isReversed ? "translate-x-[14px]" : ""
                        }`}
                      />
                      {isReversed && (
                        <svg className="absolute top-[4px] right-[4px] w-[10px] h-[10px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12 5 5L20 7" />
                        </svg>
                      )}
                    </button>
                  </label>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
