"use client";

import { useState, useRef, useEffect } from "react";

const tabs = [
  { id: "journey", label: "Journey" },
  { id: "review", label: "Review" },
];

export function TopBar() {
  const [activeTab, setActiveTab] = useState("journey");
  const [journeyName, setJourneyName] = useState("New Journey");
  const [isEditing, setIsEditing] = useState(false);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const saveMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (saveMenuRef.current && !saveMenuRef.current.contains(e.target as Node)) {
        setSaveMenuOpen(false);
      }
    }
    if (saveMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [saveMenuOpen]);

  return (
    <div className="h-[56px] bg-white border-b border-[#e5e7f0] flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f6fa] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1b2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          {isEditing ? (
            <input
              ref={inputRef}
              value={journeyName}
              onChange={(e) => setJourneyName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditing(false);
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="text-[15px] font-semibold text-[#1a1b2e] bg-transparent border-b border-[#7c5cfc] outline-none py-0.5 min-w-[120px]"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 group/name"
            >
              <h1 className="text-[15px] font-semibold text-[#1a1b2e]">{journeyName}</h1>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9daf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover/name:opacity-100 transition-opacity">
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              </svg>
            </button>
          )}

          <span className="px-2 py-0.5 text-[11px] font-medium text-[#9b9daf] bg-[#f5f6fa] border border-[#e5e7f0] rounded-md uppercase tracking-wide">
            Draft
          </span>
        </div>
      </div>

      <div className="flex items-center bg-[#f5f6fa] rounded-lg border border-[#e5e7f0] p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${
              activeTab === tab.id
                ? "bg-white text-[#1a1b2e] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                : "text-[#9b9daf] hover:text-[#6c6e82]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button className="px-4 py-1.5 text-[13px] font-medium text-[#1a1b2e] border border-[#e5e7f0] rounded-lg hover:bg-[#f5f6fa] transition-colors flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1b2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Settings
        </button>

        <div className="relative" ref={saveMenuRef}>
          <button
            onClick={() => setSaveMenuOpen(!saveMenuOpen)}
            className="px-4 py-1.5 text-[13px] font-medium text-white bg-[#1a1b2e] rounded-lg hover:bg-[#2d2e42] transition-colors flex items-center gap-2"
          >
            Save
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {saveMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl border border-[#e5e7f0] shadow-[0_4px_16px_rgba(0,0,0,0.1)] py-1.5 px-1 min-w-[180px] z-50">
              <button
                onClick={() => setSaveMenuOpen(false)}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-[#f5f6fa] transition-colors text-left"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9daf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.2 3a2.12 2.12 0 0 1 3 3L6 18.3l-4 1 1-4Z" />
                </svg>
                <span className="text-[13px] font-medium text-[#1a1b2e]">Save draft</span>
              </button>
              <button
                onClick={() => setSaveMenuOpen(false)}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-[#f5f6fa] transition-colors text-left"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9daf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                <span className="text-[13px] font-medium text-[#1a1b2e]">Publish journey</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
