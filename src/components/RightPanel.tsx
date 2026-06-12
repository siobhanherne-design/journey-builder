"use client";

import { useState, type MutableRefObject } from "react";
import type { PanelMode, SavedRuleSummary, TimeDelayConfig, DestinationConfig, Rule, Junction } from "@/lib/types";
import { RuleBuilder } from "./right-panel/RuleBuilder";
import { TimeDelayBuilder } from "./right-panel/TimeDelayBuilder";
import { DestinationBuilder } from "./right-panel/DestinationBuilder";

interface RightPanelProps {
  open: boolean;
  onClose: () => void;
  nodeType: string | null;
  nodeId: string | null;
  nodeData: Record<string, unknown> | null;
  onSave: (data: { summaries: SavedRuleSummary[]; rules: Rule[]; junctions: Junction[] }) => void;
  onSaveTimeDelay: (config: TimeDelayConfig) => void;
  onSaveDestination: (config: DestinationConfig) => void;
  drafts: Record<string, any>;
  unsavedCheckRef: MutableRefObject<(() => boolean) | null>;
  triggerSaveModalRef: MutableRefObject<(() => void) | null>;
}

const nodeTypeToMode: Record<string, PanelMode> = {
  entry_rule: "rule",
  exit_rule: "exit",
  goal: "goal",
};

export function RightPanel({
  open,
  onClose,
  nodeType,
  nodeId,
  nodeData,
  onSave,
  onSaveTimeDelay,
  onSaveDestination,
  drafts,
  unsavedCheckRef,
  triggerSaveModalRef,
}: RightPanelProps) {
  const mode = nodeType ? nodeTypeToMode[nodeType] : null;
  const isTimeDelay = nodeType === "time_delay";
  const isDestination = nodeType === "destination";

  const draft = nodeId ? drafts[nodeId] : undefined;
  const [resetKey, setResetKey] = useState(0);

  const handleCancel = () => {
    if (nodeId) delete drafts[nodeId];
    setResetKey((k) => k + 1);
    onClose();
  };

  return (
    <div
      className={`absolute top-0 right-0 h-full w-[50vw] min-w-[400px] bg-white border-l border-[#e5e7f0] shadow-[-4px_0_16px_rgba(0,0,0,0.04)] z-20 transition-transform duration-200 ease-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {isDestination ? (
        <DestinationBuilder
          key={`${nodeId}-${resetKey}`}
          onClose={onClose}
          onCancel={handleCancel}
          onSave={(config) => {
            if (nodeId) delete drafts[nodeId];
            onSaveDestination(config);
          }}
          initialConfig={draft?.destinationConfig ?? (nodeData?.destinationConfig as DestinationConfig | undefined)}
          onDraftChange={nodeId ? (d) => { drafts[nodeId] = { destinationConfig: d }; } : undefined}
          hasSavedRule={!!(nodeData?.destinationConfig as DestinationConfig | undefined)?.connectors?.length}
          unsavedCheckRef={unsavedCheckRef}
          triggerSaveModalRef={triggerSaveModalRef}
        />
      ) : isTimeDelay ? (
        <TimeDelayBuilder
          key={`${nodeId}-${resetKey}`}
          onClose={onClose}
          onCancel={handleCancel}
          onSave={(config) => {
            if (nodeId) delete drafts[nodeId];
            onSaveTimeDelay(config);
          }}
          initialConfig={draft?.delayConfig ?? (nodeData?.delayConfig as TimeDelayConfig | undefined)}
          onDraftChange={nodeId ? (d) => { drafts[nodeId] = { delayConfig: d }; } : undefined}
          hasSavedRule={!!(nodeData?.delayConfig as TimeDelayConfig | undefined)}
          unsavedCheckRef={unsavedCheckRef}
          triggerSaveModalRef={triggerSaveModalRef}
        />
      ) : mode ? (
        <RuleBuilder
          key={`${nodeId}-${resetKey}`}
          mode={mode}
          onClose={onClose}
          onCancel={handleCancel}
          onSave={(data) => {
            if (nodeId) delete drafts[nodeId];
            onSave(data);
          }}
          initialRules={draft?.rules ?? (nodeData?.fullRules as Rule[] | undefined)}
          initialJunctions={draft?.junctions ?? (nodeData?.fullJunctions as Junction[] | undefined)}
          onDraftChange={nodeId ? (rules, junctions) => { drafts[nodeId] = { rules, junctions }; } : undefined}
          hasSavedRule={!!(nodeData?.fullRules as Rule[] | undefined)?.length}
          unsavedCheckRef={unsavedCheckRef}
          triggerSaveModalRef={triggerSaveModalRef}
        />
      ) : (
        <div className="p-5">
          <p className="text-[13px] text-[#9b9daf]">Select a node to configure</p>
        </div>
      )}
    </div>
  );
}
