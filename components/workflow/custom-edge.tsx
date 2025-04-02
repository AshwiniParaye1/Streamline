import { Plus } from "lucide-react";
import { type EdgeProps, getSmoothStepPath } from "reactflow";

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {}
}: EdgeProps) {
  const [edgePath, centerX, centerY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={1.5}
        stroke="#b1b1b7"
      />
      <foreignObject
        width={30}
        height={30}
        x={centerX - 15}
        y={centerY - 15}
        className="edgebutton-foreignobject"
      >
        <div className="add-node-button">
          <Plus className="h-4 w-4" />
        </div>
      </foreignObject>
    </>
  );
}
