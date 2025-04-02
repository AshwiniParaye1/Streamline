/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { DeleteWorkflowModal } from "@/components/modals/delete-workflow-modal";
import { ExecuteWorkflowModal } from "@/components/modals/execute-workflow-modal";
import { SaveWorkflowModal } from "@/components/modals/save-workflow-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CustomEdge } from "@/components/workflow/custom-edge";
import { EndNode } from "@/components/workflow/end-node";
import { StartNode } from "@/components/workflow/start-node";
import { TaskNode } from "@/components/workflow/task-node";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeTypes,
  MiniMap,
  type Node,
  type NodeTypes,
  Panel,
  useEdgesState,
  useNodesState
} from "reactflow";
import "reactflow/dist/style.css";

// Define custom node types
const nodeTypes: NodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  taskNode: TaskNode
};

// Define custom edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge
};

export default function WorkflowEditorPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [workflowName, setWorkflowName] = useState("Untitled");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Modal states
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);

  // Initialize workflow with start and end nodes
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: "start",
        type: "startNode",
        position: { x: 250, y: 50 },
        data: { label: "Start" }
      },
      {
        id: "end",
        type: "endNode",
        position: { x: 250, y: 250 },
        data: { label: "End" }
      }
    ];

    const initialEdges: Edge[] = [
      {
        id: "start-end",
        source: "start",
        target: "end",
        type: "custom"
      }
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);

    // If editing an existing workflow, fetch its data
    if (params.id !== "new") {
      // In a real app, you would fetch the workflow data from an API
      // For demo purposes, we'll just use the initial setup
      setWorkflowName(`Workflow #${params.id}`);
    }
  }, [params.id, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: "custom" }, eds));
    },
    [setEdges]
  );

  const addNewNode = (type: string) => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: type === "api" ? "taskNode" : "taskNode",
      position: {
        x: 250,
        y: nodes.length * 100 + 50
      },
      data: {
        label: type === "api" ? "API Call" : "Email",
        type: type,
        onDelete: (nodeId: string) => {
          setNodeToDelete(nodeId);
          setIsDeleteModalOpen(true);
        }
      }
    };

    // Adjust end node position
    const endNode = nodes.find(({ node }: any) => node.id === "end");
    if (endNode) {
      const updatedNodes = nodes.filter(({ node }: any) => node.id !== "end");
      setNodes([
        ...updatedNodes,
        newNode,
        {
          ...endNode,
          position: { x: endNode.position.x, y: newNode.position.y + 100 }
        }
      ]);

      // Update edges
      const lastNode = updatedNodes[updatedNodes.length - 1];
      const newEdges = edges.filter((edge) => edge.target !== "end");

      setEdges([
        ...newEdges,
        {
          id: `${lastNode.id}-${newNode.id}`,
          source: lastNode.id,
          target: newNode.id,
          type: "custom"
        },
        {
          id: `${newNode.id}-end`,
          source: newNode.id,
          target: "end",
          type: "custom"
        }
      ]);
    }
  };

  const handleSave = (name: string, description: string) => {
    setWorkflowName(name);
    setWorkflowDescription(description);
    // In a real app, you would save the workflow data to an API
    console.log("Saving workflow:", {
      id: params.id,
      name,
      description,
      nodes,
      edges
    });
    router.push("/dashboard");
  };

  const handleDeleteNode = () => {
    if (nodeToDelete) {
      setNodes((nds) => nds.filter((node) => node.id !== nodeToDelete));
      setEdges((eds) =>
        eds.filter(
          (edge) => edge.source !== nodeToDelete && edge.target !== nodeToDelete
        )
      );
      setNodeToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleExecuteWorkflow = () => {
    // In a real app, you would trigger the workflow execution via API
    console.log("Executing workflow:", {
      id: params.id,
      name: workflowName
    });
    setIsExecuteModalOpen(false);
    // Show success message or redirect to execution history
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <span className="text-lg font-medium">{workflowName}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSaveModalOpen(true)}
            >
              <Save className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 workflow-editor" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={setReactFlowInstance}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background color="#ccc" gap={16} />

            <Panel position="top-right" className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Node
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => addNewNode("api")}>
                    API Call
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addNewNode("email")}>
                    Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaveModalOpen(true)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExecuteModalOpen(true)}
              >
                Execute
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </main>

      {/* Modals */}
      <SaveWorkflowModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSave}
        initialName={workflowName}
        initialDescription={workflowDescription}
      />

      <DeleteWorkflowModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteNode}
        workflowName={workflowName}
      />

      <ExecuteWorkflowModal
        isOpen={isExecuteModalOpen}
        onClose={() => setIsExecuteModalOpen(false)}
        onConfirm={handleExecuteWorkflow}
        workflowName={workflowName}
      />
    </div>
  );
}
