"use client";

import { createContext, useContext } from "react";

export interface ConnectorMenuPos {
  x: number;
  y: number;
}

interface ConnectorContextValue {
  pendingSourceId: string | null;
  menuPos: ConnectorMenuPos | null;
  onConnectorClick: (nodeId: string, pos: ConnectorMenuPos) => void;
}

export const ConnectorContext = createContext<ConnectorContextValue>({
  pendingSourceId: null,
  menuPos: null,
  onConnectorClick: () => {},
});

export function useConnector() {
  return useContext(ConnectorContext);
}
