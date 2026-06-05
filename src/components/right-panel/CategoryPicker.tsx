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

const mostUsedIds = [
  { type: "event" as const, id: "viewed_product" },
  { type: "event" as const, id: "completed_purchase" },
  { type: "event" as const, id: "abandoned_checkout" },
  { type: "event" as const, id: "email_click" },
  { type: "fact" as const, id: "lifecycle" },
  { type: "fact" as const, id: "customer_details" },
];

function buildItems(tab: Tab): PickerItem[] {
  if (tab === "events") {
    return eventTypes.map((e) => ({
      id: e.id,
      label: e.label,
      type: "event",
      properties: e.properties,
    }));
  }
  if (tab === "facts") {
    return factGroups.map((g) => ({
      id: g.id,
      label: g.label,
      type: "fact",
      properties: g.properties,
    }));
  }
  if (tab === "audiences") {
    return audienceSegments.map((a) => ({
      id: a.id,
      label: a.label,
      type: "audience",
    }));
  }
  return mostUsedIds
    .map(({ type, id }) => {
      if (type === "event") {
        const e = eventTypes.find((ev) => ev.id === id);
        return e ? { id: e.id, label: e.label, type: "event" as const, properties: e.properties } : null;
      }
      const g = factGroups.find((fg) => fg.id === id);
      return g ? { id: g.id, label: g.label, type: "fact" as const, properties: g.properties } : null;
    })
    .filter(Boolean) as PickerItem[];
}

function TypeIcon({ type }: { type: "event" | "fact" | "audience" }) {
  if (type === "event") {
    return (
      <span className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center bg-[#fff3e0]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />
        </svg>
      </span>
    );
  }
  if (type === "fact") {
    return (
      <span className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center bg-[#fce7f3]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center bg-[#fef3c7]">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </span>
  );
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "most_used", label: "Common", icon: null },
  { id: "events", label: "Events", icon: <TypeIcon type="event" /> },
  { id: "facts", label: "Facts", icon: <TypeIcon type="fact" /> },
  { id: "audiences", label: "Existing Audience", icon: <TypeIcon type="audience" /> },
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
    return [...events, ...facts, ...audiences];
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
            key: item.id,
            itemId: item.id,
            itemLabel: item.label,
            propertyName: null,
            type: item.type,
          });
        } else if (matchedProps.length > 0) {
          for (const prop of matchedProps) {
            results.push({
              key: `${item.id}::${prop.name}`,
              itemId: item.id,
              itemLabel: item.label,
              propertyName: prop.name,
              type: item.type,
            });
          }
        }
      } else if (labelMatch) {
        results.push({
          key: item.id,
          itemId: item.id,
          itemLabel: item.label,
          propertyName: null,
          type: item.type,
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
      setHoveredId(item.id);
    } else {
      onSelect({
        ruleType: item.type,
        categoryName: item.id,
        propertyName: null,
      });
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "audience") {
      onSelect({ ruleType: "audience", audienceName: result.itemId });
    } else {
      onSelect({
        ruleType: result.type,
        categoryName: result.itemId,
        propertyName: result.propertyName,
      });
    }
  };

  const handlePropertyClick = (item: PickerItem, propertyName: string | null) => {
    onSelect({
      ruleType: item.type,
      categoryName: item.id,
      propertyName,
    });
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
          className="w-full rounded-md bg-white border border-[#e5e7f0] pl-8 pr-8 py-1.5 text-[12px] text-[#1a1b2e] placeholder:text-[#b0b2c0] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 transition-all cursor-pointer"
        />
        <ChevronDownIcon className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b9daf] pointer-events-none transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Tabs + Content */}
      {isOpen && (
      <div>
        <div className="rounded-lg border border-[#e5e7f0] bg-white overflow-hidden">
        {/* Tabs — hidden during search */}
        {!isSearching && (
          <div className="flex items-center gap-1 px-3 py-2 border-b border-[#e5e7f0]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setHoveredId(null); }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  activeTab === tab.id
                    ? "bg-[#f5f6fa] text-[#1a1b2e] border border-[#e5e7f0]"
                    : "text-[#9b9daf] hover:text-[#6c6e82]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex min-h-[200px] max-h-[280px]">
          {isSearching ? (
            /* Flat search results */
            <div className="w-full overflow-y-auto picker-scroll">
              {searchResults.length === 0 ? (
                <div className="px-3 py-4 text-[12px] text-[#636363] text-center">No results</div>
              ) : (
                searchResults.map((result) => (
                  <button
                    key={result.key}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left px-3 py-2.5 text-[12px] text-[#1a1b2e] hover:bg-[#f5f6fa] transition-colors flex items-center gap-2.5"
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
              {/* Left column: items */}
              <div className={`overflow-y-auto picker-scroll ${showProperties ? "w-1/2 border-r border-[#e5e7f0]" : "w-full"}`}>
                {allItems.length === 0 ? (
                  <div className="px-3 py-4 text-[12px] text-[#636363] text-center">No results</div>
                ) : (
                  allItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => item.properties && item.properties.length > 0 && setHoveredId(item.id)}
                      className={`w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center justify-between ${
                        hoveredId === item.id
                          ? "bg-[#f5f6fa] text-[#1a1b2e]"
                          : "text-[#1a1b2e] hover:bg-[#fafbfc]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.properties && item.properties.length > 0 && (
                        <ChevronDownIcon className="w-3 h-3 -rotate-90 text-[#9b9daf]" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Right column: properties */}
              {showProperties && hoveredItem && (
                <div className="w-1/2 overflow-y-auto picker-scroll">
                  <button
                    onClick={() => handlePropertyClick(hoveredItem, null)}
                    className="w-full text-left px-3 py-2 text-[12px] text-[#1a1b2e] hover:bg-[#f5f6fa] transition-colors font-medium"
                  >
                    Any
                  </button>
                  {hoveredItem.properties!.map((prop) => (
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
