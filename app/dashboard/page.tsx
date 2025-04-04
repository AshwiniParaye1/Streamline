"use client";

import type React from "react";

import { DeleteWorkflowModal } from "@/components/modals/delete-workflow-modal";
import { ExecuteWorkflowModal } from "@/components/modals/execute-workflow-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ExecutionHistory } from "@/components/workflow/execution-history";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { HiOutlineArrowDown } from "react-icons/hi";

// Mock data for workflows
const mockWorkflows = Array(15)
  .fill(null)
  .map((_, i) => ({
    id: `#${494 + i}`,
    name: `Workflow Name here...`,
    lastEdited: "Zubin Khanna | 22:43 IST - 28/05",
    description: "Some Description Here Regarding The Flow..",
    isFavorite: i === 0,
    executions: [
      {
        timestamp: "28/05 - 22:43 IST",
        status: i % 3 === 0 ? ("Passed" as const) : ("Failed" as const)
      },
      { timestamp: "28/05 - 22:43 IST", status: "Failed" as const },
      { timestamp: "28/05 - 22:43 IST", status: "Failed" as const }
    ]
  }));

export default function DashboardPage() {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedWorkflow, setExpandedWorkflow] = useState<number | null>(null);
  const router = useRouter();

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [selectedWorkflowIndex, setSelectedWorkflowIndex] = useState<
    number | null
  >(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // In a real app, you would filter from the API
  };

  const toggleFavorite = (index: number) => {
    const updatedWorkflows = [...workflows];
    updatedWorkflows[index].isFavorite = !updatedWorkflows[index].isFavorite;
    setWorkflows(updatedWorkflows);
  };

  const handleEdit = () => {
    router.push(`#`);
  };

  const handleExecute = (index: number) => {
    setSelectedWorkflowIndex(index);
    setIsExecuteModalOpen(true);
  };

  const confirmExecute = () => {
    if (selectedWorkflowIndex !== null) {
      // In a real app, you would trigger the workflow execution
      console.log(`Executing workflow ${workflows[selectedWorkflowIndex].id}`);
      setIsExecuteModalOpen(false);
    }
  };

  const handleDelete = (index: number) => {
    setSelectedWorkflowIndex(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedWorkflowIndex !== null) {
      const updatedWorkflows = [...workflows];
      updatedWorkflows.splice(selectedWorkflowIndex, 1);
      setWorkflows(updatedWorkflows);
      setIsDeleteModalOpen(false);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedWorkflow(expandedWorkflow === index ? null : index);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f9f6eb]">
      {/* <DashboardHeader /> */}
      <div className="flex gap-4 m-6 items-center">
        <Image src={"/sidebar1.png"} alt="" width={30} height={30} />
        <h1 className="text-xl font-semibold">Workflow Builder</h1>
      </div>

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search By Workflow Name/ID"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-5 bg-white"
            />
            <FiSearch className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#CACACA]" />
          </div>

          <Button onClick={() => router.push("/workflow-editor/new")}>
            + Create New Process
          </Button>
        </div>

        <div className="bg-white overflow-hidden pb-8 pl-8 pr-8 pt-2 mb-10">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-[#F68B21]">
                <TableHead className="font-medium">Workflow Name</TableHead>
                <TableHead className="font-medium">ID</TableHead>
                <TableHead className="font-medium">Last Edited On</TableHead>
                <TableHead className="font-medium">Description</TableHead>
                <TableHead className="w-[200px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {workflows.slice(0, 8).map((workflow, index) => (
                <Fragment key={workflow.id}>
                  <TableRow
                    className={expandedWorkflow === index ? "bg-gray-50" : ""}
                  >
                    <TableCell className="pb-8 pt-8 text-[#4F4F4F]">
                      {workflow.name}
                    </TableCell>
                    <TableCell className="font-light">{workflow.id}</TableCell>
                    <TableCell className="font-light text-xs">
                      {workflow.lastEdited}
                    </TableCell>
                    <TableCell className="font-light text-xs">
                      {workflow.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(index)}
                        >
                          <BsPinAngleFill
                            className={`h-5 w-5 ${
                              workflow.isFavorite &&
                              "fill-yellow-400 text-yellow-400"
                            }`}
                          />
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => handleExecute(index)}
                          className="text-xs"
                        >
                          Execute
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => handleEdit()}
                          className="text-xs"
                        >
                          Edit
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(index)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleExpand(index)}
                        >
                          {expandedWorkflow === index ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                          ) : (
                            <HiOutlineArrowDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedWorkflow === index && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-gray-50 px-8 py-4">
                        <ExecutionHistory executions={workflow.executions} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>

          <div className="py-4 px-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <span className="flex h-9 items-center justify-center px-4">
                    ...
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">15</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>
      {/* Modals */}
      {selectedWorkflowIndex !== null && (
        <>
          <DeleteWorkflowModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            workflowName={workflows[selectedWorkflowIndex]?.name || ""}
          />

          <ExecuteWorkflowModal
            isOpen={isExecuteModalOpen}
            onClose={() => setIsExecuteModalOpen(false)}
            onConfirm={confirmExecute}
            workflowName={workflows[selectedWorkflowIndex]?.name || ""}
          />
        </>
      )}
    </div>
  );
}
