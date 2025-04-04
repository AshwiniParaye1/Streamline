"use client";

import { ChevronLeft, Minus, Plus, Save } from "lucide-react";
import { useCallback, useState } from "react";
import { LiaTrashAlt } from "react-icons/lia";
import { PiArrowArcLeftBold, PiArrowArcRightBold } from "react-icons/pi";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Edge,
  EdgeTypes,
  Handle,
  HandleType,
  Node,
  NodeTypes,
  Panel,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

// Types
type ActionType = "email" | "apiCall" | "textbox" | null;

type ActionNodeData = {
  label: string;
  actionType: ActionType;
  onNodeDelete: (id: string) => void;
};

// Toolbox Component
const ActionToolbox = ({
  nodeId,
  onActionSelect,
  onClose
}: {
  nodeId: string;
  onActionSelect: (nodeId: string, actionType: ActionType) => void;
  onClose: () => void;
}) => {
  return (
    <div className="absolute top-4 right-4 bg-white border rounded shadow-md p-4 z-10">
      <div className="flex flex-row gap-2">
        {["email", "apiCall", "textbox"].map((type) => (
          <Button
            variant={"outline"}
            key={type}
            className="p-4"
            onClick={() => onActionSelect(nodeId, type as ActionType)}
          >
            {type}
          </Button>
        ))}
      </div>
      <button
        className="mt-4 ml-1 text-gray-600 hover:text-gray-800"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

// Action Node Component
const ActionNode = ({ id, data }: { id: string; data: ActionNodeData }) => {
  const { actionType, onNodeDelete } = data;
  const labelMap = {
    email: "Email",
    apiCall: "API Call",
    textbox: "Textbox"
  };

  return (
    <div className="border border-gray-400 rounded-md p-2 bg-white relative w-60 flex items-center justify-between">
      <Handle type="target" position={Position.Top} />
      <div className="text-center">{labelMap[actionType!] || "Action"}</div>
      <button className="rounded-full p-1" onClick={() => onNodeDelete(id)}>
        <LiaTrashAlt className="w-4 h-4 text-red-500" />
      </button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Circle Node Component
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
      className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg border-4`}
      style={{ borderColor: color }}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-medium`}
        style={{ backgroundColor: color }}
      >
        {label}
      </div>
    </div>
    <Handle type={handleType} position={handlePosition} />
  </div>
);

// Node Types
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
  ),
  actionNode: ActionNode
};

// Initial state for nodes and edges
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

