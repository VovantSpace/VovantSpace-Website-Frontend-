import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@innovator/components/ui/dialog";
import { Button } from "@innovator/components/ui/button";

interface ChallengeCompleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBlockChat?: () => void; // Callback to block the chat automatically
}

export function WinnerSelectorDialog({
  isOpen,
  onClose,
  onBlockChat,
}: ChallengeCompleteDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onBlockChat && onBlockChat();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md secondbg dashtext p-4 rounded-xl shadow-2xl">
        <DialogHeader className="">
          <DialogTitle className="text-2xl font-bold text-center">
            Challenge Completion
          </DialogTitle>
        </DialogHeader>
        {isConfirmed ? (
          <div className="text-center">
            <p className="text-md font-medium mb-4 dashtext">
              Congratulations, this project is successful. Thank you for choosing VovantSpace.
            </p>
            <Button className="dashbutton w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-md text-center ">
              Are you sure the challenge have been solved and solution have been completed?
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <Button
                variant="outline"
                className="border border-gray-400 dark:text-black"
                onClick={onClose}
              >
                No
              </Button>
              <Button
                className="dashbutton "
                onClick={handleConfirm}
              >
                Yes
              </Button>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
