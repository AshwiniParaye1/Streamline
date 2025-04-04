// app/workflow-editor/new/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Mail, Save, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  MarkerType,
  Node,
  NodeTypes,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";

// Node components with specific functionality
const StartNode = ({ data }) => {
  return (
    <div className="px-4 py-2 rounded-md bg-green-500 text-white min-w-[150px] text-center shadow-md">
      <div className="font-bold">{data.label}</div>
    </div>
  );
};

const EndNode = ({ data }) => {
  return (
    <div className="px-4 py-2 rounded-md bg-red-500 text-white min-w-[150px] text-center shadow-md">
      <div className="font-bold">{data.label}</div>
    </div>
  );
};

const ApiNode = ({ data, id }) => {
  return (
    <div className="bg-white border border-blue-500 rounded-md shadow-md min-w-[250px]">
      <div className="bg-blue-500 text-white p-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Globe size={16} />
          <span className="font-semibold">API Call</span>
        </div>
        <button
          onClick={() => data.onDelete(id)}
          className="text-white hover:text-red-200"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-3">
        <div className="text-sm text-gray-600 mb-1">
          Endpoint: {data.endpoint}
        </div>
        <div className="text-sm text-gray-600">Method: {data.method}</div>
      </div>
    </div>
  );
};

const EmailNode = ({ data, id }) => {
  return (
    <div className="bg-white border border-purple-500 rounded-md shadow-md min-w-[250px]">
      <div className="bg-purple-500 text-white p-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <span className="font-semibold">Email</span>
        </div>
        <button
          onClick={() => data.onDelete(id)}
          className="text-white hover:text-red-200"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-3">
        <div className="text-sm text-gray-600 mb-1">To: {data.to}</div>
        <div className="text-sm text-gray-600">Subject: {data.subject}</div>
      </div>
    </div>
  );
};

