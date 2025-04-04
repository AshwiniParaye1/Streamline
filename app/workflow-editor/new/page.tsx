// app/workflow-editor/new/page.tsx

"use client";

import Flow from "@/components/react-flow";
import { useEffect, useState } from "react";

export default function WorkflowEditorNewPage() {
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
    <div>
      <Flow />
    </div>
  );
}
