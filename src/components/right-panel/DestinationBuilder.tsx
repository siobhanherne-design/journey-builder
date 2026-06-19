"use client";

import { useState, useEffect, useRef, useCallback, type MutableRefObject } from "react";
import type { DestinationConfig, DestinationConnector } from "@/lib/types";
import { createEmptyConnector } from "@/lib/types";
import { destinationPlatforms, destinationAccounts } from "@/lib/mock-data";
import { CloseIcon, PlusIcon, CopyIcon, TrashIcon, ChevronDownIcon } from "./icons";

interface DestinationBuilderProps {
  onClose: () => void;
  onCancel: () => void;
  onSave: (config: DestinationConfig) => void;
  initialConfig?: DestinationConfig;
  onDraftChange?: (config: DestinationConfig) => void;
  hasSavedRule?: boolean;
  unsavedCheckRef?: MutableRefObject<(() => boolean) | null>;
  triggerSaveModalRef?: MutableRefObject<(() => void) | null>;
}

function PlatformIcon({ platformId }: { platformId: string }) {
  const platform = destinationPlatforms.find((p) => p.id === platformId);
  if (!platform) return null;

  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: platform.color }}
    >
      <span className="text-[9px] font-bold text-white leading-none">
        {platform.label.charAt(0)}
      </span>
    </div>
  );
}

