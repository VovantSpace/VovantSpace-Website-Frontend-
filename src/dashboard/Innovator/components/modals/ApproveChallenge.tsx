import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@innovator/components/ui/dialog";
import { Button } from "@innovator/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ApproveChallengeProps {
  open: boolean;
  onClose: () => void;
  approvedCount: number;
  problemSolversNeeded: number;
  innovator: string;
  approvedProblemSolvers: string[];
  onChatCreated?: (chat: { innovator: string; members: string[] }) => void;
}

export function ApproveChallenge({
  open,
  onClose,
  approvedCount,
  problemSolversNeeded,
  innovator,
  approvedProblemSolvers,
  onChatCreated,
}: ApproveChallengeProps) {
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
    }
  }, [open]);

  const handleConfirmYes = () => {
    setIsApproved(true);
    onChatCreated?.({ innovator, members: approvedProblemSolvers });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="secondbg dashtext rounded-xl border-0 shadow-xl sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
            <DialogTitle className="text-center text-2xl font-bold">
              Confirm Approval
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Are you sure you want to approve this challenge? This action cannot be undone.
          </p>
          <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <p className="text-sm font-medium">
              {problemSolversNeeded} Approved Problem Solvers
            </p>
            <p className="text-sm text-muted-foreground">
              {approvedProblemSolvers.join(", ")}
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            className="w-full gap-2 border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-600"
            onClick={onClose}
          >
            <XCircle className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
            onClick={handleConfirmYes}
          >
            <CheckCircle className="h-4 w-4" />
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
