"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import type { SavedRuleSummary, TimeDelayConfig, DestinationConfig, Rule, Junction } from "@/lib/types";
import type { SplitPath } from "./nodes/SplitNode";
import { ConnectorContext, type ConnectorMenuPos } from "./ConnectorContext";
import {
  ReactFlow,
  Background,
  MiniMap,
  Panel,
  MarkerType,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useViewport,
  ReactFlowProvider,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import {
  AudienceNode,
  EntryRuleNode,
  ExitRuleNode,
  TimeDelayNode,
  SplitNode,
  GoalNode,
  DestinationNode,
  HeadingNode,
} from "./nodes";
import { StepPalette, StepMenu, stepMenuItems } from "./StepPalette";
import { RightPanel } from "./RightPanel";

const nodeTypes = {
  heading: HeadingNode,
  audience: AudienceNode,
  entry_rule: EntryRuleNode,
  exit_rule: ExitRuleNode,
  time_delay: TimeDelayNode,
  split: SplitNode,
  goal: GoalNode,
  destination: DestinationNode,
};

const defaultLabels: Record<string, string> = {
  audience: "Audience",
  entry_rule: "Entry Rule",
  exit_rule: "Exit Rule",
  time_delay: "Time Delay",
  split: "A/B Split",
  goal: "Goal",
  destination: "Destination",
};

const initialNodes: Node[] = [
  {
    id: "heading",
    type: "heading",
    position: { x: 260, y: 80 },
    data: {
      title: "Start your customer journey",
      subtitle:
        "Guide profiles through actions triggered by events, timing, or profile changes.",
    },
    selectable: false,
    draggable: false,
  },
  {
    id: "entry-1",
    type: "entry_rule",
    position: { x: 260, y: 200 },
    data: { label: "Add entry rule", stepLabel: "Step 1" },
  },
];

const edgeDefaults = {
  style: { stroke: "#a5b4fc", strokeWidth: 1.5, strokeDasharray: "8 6" },
  type: "default" as const,
  markerEnd: { type: MarkerType.ArrowClosed, color: "#a5b4fc" },
};

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;

let edgeSeq = 0;
let nodeSeq = 0;
function getNextNodeId() {
  return `n-${Date.now()}-${nodeSeq++}`;
}
function getNextEdgeId(source: string, target: string) {
  return `e-${source}-${target}-${edgeSeq++}`;
}

const PANEL_NODE_TYPES = new Set(["entry_rule", "exit_rule", "goal", "time_delay", "destination"]);
const SNAP_GRID: [number, number] = [16, 16];

const MINIMAP_NODE_COLOR: Record<string, string> = {
  entry_rule: "#3b82f6",
  exit_rule: "#ef4444",
  time_delay: "#d97706",
  split: "#d97706",
  goal: "#22c55e",
  destination: "#22c55e",
  audience: "#3b82f6",
  heading: "transparent",
};

function ZoomControls() {
  const { zoomIn, zoomOut, fitView, zoomTo } = useReactFlow();
  const { zoom } = useViewport();
  const pct = Math.round(zoom * 100);

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-[#e5e7f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <button
        onClick={() => zoomOut({ duration: 200 })}
        className="w-8 h-8 flex items-center justify-center text-[#6c6e82] hover:bg-[#f5f6fa] transition-colors"
        title="Zoom out"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button
        onClick={() => zoomTo(1, { duration: 200 })}
        className="w-10 h-8 flex items-center justify-center text-[11px] font-medium text-[#1a1b2e] hover:bg-[#f5f6fa] transition-colors border-x border-[#e5e7f0]"
        title="Reset to 100%"
      >
        {pct}%
      </button>
      <button
        onClick={() => zoomIn({ duration: 200 })}
        className="w-8 h-8 flex items-center justify-center text-[#6c6e82] hover:bg-[#f5f6fa] transition-colors"
        title="Zoom in"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button
        onClick={() => fitView({ padding: 0.15, duration: 300, includeHiddenNodes: false })}
        className="w-8 h-8 flex items-center justify-center text-[#6c6e82] hover:bg-[#f5f6fa] transition-colors border-l border-[#e5e7f0]"
        title="Fit to screen"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      </button>
    </div>
  );
}

function ReturnToJourneyButton() {
  const { fitView, getNodes } = useReactFlow();
  const { x: vx, y: vy, zoom } = useViewport();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const contentNodes = getNodes().filter((n) => n.type !== "heading");
    if (contentNodes.length === 0) { setVisible(false); return; }

    const vpWidth = window.innerWidth / zoom;
    const vpHeight = window.innerHeight / zoom;
    const vpLeft = -vx / zoom;
    const vpTop = -vy / zoom;
    const vpRight = vpLeft + vpWidth;
    const vpBottom = vpTop + vpHeight;

    const anyVisible = contentNodes.some((n) => {
      const w = n.measured?.width ?? 220;
      const h = n.measured?.height ?? 60;
      return (
        n.position.x + w > vpLeft &&
        n.position.x < vpRight &&
        n.position.y + h > vpTop &&
        n.position.y < vpBottom
      );
    });

    setVisible(!anyVisible);
  }, [vx, vy, zoom, getNodes]);

  if (!visible) return null;

  return (
    <button
      onClick={() => fitView({ padding: 0.15, duration: 300 })}
      className="flex items-center gap-2 rounded-lg border border-[#e5e7f0] bg-white px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-[13px] font-medium text-[#1a1b2e] hover:bg-[#f5f6fa] transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c5cfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m8 12 4-4 4 4" />
        <path d="M12 16V8" />
      </svg>
      Return to journey
    </button>
  );
}

