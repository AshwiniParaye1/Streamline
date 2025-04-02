import { Handle, Position } from "reactflow";

export function StartNode({ data }: { data: { label: string } }) {
  return (
    <div className="node-start">
      <Handle type="source" position={Position.Bottom} />
      {data.label}
    </div>
  );
}
