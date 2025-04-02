import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface ExecutionHistoryProps {
  executions: {
    timestamp: string;
    status: "Passed" | "Failed";
  }[];
}

export function ExecutionHistory({ executions }: ExecutionHistoryProps) {
  return (
    <div className="space-y-4 mt-4">
      {executions.map((execution, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="relative flex items-center">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            {index < executions.length - 1 && (
              <div className="absolute top-2 left-[3px] h-full w-0.5 bg-gray-200"></div>
            )}
          </div>
          <span className="text-sm text-gray-600">{execution.timestamp}</span>
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-md",
              execution.status === "Passed"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {execution.status}
          </span>
          <button className="ml-2">
            <ExternalLink className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
}