const PALETTE_WIDTH = 200;
const PANEL_RATIO = 0.5;

function JourneyCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { setViewport, getViewport } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [showHeading, setShowHeading] = useState(true);
  const [pendingSourceId, setPendingSourceId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<ConnectorMenuPos | null>(null);
  const [minimapOpen, setMinimapOpen] = useState(true);
  const draftsRef = useRef<Record<string, any>>({});

  const panToNode = useCallback(
    (position: { x: number; y: number }, nodeWidth = 220, nodeHeight = 60) => {
      const { zoom } = getViewport();
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const panelW = Math.max(400, screenW * PANEL_RATIO);
      const visibleW = screenW - panelW - PALETTE_WIDTH;
      const centerScreenX = PALETTE_WIDTH + visibleW / 2;
      const centerScreenY = screenH / 2;
      const nodeCenterX = position.x + nodeWidth / 2;
      const nodeCenterY = position.y + nodeHeight / 2;
      setViewport(
        { x: centerScreenX - nodeCenterX * zoom, y: centerScreenY - nodeCenterY * zoom, zoom },
        { duration: 300 },
      );
    },
    [getViewport, setViewport],
  );
  const [edgeInsertMenu, setEdgeInsertMenu] = useState<{
    edgeId: string;
    position: { x: number; y: number };
    sourceNode: string;
    targetNode: string;
    sourceHandle?: string;
  } | null>(null);

  const onConnectorClick = useCallback((nodeId: string, pos: ConnectorMenuPos) => {
    setPendingSourceId((prev) => {
      if (prev === nodeId) {
        setMenuPos(null);
        return null;
      }
      setMenuPos(pos);
      return nodeId;
    });
  }, []);

  const connectorValue = useMemo(
    () => ({ pendingSourceId, menuPos, onConnectorClick }),
    [pendingSourceId, menuPos, onConnectorClick],
  );

  const dismissHeading = useCallback(() => {
    if (!showHeading) return;
    setShowHeading(false);
    setNodes((nds) => nds.filter((n) => n.id !== "heading"));
  }, [showHeading, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, ...edgeDefaults }, eds));
    },
    [setEdges],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const rawType = event.dataTransfer.getData("application/reactflow");
      if (!rawType || !reactFlowInstance || !reactFlowWrapper.current) return;
      const type = rawType === "experiment" ? "split" : rawType;

      const raw = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const position = {
        x: Math.round(raw.x / SNAP_GRID[0]) * SNAP_GRID[0],
        y: Math.round(raw.y / SNAP_GRID[1]) * SNAP_GRID[1],
      };

      const newId = getNextNodeId();

      const newNode: Node = {
        id: newId,
        type,
        position,
        data: { label: defaultLabels[type] || "New Step" },
      };

      setNodes((nds) => {
        const candidates = nds.filter((n) => n.type !== "heading");
        let bestNode: Node | null = null;
        let bestDist = Infinity;

        for (const n of candidates) {
          const w = n.measured?.width ?? 220;
          const h = n.measured?.height ?? 60;
          const rightX = n.position.x + w;
          const centerY = n.position.y + h / 2;

          if (rightX > position.x + 40) continue;

          const dx = position.x - rightX;
          const dy = position.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < bestDist) {
            bestDist = dist;
            bestNode = n;
          }
        }

        if (bestNode) {
          let sourceHandle: string | undefined;
          if (bestNode.type === "split") {
            const paths: SplitPath[] = (bestNode.data as any)?.paths || [
              { id: "a", label: "Path A", percentage: 50 },
              { id: "b", label: "Path B", percentage: 50 },
            ];
            const h = bestNode!.measured?.height ?? 60;
            const pathSpacing = h / (paths.length + 1);
            let bestPathDist = Infinity;
            for (let pi = 0; pi < paths.length; pi++) {
              const pathY = bestNode!.position.y + pathSpacing * (pi + 1);
              const dy = Math.abs(position.y - pathY);
              if (dy < bestPathDist) {
                bestPathDist = dy;
                sourceHandle = paths[pi].id;
              }
            }
          }

          const edge: Edge = {
            id: getNextEdgeId(bestNode.id, newId),
            source: bestNode.id,
            target: newId,
            ...(sourceHandle ? { sourceHandle } : {}),
            ...edgeDefaults,
          };
          setEdges((eds) => [...eds, edge]);
        }

        return [...nds, newNode];
      });

      dismissHeading();
    },
    [reactFlowInstance, setNodes, setEdges, dismissHeading],
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      if (selectedNodes.length === 1) {
        const node = selectedNodes[0];
        const type = node.type || null;
        setSelectedNodeId(node.id);
        setSelectedNodeType(type);
        if (type && PANEL_NODE_TYPES.has(type)) {
          setRightPanelOpen(true);
          dismissHeading();
        } else {
          setRightPanelOpen(false);
        }
      } else {
        setSelectedNodeId(null);
        setSelectedNodeType(null);
        setRightPanelOpen(false);
      }
    },
    [dismissHeading],
  );

  const selectedNodeData = selectedNodeId
    ? (nodes.find((n) => n.id === selectedNodeId)?.data as Record<string, unknown> | undefined) ?? null
    : null;

  const handleRuleSave = useCallback(
    ({ summaries, rules, junctions }: { summaries: SavedRuleSummary[]; rules: Rule[]; junctions: Junction[] }) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNodeId
            ? { ...n, data: { ...n.data, savedRules: summaries, fullRules: rules, fullJunctions: junctions } }
            : n,
        ),
      );
    },
    [selectedNodeId, setNodes],
  );

  const handlePaletteStepClick = useCallback(
    (rawType: string) => {
      const stepType = rawType === "experiment" ? "split" : rawType;

      let sourceId = pendingSourceId;
      let sourceHandle: string | undefined;

      if (sourceId && sourceId.includes("__")) {
        const parts = sourceId.split("__");
        sourceId = parts[0];
        sourceHandle = parts[1];
      }

      if (!sourceId) {
        const sourceIds = new Set(edges.map((e) => e.source));
        const candidates = nodes.filter((n) => n.type !== "heading");
        const leafNodes = candidates.filter((n) => !sourceIds.has(n.id));
        const best = leafNodes.length > 0 ? leafNodes[0] : candidates[candidates.length - 1];
        if (!best) return;
        sourceId = best.id;
      }

      const sourceNode = nodes.find((n) => n.id === sourceId);
      if (!sourceNode) {
        setPendingSourceId(null);
        setMenuPos(null);
        return;
      }

      const sourceW = sourceNode.measured?.width ?? 220;
      const gap = 64;

      const position = {
        x: Math.round((sourceNode.position.x + sourceW + gap) / SNAP_GRID[0]) * SNAP_GRID[0],
        y: sourceNode.position.y,
      };

      const newId = getNextNodeId();

      const edge: Edge = {
        id: getNextEdgeId(sourceId, newId),
        source: sourceId,
        target: newId,
        ...(sourceHandle ? { sourceHandle } : {}),
        ...edgeDefaults,
      };

      setNodes((nds) => [
        ...nds.map((n) => ({ ...n, selected: false })),
        {
          id: newId,
          type: stepType,
          position,
          selected: true,
          data: { label: defaultLabels[stepType] || "New Step" },
        },
      ]);
      setEdges((eds) => [...eds, edge]);
      setPendingSourceId(null);
      setMenuPos(null);

      setSelectedNodeId(newId);
      setSelectedNodeType(stepType);
      if (PANEL_NODE_TYPES.has(stepType)) {
        setRightPanelOpen(true);
        setTimeout(() => panToNode(position), 50);
      }

      dismissHeading();
    },
    [pendingSourceId, nodes, edges, setNodes, setEdges, dismissHeading, panToNode],
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      if (connection.source === connection.target) return false;
      const targetHasConnection = edges.some(
        (e) => e.target === connection.target && (e.targetHandle || null) === (connection.targetHandle || null),
      );
      if (targetHasConnection) return false;
      const sourceHandleId = connection.sourceHandle || null;
      const sourceHasConnection = edges.some(
        (e) => e.source === connection.source && (e.sourceHandle || null) === sourceHandleId,
      );
      if (sourceHasConnection) return false;
      return true;
    },
    [edges],
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode || !reactFlowInstance) return;

      const sourceW = sourceNode.measured?.width ?? 220;
      const sourceH = sourceNode.measured?.height ?? 60;
      const targetH = targetNode.measured?.height ?? 60;

      const midX = (sourceNode.position.x + sourceW + targetNode.position.x) / 2;
      const midY = (sourceNode.position.y + sourceH / 2 + targetNode.position.y + targetH / 2) / 2;

      const screenPos = reactFlowInstance.flowToScreenPosition({ x: midX, y: midY });

      setEdgeInsertMenu({
        edgeId: edge.id,
        position: screenPos,
        sourceNode: edge.source,
        targetNode: edge.target,
        sourceHandle: edge.sourceHandle ?? undefined,
      });
    },
    [nodes, reactFlowInstance],
  );

  const handleEdgeInsertStepClick = useCallback(
    (rawType: string) => {
      if (!edgeInsertMenu) return;
      const stepType = rawType === "experiment" ? "split" : rawType;

      const sourceNode = nodes.find((n) => n.id === edgeInsertMenu.sourceNode);
      const targetNode = nodes.find((n) => n.id === edgeInsertMenu.targetNode);
      if (!sourceNode || !targetNode) { setEdgeInsertMenu(null); return; }

      const sourceW = sourceNode.measured?.width ?? 220;
      const midX = (sourceNode.position.x + sourceW + targetNode.position.x) / 2;
      const midY = (sourceNode.position.y + targetNode.position.y) / 2;

      const position = {
        x: Math.round(midX / SNAP_GRID[0]) * SNAP_GRID[0],
        y: Math.round(midY / SNAP_GRID[1]) * SNAP_GRID[1],
      };

      const newId = getNextNodeId();

      const edge1: Edge = {
        id: getNextEdgeId(edgeInsertMenu.sourceNode, newId),
        source: edgeInsertMenu.sourceNode,
        target: newId,
        ...(edgeInsertMenu.sourceHandle ? { sourceHandle: edgeInsertMenu.sourceHandle } : {}),
        ...edgeDefaults,
      };

      const edge2: Edge = {
        id: getNextEdgeId(newId, edgeInsertMenu.targetNode),
        source: newId,
        target: edgeInsertMenu.targetNode,
        ...edgeDefaults,
      };

      setEdges((eds) => [...eds.filter((e) => e.id !== edgeInsertMenu.edgeId), edge1, edge2]);
      setNodes((nds) => [
        ...nds.map((n) => ({ ...n, selected: false })),
        {
          id: newId,
          type: stepType,
          position,
          selected: true,
          data: { label: defaultLabels[stepType] || "New Step" },
        },
      ]);

      setSelectedNodeId(newId);
      setSelectedNodeType(stepType);
      if (stepType !== "split" && PANEL_NODE_TYPES.has(stepType)) {
        setRightPanelOpen(true);
        setTimeout(() => panToNode(position), 50);
      }

      setEdgeInsertMenu(null);
      dismissHeading();
    },
    [edgeInsertMenu, nodes, setNodes, setEdges, dismissHeading, panToNode],
  );

  const onPaneClick = useCallback(() => {
    setPendingSourceId(null);
    setMenuPos(null);
    setEdgeInsertMenu(null);
  }, []);

  const handleTimeDelaySave = useCallback(
    (config: TimeDelayConfig) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNodeId
            ? { ...n, data: { ...n.data, delayConfig: config } }
            : n,
        ),
      );
    },
    [selectedNodeId, setNodes],
  );

  const handleDestinationSave = useCallback(
    (config: DestinationConfig) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNodeId
            ? { ...n, data: { ...n.data, destinationConfig: config } }
            : n,
        ),
      );
    },
    [selectedNodeId, setNodes],
  );

  const edgesWithLabels = useMemo(() => {
    return edges.map((edge) => {
      if (!edge.sourceHandle) return edge;
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (!sourceNode || sourceNode.type !== "split") return edge;
      const paths: SplitPath[] = (sourceNode.data as any)?.paths || [
        { id: "a", label: "Path A", percentage: 50 },
        { id: "b", label: "Path B", percentage: 50 },
      ];
      const path = paths.find((p) => p.id === edge.sourceHandle);
      if (!path) return edge;
      return { ...edge, label: `${path.percentage}%` };
    });
  }, [edges, nodes]);

  return (
    <ConnectorContext.Provider value={connectorValue}>
    <div className="flex-1 h-full relative overflow-hidden">
      <div ref={reactFlowWrapper} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edgesWithLabels}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          onEdgeClick={onEdgeClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onSelectionChange={onSelectionChange}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          snapToGrid
          snapGrid={SNAP_GRID}
          panOnScroll
          panOnScrollMode={"free" as any}
          zoomOnScroll={false}
          zoomOnPinch
          selectionOnDrag={false}
          selectNodesOnDrag={false}
          deleteKeyCode={["Backspace", "Delete"]}
          defaultEdgeOptions={edgeDefaults}
          style={{ background: "#F7F7F9" }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="#C0C0C8"
            gap={16}
            size={1}
            variant={"dots" as any}
          />
          <Panel position="bottom-left">
            <ZoomControls />
          </Panel>
          <Panel position="top-center">
            <ReturnToJourneyButton />
          </Panel>
          {minimapOpen && (
            <MiniMap
              position="bottom-right"
              pannable
              zoomable
              nodeColor={(node) => MINIMAP_NODE_COLOR[node.type || ""] || "#a5b4fc"}
              maskColor="rgba(245, 246, 250, 0.7)"
              style={{ width: 160, height: 100 }}
            />
          )}
          <Panel position="bottom-right" style={{ marginBottom: minimapOpen ? 115 : 0 }}>
            <button
              onClick={() => setMinimapOpen(!minimapOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#e5e7f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[#6c6e82] hover:bg-[#f5f6fa] transition-colors"
              title={minimapOpen ? "Hide minimap" : "Show minimap"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </button>
          </Panel>
        </ReactFlow>
      </div>

      {!pendingSourceId && <StepPalette onStepClick={handlePaletteStepClick} />}

      {pendingSourceId && menuPos && (
        <div
          className="fixed z-50 bg-white rounded-xl border border-[#e5e7f0] shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-1.5 px-1"
          style={{ left: menuPos.x, top: menuPos.y, transform: "translateY(-50%)" }}
        >
          <StepMenu items={stepMenuItems} onStepClick={handlePaletteStepClick} />
        </div>
      )}

      {edgeInsertMenu && (
        <div
          className="fixed z-50 bg-white rounded-xl border border-[#e5e7f0] shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-1.5 px-1"
          style={{
            left: edgeInsertMenu.position.x,
            top: edgeInsertMenu.position.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <StepMenu items={stepMenuItems} onStepClick={handleEdgeInsertStepClick} />
        </div>
      )}
      <RightPanel
        open={rightPanelOpen}
        onClose={() => setRightPanelOpen(false)}
        nodeType={selectedNodeType}
        nodeId={selectedNodeId}
        nodeData={selectedNodeData}
        onSave={handleRuleSave}
        onSaveTimeDelay={handleTimeDelaySave}
        onSaveDestination={handleDestinationSave}
        drafts={draftsRef.current}
      />
    </div>
    </ConnectorContext.Provider>
  );
}

export function JourneyCanvas() {
  return (
    <ReactFlowProvider>
      <JourneyCanvasInner />
    </ReactFlowProvider>
  );
}
