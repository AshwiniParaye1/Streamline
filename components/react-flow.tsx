"use client";

import {
  ChevronLeft,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  Save
} from "lucide-react";
import { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  type Connection,
  type Edge,
  type EdgeTypes,
  Handle,
  HandleType,
  type Node,
  type NodeTypes,
  Panel,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";

// Updated node types to match the design in the image
const CircleNode = ({
  color,
  label,
  handleType,
  handlePosition
}: {
  color: string;
  label: string;
  handleType: HandleType;
  handlePosition: Position;
}) => (
  <div className="relative flex items-center justify-center w-16 h-16">
    <div
      className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg border-4 border-[${color}]`}
    >
      <div
        className={`w-12 h-12 bg-[${color}] rounded-full flex items-center justify-center`}
      >
        <div className="text-white text-sm font-medium">{label}</div>
      </div>
    </div>
    <Handle type={handleType} position={handlePosition} />
  </div>
);

const nodeTypes: NodeTypes = {
  startNode: ({ data }) => (
    <CircleNode
      color="#84cc16"
      label={data.label}
      handleType="source"
      handlePosition={Position.Bottom}
    />
  ),
  endNode: ({ data }) => (
    <CircleNode
      color="#EE3425"
      label={data.label}
      handleType="target"
      handlePosition={Position.Top}
    />
  )
};

// Update the initial nodes and edges
const initialNodes: Node[] = [
  {
    id: "1",
    type: "startNode",
    data: { label: "Start" },
    position: { x: 350, y: 50 }
  },
  {
    id: "2",
    type: "endNode",
    data: { label: "End" },
    position: { x: 350, y: 250 }
  }
];

const initialEdges: Edge[] = [
  { id: "1-2", source: "1", target: "2", type: "custom" }
];

function FlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [zoom, setZoom] = useState(1);
  const reactFlowInstance = useReactFlow();

  // Add custom edge type with plus button
  const edgeTypes: EdgeTypes = {
    custom: ({ id, source, target, sourceX, sourceY, targetX, targetY }) => {
      const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
      const centerX = (sourceX + targetX) / 2;
      const centerY = (sourceY + targetY) / 2;

      const handleAddNode = () => {
        // Create new node at the midpoint
        const newNode = {
          id: `node-${Date.now()}`,
          type: "actionNode",
          data: { label: "New Action" },
          position: { x: centerX - 75, y: centerY - 30 }
        };

        // Create two new edges
        const newEdge1 = {
          id: `edge-${Date.now()}-1`,
          source: source,
          target: newNode.id,
          type: "custom"
        };

        const newEdge2 = {
          id: `edge-${Date.now()}-2`,
          source: newNode.id,
          target: target,
          type: "custom"
        };

        // Update state - add the new node and replace the edge
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [
          ...eds.filter((e) => e.id !== id), // Remove the original edge
          newEdge1,
          newEdge2
        ]);
      };

      return (
        <>
          <path
            id={id}
            className="react-flow__edge-path stroke-[##4F4F4F] stroke-2"
            d={edgePath}
          />
          <foreignObject
            width={24}
            height={24}
            x={centerX - 12}
            y={centerY - 12}
            className="flex items-center justify-center"
          >
            <div
              className="flex items-center justify-center w-6 h-6 bg-white border rounded-full border-[#4F4F4F] cursor-pointer hover:bg-gray-50"
              onClick={handleAddNode}
            >
              <Plus className="w-4 h-4" color="#4F4F4F" />
            </div>
          </foreignObject>
        </>
      );
    }
  };

  // Handle connections
  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, type: "custom" }, eds)),
    [setEdges]
  );

  const onZoomChange = (value: number) => {
    setZoom(value);
    reactFlowInstance.zoomTo(value);
  };

  const onZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 2);
    onZoomChange(newZoom);
  };

  const onZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.5);
    onZoomChange(newZoom);
  };

  const resetZoom = () => {
    setZoom(1);
    reactFlowInstance.zoomTo(1);
    reactFlowInstance.fitView();
  };

  return (
    <div className="w-full h-screen bg-[#f5f2e8]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background color="#000000" gap={16} size={1} />
        <Panel position="top-left">
          <div className="flex gap-4 items-center justify-between p-4 bg-white border-b w-full">
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <ChevronLeft className="w-4 h-4" />
              Go Back
            </button>
            <div className="text-lg font-medium">Untitled</div>
            <button className="text-gray-700 hover:text-gray-900">
              <Save className="w-5 h-5" />
            </button>
          </div>
        </Panel>

        <Panel position="bottom-left">
          <div className="flex gap-2">
            <button className="bg-white p-2 rounded-lg shadow hover:bg-gray-50">
              <RotateCcw className="w-4 h-4" color="black" />
            </button>
            <button className="bg-white p-2 rounded-lg shadow hover:bg-gray-50">
              <RotateCw className="w-4 h-4" color="black" />
            </button>
          </div>
        </Panel>

        <Panel position="bottom-right" className="mb-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl">
            <div
              className="w-6 h-6 bg-[#8ba870] rounded-full cursor-pointer hover:opacity-90"
              onClick={resetZoom}
            ></div>
            <button
              className="bg-white p-2 rounded-lg shadow hover:bg-gray-50"
              onClick={onZoomOut}
            >
              <Minus className="w-4 h-4" color="black" />
            </button>
            <div className="w-32 h-1 bg-gray-300 rounded-full">
              <div
                className="h-1 bg-gray-500 rounded-full transition-all"
                style={{ width: `${((zoom - 0.5) * 100) / 1.5}%` }}
              ></div>
            </div>
            <button
              className="bg-white p-2 rounded-lg shadow hover:bg-gray-50"
              onClick={onZoomIn}
            >
              <Plus className="w-4 h-4" color="black" />
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function Component() {
  return (
    <ReactFlowProvider>
      <FlowDiagram />
    </ReactFlowProvider>
  );
}