function ConnectorRow({
  connector,
  onChange,
  onDuplicate,
  onDelete,
  showDelete,
}: {
  connector: DestinationConnector;
  onChange: (updated: DestinationConnector) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  showDelete: boolean;
}) {
  const accounts = connector.platformId
    ? destinationAccounts[connector.platformId] || []
    : [];

  return (
    <div className="rounded-xl border border-[#e5e7f0] bg-white overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] text-[#9b9daf] whitespace-nowrap">
            Send Audience to
          </span>

          <div className="relative">
            <div className="flex items-center">
              {connector.platformId && (
                <div className="absolute left-2.5 z-10 pointer-events-none">
                  <PlatformIcon platformId={connector.platformId} />
                </div>
              )}
              <select
                value={connector.platformId}
                onChange={(e) =>
                  onChange({ ...connector, platformId: e.target.value, accountId: "" })
                }
                className={`appearance-none rounded-md ${
                  connector.platformId ? "pl-9 bg-[#fbfbfb] border border-[#e5e7f0]" : "pl-3 bg-white border border-[#e5e7f0]"
                } pr-7 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5]/40 transition-all cursor-pointer`}
              >
                <option value="" disabled>
                  Select platform
                </option>
                {destinationPlatforms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b9daf] pointer-events-none" />
            </div>
          </div>

          <div className="relative flex-1 min-w-[180px]">
            <select
              value={connector.accountId}
              onChange={(e) =>
                onChange({ ...connector, accountId: e.target.value })
              }
              disabled={!connector.platformId}
              className={`w-full appearance-none rounded-md pl-3 pr-7 py-1.5 text-[12px] text-[#1a1b2e] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5]/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                connector.accountId ? "bg-[#fbfbfb] border border-[#e5e7f0]" : "bg-white border border-[#e5e7f0]"
              }`}
            >
              <option value="" disabled>
                Select account
              </option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b9daf] pointer-events-none" />
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={onDuplicate}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f5f6fa] text-[#9b9daf] hover:text-[#6c6e82] transition-colors"
            >
              <CopyIcon />
            </button>
            {showDelete && (
              <button
                onClick={onDelete}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f5f6fa] text-[#9b9daf] hover:text-[#6c6e82] transition-colors"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DestinationBuilder({
  onClose,
  onCancel,
  onSave,
  initialConfig,
  onDraftChange,
  hasSavedRule,
  unsavedCheckRef,
  triggerSaveModalRef,
}: DestinationBuilderProps) {
  const [connectors, setConnectors] = useState<DestinationConnector[]>(
    initialConfig?.connectors?.length
      ? initialConfig.connectors
      : [createEmptyConnector()],
  );
  const mountedRef = useRef(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const savedStateRef = useRef(JSON.stringify(initialConfig || {}));

  const hasUnsavedChanges = useCallback(() => {
    if (!hasSavedRule) return false;
    return JSON.stringify({ connectors }) !== savedStateRef.current;
  }, [connectors, hasSavedRule]);

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges()) {
      setShowUnsavedModal(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  useEffect(() => {
    if (unsavedCheckRef) unsavedCheckRef.current = hasUnsavedChanges;
    if (triggerSaveModalRef) triggerSaveModalRef.current = () => setShowUnsavedModal(true);
    return () => {
      if (unsavedCheckRef) unsavedCheckRef.current = null;
      if (triggerSaveModalRef) triggerSaveModalRef.current = null;
    };
  }, [hasUnsavedChanges, unsavedCheckRef, triggerSaveModalRef]);

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    onDraftChange?.({ connectors });
  }, [connectors, onDraftChange]);

  const handleChange = (index: number, updated: DestinationConnector) => {
    const next = [...connectors];
    next[index] = updated;
    setConnectors(next);
  };

  const handleAdd = () => {
    setConnectors([...connectors, createEmptyConnector()]);
  };

  const handleDuplicate = (index: number) => {
    const clone: DestinationConnector = {
      ...connectors[index],
      id: Date.now() + Math.random(),
    };
    const next = [...connectors];
    next.splice(index + 1, 0, clone);
    setConnectors(next);
  };

  const handleDelete = (index: number) => {
    if (connectors.length <= 1) return;
    setConnectors(connectors.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ connectors });
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-2 border-b border-[#e5e7f0] flex-shrink-0">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-[#1a1b2e]">Destination</h2>
            <p className="text-[12px] text-[#9b9daf]">
              Choose where to activate this audience.
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f5f6fa] text-[#9b9daf] hover:text-[#6c6e82] transition-colors mt-0.5"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto picker-scroll px-5 py-4 space-y-3 bg-[#FBFBFB]">
        {connectors.map((connector, index) => (
          <ConnectorRow
            key={connector.id}
            connector={connector}
            onChange={(updated) => handleChange(index, updated)}
            onDuplicate={() => handleDuplicate(index)}
            onDelete={() => handleDelete(index)}
            showDelete={connectors.length > 1}
          />
        ))}

        <div className="pt-1">
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium text-[#1a1b2e] border border-[#e5e7f0] rounded-md hover:bg-[#1a1b2e] hover:text-white transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add connector
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-5 py-4 border-t border-[#e5e7f0] flex-shrink-0">
        <button
          onClick={onCancel}
          className="flex-1 py-2 text-[12px] font-medium text-[#1a1b2e] border border-[#e5e7f0] rounded-md hover:bg-[#1a1b2e] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-2 text-[12px] font-medium text-white bg-[#4f46e5] rounded-md hover:bg-[#4338ca] active:bg-[#3730a3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30"
        >
          Save rule
        </button>
      </div>

      {showUnsavedModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl border border-[#e5e7f0] shadow-[0_4px_24px_rgba(0,0,0,0.12)] p-6 mx-6 max-w-sm w-full">
            <h3 className="text-[14px] font-bold text-[#1a1b2e] mb-1">Save changes?</h3>
            <p className="text-[12px] text-[#6c6e82] mb-5">You have unsaved changes. Would you like to save them before closing?</p>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowUnsavedModal(false); onCancel(); }}
                className="flex-1 px-4 py-2 text-[12px] font-medium text-[#1a1b2e] border border-[#e5e7f0] rounded-md hover:bg-[#1a1b2e] hover:text-white transition-colors"
              >
                No, cancel updates
              </button>
              <button
                onClick={() => { handleSave(); setShowUnsavedModal(false); }}
                className="flex-1 px-4 py-2 text-[12px] font-medium text-white bg-[#4f46e5] rounded-md hover:bg-[#4338ca] transition-colors"
              >
                Yes, save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
