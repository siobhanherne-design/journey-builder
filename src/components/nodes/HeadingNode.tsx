"use client";

import type { NodeProps, Node } from "@xyflow/react";

export type HeadingNodeData = {
  title: string;
  subtitle: string;
};

export type HeadingNodeType = Node<HeadingNodeData, "heading">;

export function HeadingNode({ data }: NodeProps<HeadingNodeType>) {
  return (
    <div className="text-left pointer-events-none select-none">
      <h2 className="text-[22px] font-bold text-[#1a1b2e] mb-1.5">
        {data.title}
      </h2>
      <p className="text-[14px] text-[#9b9daf] leading-relaxed max-w-[300px]">
        {data.subtitle}
      </p>
    </div>
  );
}
