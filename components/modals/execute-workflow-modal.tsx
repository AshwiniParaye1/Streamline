"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ExecuteWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workflowName: string;
}

export function ExecuteWorkflowModal({
  isOpen,
  onClose,
  onConfirm,
  workflowName
}: ExecuteWorkflowModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-0">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogTitle className="text-center text-xl">
            &quot;Are You Sure You Want To Execute The Process &apos;
            {workflowName}&apos;?
          </DialogTitle>
          <DialogDescription className="text-center text-red-500 pt-2">
            You Cannot Undo This Step
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 pt-6">
          <Button variant="outline" onClick={onClose}>
            No
          </Button>
          <Button onClick={onConfirm}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
