"use client";

import { useState, useCallback } from "react";
import { TopBar } from "@/components/TopBar";
import { JourneyCanvas } from "@/components/JourneyCanvas";
import { ReactFlowProvider } from "@xyflow/react";

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleToggleSettings = useCallback(() => {
    setSettingsOpen((prev) => !prev);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <TopBar onSettingsClick={handleToggleSettings} />
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <JourneyCanvas settingsOpen={settingsOpen} onCloseSettings={handleCloseSettings} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
