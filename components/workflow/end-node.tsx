import { Handle, Position } from "reactflow";

export function EndNode({ data }: { data: { label: string } }) {
  return (
    <div className="node-end">
      <Handle type="target" position={Position.Top} />
      {data.label}
    </div>
  );
}
