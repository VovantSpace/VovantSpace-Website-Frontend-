import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
  } from "@/dashboard/Innovator/components/ui/dialog.tsx";
  import { Button } from "@innovator/components/ui/button";
  
  export function ApplyChallengeDialog({ isOpen, onClose, challenge }) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md secondbg">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Apply for {challenge?.title}</DialogTitle>
          </DialogHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Would you like to apply for this challenge?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="border">
              Cancel
            </Button>
            <Button onClick={onClose} className="dashbutton">Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  