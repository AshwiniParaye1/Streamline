"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Handle, Position } from "reactflow";

interface TaskNodeProps {
  data: {
    label: string;
    type: string;
    onDelete?: (nodeId: string) => void;
  };
  id: string;
}

export function TaskNode({ data, id }: TaskNodeProps) {
  return (
    <div className="node-task">
      <Handle type="target" position={Position.Top} />
      <div className="flex justify-between items-center">
        <span>{data.label}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-red-500"
          onClick={() => data.onDelete && data.onDelete(id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
