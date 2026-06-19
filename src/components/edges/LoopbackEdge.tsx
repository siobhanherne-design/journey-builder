"use client";

import { type EdgeProps, BaseEdge, MarkerType } from "@xyflow/react";

export function LoopbackEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
}: EdgeProps) {
  const offsetY = 60;
  const cornerRadius = 16;

  const topY = Math.min(sourceY, targetY) - offsetY;

  const path = [
    `M ${sourceX} ${sourceY}`,
    `L ${sourceX + cornerRadius} ${sourceY}`,
    `Q ${sourceX + cornerRadius * 2} ${sourceY} ${sourceX + cornerRadius * 2} ${sourceY - cornerRadius}`,
    `L ${sourceX + cornerRadius * 2} ${topY + cornerRadius}`,
    `Q ${sourceX + cornerRadius * 2} ${topY} ${sourceX + cornerRadius} ${topY}`,
    `L ${targetX - cornerRadius} ${topY}`,
    `Q ${targetX - cornerRadius * 2} ${topY} ${targetX - cornerRadius * 2} ${topY + cornerRadius}`,
    `L ${targetX - cornerRadius * 2} ${targetY - cornerRadius}`,
    `Q ${targetX - cornerRadius * 2} ${targetY} ${targetX - cornerRadius} ${targetY}`,
    `L ${targetX} ${targetY}`,
  ].join(" ");

  return (
    <BaseEdge
      id={id}
      path={path}
      style={style}
      markerEnd={markerEnd}
    />
  );
}
