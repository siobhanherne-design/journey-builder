"use client";

import type { Junction } from "@/lib/types";

interface AndOrToggleProps {
  value: Junction;
  onChange: (value: Junction) => void;
}

export function AndOrToggle({ value, onChange }: AndOrToggleProps) {
  return (
    <div className="flex items-center justify-start py-2">
      <div className="flex items-center rounded-lg border border-[#e5e7f0] bg-[#f9fafb]">
        <button
          onClick={() => onChange("AND")}
          className={`px-3.5 py-1 text-[12px] font-semibold rounded-md transition-all ${
            value === "AND"
              ? "bg-white text-[#4f46e5] border border-[#e5e7f0] shadow-[0_1px_2px_rgba(0,0,0,0.06)] -m-px"
              : "text-[#9b9daf] hover:text-[#6c6e82]"
          }`}
        >
          AND
        </button>
        <button
          onClick={() => onChange("OR")}
          className={`px-3.5 py-1 text-[12px] font-semibold rounded-md transition-all ${
            value === "OR"
              ? "bg-white text-[#4f46e5] border border-[#e5e7f0] shadow-[0_1px_2px_rgba(0,0,0,0.06)] -m-px"
              : "text-[#9b9daf] hover:text-[#6c6e82]"
          }`}
        >
          OR
        </button>
      </div>
    </div>
  );
}
