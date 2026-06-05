"use client";

import { useState, useEffect, useRef } from "react";
import type { TimeDelayConfig } from "@/lib/types";
import { CloseIcon, ChevronDownIcon } from "./icons";

interface TimeDelayBuilderProps {
  onClose: () => void;
  onSave: (config: TimeDelayConfig) => void;
  initialConfig?: TimeDelayConfig;
  onDraftChange?: (config: TimeDelayConfig) => void;
}

const timeUnits = ["minutes", "hours", "days", "weeks"];
const dateSources = [
  { id: "signup_date", label: "Signup date" },
  { id: "last_purchase_date", label: "Last purchase date" },
  { id: "birthday", label: "Birthday" },
  { id: "subscription_renewal", label: "Subscription renewal date" },
  { id: "trial_end_date", label: "Trial end date" },
];

type DelayMode = "fixed" | "specific_date" | "dynamic";

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  fullWidth,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { id: string; label: string }[];
  placeholder?: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fullWidth ? "w-full" : ""} appearance-none rounded-md pl-3 pr-7 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 transition-all cursor-pointer ${
          value ? "bg-[#fbfbfb] border border-[#e5e7f0]" : "bg-white border border-[#e5e7f0]"
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
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

function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <input
      type="number"
      min={1}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
      className="w-14 rounded-md bg-[#fbfbfb] border border-[#e5e7f0] px-2 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 text-center"
    />
  );
}

