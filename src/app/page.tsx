"use client";

import { TopBar } from "@/components/TopBar";
import { JourneyCanvas } from "@/components/JourneyCanvas";
import { ReactFlowProvider } from "@xyflow/react";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <TopBar />
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <JourneyCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
