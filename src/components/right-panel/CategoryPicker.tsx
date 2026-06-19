"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { eventTypes, factGroups, audienceSegments } from "@/lib/mock-data";
import type { PropertyDef } from "@/lib/types";
import { ChevronDownIcon } from "./icons";

type Tab = "most_used" | "events" | "facts" | "audiences";

interface PickerItem {
  id: string;
  label: string;
  type: "event" | "fact" | "audience";
  properties?: PropertyDef[];
}

interface SearchResult {
  key: string;
  itemId: string;
  itemLabel: string;
  propertyName: string | null;
  type: "event" | "fact" | "audience";
}

interface CategoryPickerProps {
  onSelect: (selection: {
    ruleType: "event" | "fact" | "audience";
    categoryName?: string;
    audienceName?: string;
    propertyName?: string | null;
  }) => void;
}

const mostUsedIds: { type: "event" | "fact" | "audience"; id: string }[] = [
  { type: "event", id: "viewed_product" },
  { type: "event", id: "completed_purchase" },
  { type: "event", id: "abandoned_checkout" },
  { type: "event", id: "email_click" },
  { type: "fact", id: "lifecycle" },
  { type: "fact", id: "customer_details" },
];

const typeOrder: Record<string, number> = { event: 0, fact: 1, audience: 2 };
const sortAlpha = (a: PickerItem, b: PickerItem) => a.label.localeCompare(b.label);
const sortByTypeAlpha = (a: PickerItem, b: PickerItem) => (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9) || a.label.localeCompare(b.label);

function buildItems(tab: Tab): PickerItem[] {
  if (tab === "events") {
    return eventTypes.map((e) => ({
      id: e.id, label: e.label, type: "event" as const, properties: e.properties,
    })).sort(sortAlpha);
  }
  if (tab === "facts") {
    return factGroups.map((g) => ({
      id: g.id, label: g.label, type: "fact" as const, properties: g.properties,
    })).sort(sortAlpha);
  }
  if (tab === "audiences") {
    return audienceSegments.map((a) => ({
      id: a.id, label: a.label, type: "audience" as const,
    })).sort(sortAlpha);
  }
  const items = mostUsedIds
    .map(({ type, id }) => {
      if (type === "event") {
        const e = eventTypes.find((ev) => ev.id === id);
        return e ? { id: e.id, label: e.label, type: "event" as const, properties: e.properties } : null;
      }
      if (type === "audience") {
        const a = audienceSegments.find((au) => au.id === id);
        return a ? { id: a.id, label: a.label, type: "audience" as const } : null;
      }
      const g = factGroups.find((fg) => fg.id === id);
      return g ? { id: g.id, label: g.label, type: "fact" as const, properties: g.properties } : null;
    })
    .filter(Boolean) as PickerItem[];
  return items.sort(sortByTypeAlpha);
}

function TabIcon({ type, active }: { type: "event" | "fact" | "audience"; active: boolean }) {
  const color = active ? "white" : type === "event" ? "#3b82f6" : type === "fact" ? "#14b8a6" : "#7c5cfc";
  if (type === "event") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />
      </svg>
    );
  }
  if (type === "fact") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function TypeIcon({ type }: { type: "event" | "fact" | "audience" }) {
  if (type === "event") {
    return (
      <span className="w-[18px] h-[18px] rounded flex-shrink-0 flex items-center justify-center bg-[#eff6ff]">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />
        </svg>
      </span>
    );
  }
  if (type === "fact") {
    return (
      <span className="w-[18px] h-[18px] rounded flex-shrink-0 flex items-center justify-center bg-[#f0fdfa]">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      </span>
    );
  }
  return (
    <span className="w-[18px] h-[18px] rounded flex-shrink-0 flex items-center justify-center bg-[#ede9fe]">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7c5cfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </span>
  );
}

const tabLabels: Record<Tab, string> = {
  most_used: "Frequent",
  events: "Events",
  facts: "Facts",
  audiences: "Audiences",
};

const tabs: { id: Tab; type?: "event" | "fact" | "audience" }[] = [
  { id: "most_used" },
  { id: "events", type: "event" },
  { id: "facts", type: "fact" },
  { id: "audiences", type: "audience" },
];