export default function WorkflowEditorNewPage() {
  const router = useRouter();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [workflowDescription, setWorkflowDescription] = useState("");

  // Node configuration states
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodeConfig, setShowNodeConfig] = useState(false);
  const [nodeConfig, setNodeConfig] = useState({
    type: "api",
    apiEndpoint: "",
    apiMethod: "GET",
    emailTo: "",
    emailSubject: "",
    emailBody: ""
  });

  // Define node types
  const nodeTypes: NodeTypes = {
    startNode: StartNode,
    endNode: EndNode,
    apiNode: ApiNode,
    emailNode: EmailNode
  };

  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "start",
      type: "startNode",
      position: { x: 250, y: 100 },
      data: { label: "Start" }
    },
    {
      id: "end",
      type: "endNode",
      position: { x: 250, y: 400 },
      data: { label: "End" }
    }
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2 }
          },
          eds
        )
      ),
    []
  );

  const onNodeClick = useCallback(
    (event, node) => {
      // Don't configure start or end nodes
      if (node.type === "startNode" || node.type === "endNode") return;

      setSelectedNode(node);
      setShowNodeConfig(true);

      // Pre-populate node configuration
      if (node.type === "apiNode") {
        setNodeConfig({
          ...nodeConfig,
          type: "api",
          apiEndpoint: node.data.endpoint || "",
          apiMethod: node.data.method || "GET"
        });
      } else if (node.type === "emailNode") {
        setNodeConfig({
          ...nodeConfig,
          type: "email",
          emailTo: node.data.to || "",
          emailSubject: node.data.subject || "",
          emailBody: node.data.body || ""
        });
      }
    },
    [nodeConfig]
  );

  const handleSave = () => {
    // In a real app, you would save the workflow to your backend
    const workflow = {
      id: `#${Math.floor(Math.random() * 100) + 500}`,
      name: workflowName,
      description: workflowDescription,
      lastEdited: `${new Date().toLocaleString()}`,
      nodes: nodes,
      edges: edges,
      executions: []
    };

    console.log("Saving workflow:", workflow);

    // Navigate back to dashboard after saving
    router.push("/dashboard");
  };

  const handleAddNode = (type) => {
    if (!reactFlowInstance) return;

    const id = `${type}_${Date.now()}`;
    let newNode;

    if (type === "api") {
      newNode = {
        id,
        type: "apiNode",
        position: { x: 250, y: 250 },
        data: {
          endpoint: "https://api.example.com",
          method: "GET",
          onDelete: handleDeleteNode
        }
      };
    } else if (type === "email") {
      newNode = {
        id,
        type: "emailNode",
        position: { x: 250, y: 250 },
        data: {
          to: "user@example.com",
          subject: "Workflow Notification",
          body: "This is an automated email from your workflow.",
          onDelete: handleDeleteNode
        }
      };
    }

    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
    setShowNodeConfig(true);
  };

  const handleDeleteNode = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id)
    );

    if (selectedNode && selectedNode.id === id) {
      setSelectedNode(null);
      setShowNodeConfig(false);
    }
  };

  const updateSelectedNode = () => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          if (node.type === "apiNode") {
            return {
              ...node,
              data: {
                ...node.data,
                endpoint: nodeConfig.apiEndpoint,
                method: nodeConfig.apiMethod,
                onDelete: handleDeleteNode
              }
            };
          } else if (node.type === "emailNode") {
            return {
              ...node,
              data: {
                ...node.data,
                to: nodeConfig.emailTo,
                subject: nodeConfig.emailSubject,
                body: nodeConfig.emailBody,
                onDelete: handleDeleteNode
              }
            };
          }
        }
        return node;
      })
    );

    setShowNodeConfig(false);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Fix for hydration issues - ensure ReactFlow only renders client-side
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading workflow editor...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f9f6eb]">
      {/* Header */}
      <div className="flex gap-4 m-6 items-center">
        <Image src={"/sidebar1.png"} alt="" width={30} height={30} />
        <h1 className="text-xl font-semibold">
          Workflow Builder - New Process
        </h1>
      </div>

      {/* Editor Controls */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white mx-6 rounded-t-md">
        <div className="flex items-center gap-4">
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="font-semibold text-lg w-64"
            placeholder="Enter workflow name"
          />
          <Input
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
            className="w-64"
            placeholder="Enter workflow description"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Workflow
          </Button>
        </div>
      </div>

      {/* ReactFlow Canvas with toolbox */}
      <div
        className="flex flex-1 bg-white mx-6 mb-6 rounded-b-md overflow-hidden"
        style={{ height: "calc(100vh - 200px)" }}
      >
        {/* Tools sidebar */}
        <div className="w-64 border-r p-4 bg-gray-50">
          <h3 className="font-medium mb-4">Component Toolbox</h3>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddNode("api")}
            >
              <Globe className="mr-2 h-4 w-4" /> API Call
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddNode("email")}
            >
              <Mail className="mr-2 h-4 w-4" /> Email
            </Button>
          </div>

          <div className="mt-8">
            <h3 className="font-medium mb-4">Instructions</h3>
            <ul className="text-sm space-y-2">
              <li>• Drag nodes to position them</li>
              <li>• Connect nodes by dragging from one handle to another</li>
              <li>• Click on nodes to configure them</li>
              <li>• Use controls to zoom and pan</li>
            </ul>
          </div>
        </div>

        {/* ReactFlow canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            fitView
          >
            <Background />
            <Controls />
            <Panel position="top-right">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (reactFlowInstance) {
                    reactFlowInstance.fitView({ padding: 0.2 });
                  }
                }}
              >
                Fit View
              </Button>
            </Panel>
          </ReactFlow>
        </div>

        {/* Node configuration panel - shown when a node is selected */}
        {showNodeConfig && (
          <div className="w-80 border-l p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">
                Configure{" "}
                {selectedNode?.type === "apiNode" ? "API Call" : "Email"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNodeConfig(false)}
              >
                <X size={16} />
              </Button>
            </div>

            {selectedNode?.type === "apiNode" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="endpoint">API Endpoint</Label>
                  <Input
                    id="endpoint"
                    value={nodeConfig.apiEndpoint}
                    onChange={(e) =>
                      setNodeConfig({
                        ...nodeConfig,
                        apiEndpoint: e.target.value
                      })
                    }
                    placeholder="https://api.example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="method">Method</Label>
                  <Select
                    value={nodeConfig.apiMethod}
                    onValueChange={(value) =>
                      setNodeConfig({ ...nodeConfig, apiMethod: value })
                    }
                  >
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedNode?.type === "emailNode" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    value={nodeConfig.emailTo}
                    onChange={(e) =>
                      setNodeConfig({ ...nodeConfig, emailTo: e.target.value })
                    }
                    placeholder="recipient@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={nodeConfig.emailSubject}
                    onChange={(e) =>
                      setNodeConfig({
                        ...nodeConfig,
                        emailSubject: e.target.value
                      })
                    }
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <Label htmlFor="body">Email Body</Label>
                  <Textarea
                    id="body"
                    value={nodeConfig.emailBody}
                    onChange={(e) =>
                      setNodeConfig({
                        ...nodeConfig,
                        emailBody: e.target.value
                      })
                    }
                    placeholder="Email content..."
                    rows={5}
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button onClick={updateSelectedNode} className="w-full">
                Update Node
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