function RadioOption({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <label
      className="flex items-center gap-3 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          selected ? "border-[#1a1b2e]" : "border-[#d0d3e0]"
        }`}
      >
        {selected && (
          <div className="w-2.5 h-2.5 rounded-full bg-[#1a1b2e]" />
        )}
      </div>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[12px] font-medium text-[#1a1b2e]">{label}</span>
      </div>
    </label>
  );
}

function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-lg bg-[#f0f4ff] px-3.5 py-2.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <span className="text-[12px] text-[#4b5563] leading-relaxed">{children}</span>
    </div>
  );
}

const ClockIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1b2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CalendarIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1b2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DynamicIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1b2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

export function TimeDelayBuilder({ onClose, onSave, initialConfig, onDraftChange }: TimeDelayBuilderProps) {
  const ic = initialConfig;
  const initialMode: DelayMode = ic?.mode || "fixed";
  const [mode, setMode] = useState<DelayMode>(initialMode);

  const [fixedValue, setFixedValue] = useState(initialMode === "fixed" ? (ic?.value ?? 3) : 3);
  const [fixedUnit, setFixedUnit] = useState(initialMode === "fixed" ? (ic?.unit ?? "days") : "days");

  const [specificDate, setSpecificDate] = useState(ic?.specificDate || "2026-06-13");

  const [dynamicValue, setDynamicValue] = useState(initialMode === "dynamic" ? (ic?.value ?? 3) : 3);
  const [dynamicUnit, setDynamicUnit] = useState(initialMode === "dynamic" ? (ic?.unit ?? "days") : "days");
  const [direction, setDirection] = useState(ic?.direction || "before");
  const [dateSource, setDateSource] = useState(ic?.dateSource || "");
  const [dynamicDate, setDynamicDate] = useState(ic?.dynamicDate || "2026-06-13");
  const [dynamicDateEnd, setDynamicDateEnd] = useState(ic?.dynamicDateEnd || "2026-06-20");

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [missingWaitValue, setMissingWaitValue] = useState(ic?.missingWaitValue ?? 24);
  const [missingWaitUnit, setMissingWaitUnit] = useState(ic?.missingWaitUnit || "hours");
  const [missingAction, setMissingAction] = useState(ic?.missingAction || "skip");
  const [datePassedAction, setDatePassedAction] = useState(ic?.datePassedAction || "skip");
  const [stopWaitingValue, setStopWaitingValue] = useState(ic?.stopWaitingValue ?? 90);
  const [stopWaitingUnit, setStopWaitingUnit] = useState(ic?.stopWaitingUnit || "days");
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    const draft: TimeDelayConfig = {
      mode, value: mode === "fixed" ? fixedValue : dynamicValue,
      unit: mode === "fixed" ? fixedUnit : dynamicUnit,
      specificDate, direction, dateSource,
      dateSourceLabel: dateSources.find((d) => d.id === dateSource)?.label || "",
      dynamicDate, dynamicDateEnd,
      missingWaitValue, missingWaitUnit, missingAction,
      datePassedAction, stopWaitingValue, stopWaitingUnit,
    };
    onDraftChange?.(draft);
  }, [mode, fixedValue, fixedUnit, specificDate, dynamicValue, dynamicUnit, direction, dateSource, dynamicDate, dynamicDateEnd, missingWaitValue, missingWaitUnit, missingAction, datePassedAction, stopWaitingValue, stopWaitingUnit, onDraftChange]);

  const handleSave = () => {
    if (mode === "fixed") {
      onSave({ mode: "fixed", value: fixedValue, unit: fixedUnit });
    } else if (mode === "specific_date") {
      onSave({ mode: "specific_date", value: 0, unit: "days", specificDate });
    } else {
      onSave({
        mode: "dynamic",
        value: direction === "before" || direction === "after" ? dynamicValue : 0,
        unit: direction === "before" || direction === "after" ? dynamicUnit : "days",
        direction,
        dateSource,
        dateSourceLabel: dateSources.find((d) => d.id === dateSource)?.label || "",
        ...(direction === "is" ? { dynamicDate } : {}),
        ...(direction === "is_between" ? { dynamicDate, dynamicDateEnd } : {}),
        datePassedAction,
        missingWaitValue,
        missingWaitUnit,
        missingAction,
        stopWaitingValue,
        stopWaitingUnit,
      });
    }
    onClose();
  };

  const dateSourceLabel =
    dateSources.find((d) => d.id === dateSource)?.label || "date source";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return `${d.getDate()} ${d.toLocaleString("en-GB", { month: "long" })} ${d.getFullYear()}`;
  };

  const getInfoText = () => {
    if (mode === "fixed") {
      return `Profiles will wait ${fixedValue} ${fixedUnit} and then continue to the next step.`;
    }
    if (mode === "specific_date") {
      return `Profiles will wait until ${formatDate(specificDate)} and then continue to the next step.`;
    }
    if (direction === "is") {
      return `Profiles will wait until their ${dateSourceLabel} is ${formatDate(dynamicDate)} and then continue to the next step.`;
    }
    if (direction === "is_between") {
      return `Profiles will wait until their ${dateSourceLabel} is between ${formatDate(dynamicDate)} and ${formatDate(dynamicDateEnd)} and then continue to the next step.`;
    }
    return `Profiles will wait until ${dynamicValue} ${dynamicUnit} ${direction} their ${dateSourceLabel} and then continue to the next step.`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-2 border-b border-[#e5e7f0]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-[#1a1b2e]">Time delay</h2>
            <p className="text-[12px] text-[#9b9daf]">
              Delay profiles until a specific date or time.
            </p>
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
        {/* Wait for / Wait until label */}
        <div className="text-[12px] font-bold text-[#1a1b2e]">
          {mode === "fixed" ? "Wait for" : "Wait until"}
        </div>

        {/* Mode selection */}
        <div className="rounded-xl border border-[#e5e7f0] bg-white overflow-hidden">
          <div className="px-4 py-3 space-y-3">
            <RadioOption
              selected={mode === "fixed"}
              onClick={() => setMode("fixed")}
              icon={ClockIcon}
              label="A duration of time"
            />
            <RadioOption
              selected={mode === "specific_date"}
              onClick={() => setMode("specific_date")}
              icon={CalendarIcon}
              label="A specific date"
            />
            <RadioOption
              selected={mode === "dynamic"}
              onClick={() => setMode("dynamic")}
              icon={DynamicIcon}
              label="A dynamic date from profile data"
            />
          </div>
        </div>

        {/* Duration mode fields */}
        {mode === "fixed" && (
          <div className="rounded-xl border border-[#e5e7f0] bg-white overflow-hidden">
            <div className="px-4 py-3">
              <div className="text-[11px] text-[#9b9daf] mb-2">Hold profiles for</div>
              <div className="flex items-center gap-2">
                <NumberInput value={fixedValue} onChange={setFixedValue} />
                <SelectField
                  value={fixedUnit}
                  onChange={setFixedUnit}
                  options={timeUnits.map((u) => ({ id: u, label: u }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Specific date mode fields */}
        {mode === "specific_date" && (
          <div className="rounded-xl border border-[#e5e7f0] bg-white overflow-hidden">
            <div className="px-4 py-3">
              <div className="text-[11px] text-[#9b9daf] mb-2">Wait until</div>
              <div className="relative">
                <input
                  type="date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                  className="w-full rounded-md bg-[#fbfbfb] border border-[#e5e7f0] px-3 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic mode fields */}
        {mode === "dynamic" && (
          <>
            <div className="rounded-xl border border-[#e5e7f0] bg-white overflow-hidden">
              <div className="px-4 py-3 space-y-2.5">
                <div className="text-[11px] text-[#9b9daf]">Wait until</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(direction === "before" || direction === "after") && (
                    <>
                      <NumberInput value={dynamicValue} onChange={setDynamicValue} />
                      <SelectField
                        value={dynamicUnit}
                        onChange={setDynamicUnit}
                        options={timeUnits.map((u) => ({ id: u, label: u }))}
                      />
                      <SelectField
                        value={direction}
                        onChange={setDirection}
                        options={[
                          { id: "before", label: "before" },
                          { id: "after", label: "after" },
                          { id: "is", label: "is" },
                          { id: "is_between", label: "is between" },
                        ]}
                      />
                      <SelectField
                        value={dateSource}
                        onChange={setDateSource}
                        options={dateSources}
                        placeholder="Select date source"
                      />
                    </>
                  )}
                  {(direction === "is" || direction === "is_between") && (
                    <>
                      <SelectField
                        value={dateSource}
                        onChange={setDateSource}
                        options={dateSources}
                        placeholder="Select date source"
                      />
                      <SelectField
                        value={direction}
                        onChange={setDirection}
                        options={[
                          { id: "before", label: "before" },
                          { id: "after", label: "after" },
                          { id: "is", label: "is" },
                          { id: "is_between", label: "is between" },
                        ]}
                      />
                    </>
                  )}
                </div>

                {direction === "is" && (
                  <div>
                    <div className="text-[11px] text-[#9b9daf] mb-2">Date</div>
                    <input
                      type="date"
                      value={dynamicDate}
                      onChange={(e) => setDynamicDate(e.target.value)}
                      className="w-full rounded-md bg-[#fbfbfb] border border-[#e5e7f0] px-3 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 cursor-pointer"
                    />
                  </div>
                )}

                {direction === "is_between" && (
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <div className="text-[11px] text-[#9b9daf] mb-2">From</div>
                      <input
                        type="date"
                        value={dynamicDate}
                        onChange={(e) => setDynamicDate(e.target.value)}
                        className="w-full rounded-md bg-[#fbfbfb] border border-[#e5e7f0] px-3 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] text-[#9b9daf] mb-2">To</div>
                      <input
                        type="date"
                        value={dynamicDateEnd}
                        onChange={(e) => setDynamicDateEnd(e.target.value)}
                        className="w-full rounded-md bg-[#fbfbfb] border border-[#e5e7f0] px-3 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced section */}
            <div>
              <button
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex items-center gap-1.5 text-[12px] font-bold text-[#1a1b2e] mb-2"
              >
                Advanced
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${advancedOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {advancedOpen && (
                <div className="rounded-xl border border-[#e5e7f0] bg-white overflow-hidden">
                  <div className="px-4 py-3 space-y-3">
                    {/* Missing date */}
                    <div>
                      <div className="text-[11px] text-[#9b9daf] mb-2">
                        If the date is missing, wait up to
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <NumberInput value={missingWaitValue} onChange={setMissingWaitValue} />
                        <SelectField
                          value={missingWaitUnit}
                          onChange={setMissingWaitUnit}
                          options={timeUnits.map((u) => ({ id: u, label: u }))}
                        />
                        <span className="text-[12px] text-[#9b9daf]">then</span>
                        <SelectField
                          value={missingAction}
                          onChange={setMissingAction}
                          options={[
                            { id: "skip", label: "Skip step" },
                            { id: "continue", label: "Continue" },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="border-t border-[#f0f0f0]" />

                    {/* Date already passed */}
                    <div>
                      <div className="text-[11px] text-[#9b9daf] mb-2">
                        If the date has already passed
                      </div>
                      <SelectField
                        value={datePassedAction}
                        onChange={setDatePassedAction}
                        options={[
                          { id: "skip", label: "Skip this step" },
                          { id: "continue", label: "Continue immediately" },
                          { id: "wait_next", label: "Wait for next occurrence" },
                        ]}
                      />
                    </div>

                    <div className="border-t border-[#f0f0f0]" />

                    {/* Stop waiting after */}
                    <div>
                      <div className="text-[11px] text-[#9b9daf] mb-2">
                        Stop waiting after
                      </div>
                      <div className="flex items-center gap-2">
                        <NumberInput value={stopWaitingValue} onChange={setStopWaitingValue} />
                        <SelectField
                          value={stopWaitingUnit}
                          onChange={setStopWaitingUnit}
                          options={timeUnits.map((u) => ({ id: u, label: u }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Info banner */}
        <InfoBanner>{getInfoText()}</InfoBanner>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[#e5e7f0] flex-shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-[12px] font-medium text-[#1a1b2e] border border-[#e5e7f0] rounded-lg hover:bg-[#f5f6fa] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-1.5 text-[12px] font-medium text-white bg-[#1a1b2e] rounded-lg hover:bg-[#2d2e42] transition-colors"
        >
          Save rule
        </button>
      </div>
    </div>
  );
}