export function CategoryPicker({ onSelect }: CategoryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("most_used");
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const allItems = useMemo(() => buildItems(activeTab), [activeTab]);

  const allCrossTab = useMemo(() => {
    const events: PickerItem[] = eventTypes.map((e) => ({
      id: e.id, label: e.label, type: "event", properties: e.properties,
    }));
    const facts: PickerItem[] = factGroups.map((g) => ({
      id: g.id, label: g.label, type: "fact", properties: g.properties,
    }));
    const audiences: PickerItem[] = audienceSegments.map((a) => ({
      id: a.id, label: a.label, type: "audience",
    }));
    return [...events, ...facts, ...audiences].sort(sortByTypeAlpha);
  }, []);

  const searchResults = useMemo(() => {
    if (!search) return null;
    const q = search.toLowerCase();
    const results: SearchResult[] = [];

    for (const item of allCrossTab) {
      const labelMatch = item.label.toLowerCase().includes(q);

      if (item.properties && item.properties.length > 0) {
        const matchedProps = item.properties.filter(
          (p) => p.name.toLowerCase().includes(q) || p.values?.some((v) => v.toLowerCase().includes(q))
        );

        if (labelMatch) {
          results.push({
            key: item.id, itemId: item.id, itemLabel: item.label, propertyName: null, type: item.type,
          });
        } else if (matchedProps.length > 0) {
          for (const prop of matchedProps) {
            results.push({
              key: `${item.id}::${prop.name}`, itemId: item.id, itemLabel: item.label, propertyName: prop.name, type: item.type,
            });
          }
        }
      } else if (labelMatch) {
        results.push({
          key: item.id, itemId: item.id, itemLabel: item.label, propertyName: null, type: item.type,
        });
      }
    }
    return results;
  }, [search, allCrossTab]);

  const isSearching = searchResults !== null;

  const hoveredItem = hoveredId ? allItems.find((i) => i.id === hoveredId) : null;
  const showProperties = !isSearching && hoveredItem && hoveredItem.properties && hoveredItem.properties.length > 0;

  const handleItemClick = (item: PickerItem) => {
    if (item.type === "audience") {
      onSelect({ ruleType: "audience", audienceName: item.id });
    } else if (item.properties && item.properties.length > 0) {
      setHoveredId((prev) => (prev === item.id ? null : item.id));
    } else {
      onSelect({ ruleType: item.type, categoryName: item.id, propertyName: null });
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "audience") {
      onSelect({ ruleType: "audience", audienceName: result.itemId });
    } else {
      onSelect({ ruleType: result.type, categoryName: result.itemId, propertyName: result.propertyName });
    }
  };

  const handlePropertyClick = (item: PickerItem, propertyName: string | null) => {
    onSelect({ ruleType: item.type, categoryName: item.id, propertyName });
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      {/* Search row */}
      <div className="relative">
        <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9b9daf] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          placeholder="Search for an event, fact or audience"
          className="w-full rounded-md bg-white border border-[#e5e7f0] pl-8 pr-8 py-1.5 text-[12px] text-[#1a1b2e] placeholder:text-[#b0b2c0] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5]/40 transition-all cursor-pointer"
        />
        <ChevronDownIcon className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b9daf] pointer-events-none transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Tabs + Content */}
      {isOpen && (
      <div className="animate-[fadeSlideDown_150ms_ease-out]">
        <div className="rounded-xl border border-[#e5e7f0] bg-white overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
        {/* Tab pills */}
        {!isSearching && (
          <div className="flex items-center gap-1.5 px-3 pt-3 pb-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setHoveredId(null); }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-medium rounded-full border transition-colors duration-150 ${
                    isActive
                      ? "bg-[#4f46e5] text-white border-[#4f46e5]"
                      : "bg-white text-[#6c6e82] border-[#e5e7f0] hover:border-[#d0d3e0] hover:text-[#1a1b2e]"
                  }`}
                >
                  {tab.type && <TabIcon type={tab.type} active={isActive} />}
                  {tabLabels[tab.id]}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="flex h-[216px]">
          {isSearching ? (
            <div className="w-full overflow-y-auto picker-scroll">
              {searchResults.length === 0 ? (
                <div className="px-3 py-4 text-[12px] text-[#9b9daf] text-center">No results</div>
              ) : (
                searchResults.map((result) => (
                  <button
                    key={result.key}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left px-3 py-2 text-[12px] text-[#1a1b2e] hover:bg-[#f5f6fa] transition-colors flex items-center gap-2"
                  >
                    <TypeIcon type={result.type} />
                    <span>
                      {result.itemLabel}
                      {result.propertyName && (
                        <span className="text-[#9b9daf]"> · {result.propertyName}</span>
                      )}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Left column */}
              <div className={`overflow-y-auto picker-scroll transition-[width] duration-200 ease-out ${showProperties ? "w-1/2 border-r border-[#e5e7f0]" : "w-full"}`}>
                <div className="px-3 pt-1 pb-1 text-[10px] font-semibold text-[#9b9daf] uppercase tracking-wider">
                  {tabLabels[activeTab]}
                </div>
                {allItems.length === 0 ? (
                  <div className="px-3 py-4 text-[12px] text-[#9b9daf] text-center">No results</div>
                ) : (
                  allItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`w-full text-left px-3 py-2 text-[12px] transition-colors duration-100 flex items-center justify-between ${
                        hoveredId === item.id
                          ? "bg-[#f5f6fa] text-[#1a1b2e]"
                          : "text-[#1a1b2e] hover:bg-[#fafbfc]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <TypeIcon type={item.type} />
                        {item.label}
                      </span>
                      {item.properties && item.properties.length > 0 && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9b9daf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Right column: properties */}
              {showProperties && hoveredItem && (
                <div className="w-1/2 overflow-y-auto picker-scroll animate-[fadeIn_150ms_ease-out]">
                  <div className="px-3 pt-1 pb-1 text-[10px] font-semibold text-[#9b9daf] uppercase tracking-wider">
                    Properties
                  </div>
                  <button
                    onClick={() => handlePropertyClick(hoveredItem, null)}
                    className="w-full text-left px-3 py-2 text-[12px] text-[#1a1b2e] hover:bg-[#f5f6fa] transition-colors font-medium"
                  >
                    Any
                  </button>
                  {[...hoveredItem.properties!].sort((a, b) => a.name.localeCompare(b.name)).map((prop) => (
                    <button
                      key={prop.name}
                      onClick={() => handlePropertyClick(hoveredItem, prop.name)}
                      className="w-full text-left px-3 py-2 text-[12px] text-[#1a1b2e] hover:bg-[#f5f6fa] transition-colors"
                    >
                      {prop.name}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
      )}
    </div>
  );
}
