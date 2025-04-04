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

interface DeleteWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workflowName: string;
}

export function DeleteWorkflowModal({
  isOpen,
  onClose,
  onConfirm
}: DeleteWorkflowModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full p-10">
        <DialogHeader>
          <DialogTitle className="w-full text-center text-md font-semibold pt-10">
            Are you sure you want to delete
            <span className=""> &apos;Process_name&apos; </span>?
          </DialogTitle>
          <DialogDescription className="text-center font-medium text-red-500 pt-2  pb-10">
            You cannot undo this step.
          </DialogDescription>
        </DialogHeader>
        <div className="border-t-2">
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onConfirm}>
              Yes
            </Button>
            <Button variant="outline" onClick={onClose}>
              No
            </Button>
          </DialogFooter>{" "}
        </div>
      </DialogContent>
    </Dialog>
  );
}