// Flow Diagram Component
function FlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [toolboxNodeId, setToolboxNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const reactFlow = useReactFlow();

  // Save modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");

  // Handle Save: for demo, log details to console
  const handleSave = () => {
    console.log("Flow Name:", flowName);
    console.log("Description:", flowDescription);
    console.log("Nodes:", nodes);
    console.log("Edges:", edges);
    setShowSaveModal(false);
    // Implement your save logic here (e.g. API call)
  };

  // Toolbox selection for action node type
  const handleActionSelect = (nodeId: string, actionType: ActionType) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, actionType } }
          : node
      )
    );
    setToolboxNodeId(null);
  };

  // Delete a node and reconnect its edges
  const handleNodeDelete = (nodeId: string) => {
    const incoming = edges.find((e) => e.target === nodeId);
    const outgoing = edges.find((e) => e.source === nodeId);
    if (incoming && outgoing) {
      const newEdge: Edge = {
        id: `${incoming.source}-${outgoing.target}-${Date.now()}`,
        source: incoming.source,
        target: outgoing.target,
        type: "custom"
      };
      setEdges((eds) => [
        ...eds.filter(
          (e) =>
            e.source !== nodeId &&
            e.target !== nodeId &&
            e.id !== incoming.id &&
            e.id !== outgoing.id
        ),
        newEdge
      ]);
    } else {
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    }
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
  };

  // Custom edge with the + button to add a node in between
  const edgeTypes: EdgeTypes = {
    custom: ({ id, source, target, sourceX, sourceY, targetX, targetY }) => {
      const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
      const centerX = (sourceX + targetX) / 2;
      const centerY = (sourceY + targetY) / 2;

      const handleAddNode = () => {
        const newId = `node-${Date.now()}`;
        const newNode: Node = {
          id: newId,
          type: "actionNode",
          position: { x: centerX - 75, y: centerY - 30 },
          data: {
            label: "New Action",
            actionType: null,
            onNodeDelete: handleNodeDelete
          }
        };

        const newEdge1: Edge = {
          id: `e-${source}-${newId}-${Date.now()}`,
          source,
          target: newId,
          type: "custom"
        };
        const newEdge2: Edge = {
          id: `e-${newId}-${target}-${Date.now()}`,
          source: newId,
          target,
          type: "custom"
        };

        setEdges((eds) =>
          eds.filter((e) => e.id !== id).concat(newEdge1, newEdge2)
        );
        setNodes((nds) => [...nds, newNode]);
        setToolboxNodeId(newId);
      };

      return (
        <>
          <path
            className="react-flow__edge-path stroke-[#4F4F4F] stroke-2"
            d={edgePath}
          />
          <foreignObject
            width={24}
            height={24}
            x={centerX - 12}
            y={centerY - 12}
          >
            <div
              className="w-6 h-6 bg-white border border-[#4F4F4F] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={handleAddNode}
            >
              <Plus className="w-4 h-4" color="#4F4F4F" />
            </div>
          </foreignObject>
        </>
      );
    }
  };

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, type: "custom" }, eds)),
    [setEdges]
  );

  // Zoom handlers
  const onZoomChange = (value: number) => {
    setZoom(value);
    reactFlow.zoomTo(value);
  };
  const onZoomIn = () => onZoomChange(Math.min(zoom + 0.1, 2));
  const onZoomOut = () => onZoomChange(Math.max(zoom - 0.1, 0.5));
  const resetZoom = () => {
    setZoom(1);
    reactFlow.zoomTo(1);
    reactFlow.fitView();
  };

  return (
    <div className="w-full h-screen bg-[#f5f2e8] relative">
      {/* External floating circle (e.g. zoom reset) */}
      <div
        className="absolute top-4 right-4 z-50 w-6 h-6  rounded-full cursor-pointer hover:opacity-90"
        onClick={resetZoom}
      />

      <ReactFlow
        nodes={nodes.map((node) =>
          node.type === "actionNode"
            ? {
                ...node,
                data: { ...node.data, onNodeDelete: handleNodeDelete }
              }
            : node
        )}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background color="#000000" gap={16} size={1} />

        {/* Top Panel */}
        <Panel position="top-left">
          <div className="flex gap-4 items-center justify-between p-4 bg-white border-b w-full">
            <button className="flex items-center text-sm font-semibold underline text-gray-700 hover:text-gray-900">
              <ChevronLeft className="w-4 h-4" />
              Go Back
            </button>
            <div className="text-sm font-semibold">Untitled</div>
            {/* Red Save Button opens the Save Modal */}
            <Button
              variant="ghost"
              className="bg-none flex gap-2 items-center overflow-y-hidden"
              onClick={() => setShowSaveModal(true)}
            >
              <Save className="w-6 h-6" fill="#facc15" />
            </Button>
          </div>
        </Panel>

        <Panel position="bottom-left">
          <div className="flex gap-2">
            <button className="bg-white p-2 rounded-lg shadow hover:bg-gray-50">
              <PiArrowArcLeftBold className="w-4 h-4" color="black" />
            </button>
            <button className="bg-white p-2 rounded-lg shadow hover:bg-gray-50">
              <PiArrowArcRightBold className="w-4 h-4" color="black" />
            </button>
          </div>
        </Panel>

        <Panel position="bottom-right" className="mb-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl">
            <div
              className="w-6 h-6 bg-[#ABCD62] rounded-full cursor-pointer hover:opacity-90"
              onClick={resetZoom}
            ></div>
            <button className="p-2" onClick={onZoomOut}>
              <Minus className="w-4 h-4" color="black" />
            </button>
            <div className="w-32 h-1 bg-gray-300 rounded-full">
              <div
                className="h-1 bg-gray-500 rounded-full transition-all"
                style={{ width: `${((zoom - 0.5) * 100) / 1.5}%` }}
              ></div>
            </div>
            <button className="p-2" onClick={onZoomIn}>
              <Plus className="w-4 h-4" color="black" />
            </button>
          </div>
        </Panel>

        {toolboxNodeId && (
          <ActionToolbox
            nodeId={toolboxNodeId}
            onActionSelect={handleActionSelect}
            onClose={() => setToolboxNodeId(null)}
          />
        )}
      </ReactFlow>

      {/* Save Modal */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your workflow</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4 pb-4">
            {/* added bottom padding */}
            <div>
              <Label htmlFor="flowName" className="mb-3 text-sm font-light">
                Name
              </Label>
              <Input
                id="flowName"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                placeholder="Name here.."
              />
            </div>
            <div className="mb-10">
              <Label htmlFor="flowDesc" className="mb-3 text-sm font-light">
                Description
              </Label>
              <Textarea
                id="flowDesc"
                value={flowDescription}
                onChange={(e) => setFlowDescription(e.target.value)}
                rows={5}
                className="min-h-[120px]"
                placeholder="Write here.."
              />
            </div>
          </div>

          {/* Save button at bottom right */}
          <div className="flex justify-end mt-2">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
