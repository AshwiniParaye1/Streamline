/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Mock API functions for workflow management

// Types
export interface Workflow {
  id: string;
  name: string;
  lastEdited: string;
  description: string;
  isFavorite: boolean;
  nodes: any[];
  edges: any[];
}

// Mock data
const mockWorkflows: Workflow[] = Array(15)
  .fill(null)
  .map((_, i) => ({
    id: `${494 + i}`,
    name: `Workflow Name here...`,
    lastEdited: "Zubin Khanna | 22:43 IST - 28/05",
    description: "Some Description Here Regarding The Flow..",
    isFavorite: i === 0,
    nodes: [],
    edges: []
  }));

// API functions
export async function getWorkflows(): Promise<Workflow[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockWorkflows);
    }, 500);
  });
}

export async function getWorkflowById(id: string): Promise<Workflow | null> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const workflow = mockWorkflows.find((w) => w.id === id);
      resolve(workflow || null);
    }, 500);
  });
}

export async function saveWorkflow(workflow: Workflow): Promise<Workflow> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would update the database
      resolve(workflow);
    }, 500);
  });
}

export async function executeWorkflow(id: string): Promise<boolean> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would trigger the workflow execution
      resolve(true);
    }, 1000);
  });
}

export async function deleteWorkflow(id: string): Promise<boolean> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would delete from the database
      resolve(true);
    }, 500);
  });
}
