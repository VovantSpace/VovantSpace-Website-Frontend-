import { User, Calendar, Clock, MessageSquare, HelpCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@innovator/components/ui/dialog"
import { Button } from "@innovator/components/ui/button"

interface ConfirmSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionDetails: {
    mentor: string
    date: string
    time: string
    topic: string
  }
  paymentDetails: {
    sessionFee: number
    serviceFee: number
    totalAmount: number
  }
  onConfirm: () => void
}

export function ConfirmSessionDialog({
  open,
  onOpenChange,
  sessionDetails,
  paymentDetails,
  onConfirm,
}: ConfirmSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md secondbg dark:!text-white">
        <DialogTitle className="text-xl font-semibold">Confirm Session Request</DialogTitle>

        <div className="mt-4 space-y-4 overflow-hidden">
          <div className="rounded-md bg-card p-4 secondbg dark:!text-white  border border-gray-700 dark:border-gray-3">
            <h3 className="mb-3 font-medium">Session Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
                <span className="text-muted-foreground dark:text-gray-300">Advisor/Mentor:</span>
                <span>{sessionDetails.mentor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-300"  />
                <span className="text-muted-foreground dark:text-gray-300">Date:</span>
                <span>{sessionDetails.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
                <span className="text-muted-foreground dark:text-gray-300">Time:</span>
                <span>{sessionDetails.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground dark:text-gray-300" />
                <span className="text-muted-foreground text-xs dark:text-gray-300">Session Discussion:</span>
                <span className="text-xs text-wrap whitespace-nowrap max-w-xs break-words">{sessionDetails.topic}</span>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-card  p-4 secondbg dark:!text-white border border-gray-700 dark:border-gray-300">
            <h3 className="mb-3 font-medium">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Session Fee:</span>
                <span>${paymentDetails.sessionFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span>Service Fee</span>
                  <HelpCircle className="h-3 w-3 text-muted-foreground" />
                </div>
                <span>${paymentDetails.serviceFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 font-medium">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="text-primary dark:text-white">${paymentDetails.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className='dashbutton text-white'>
            Cancel
          </Button>
          <Button className='dashbutton text-white' onClick={onConfirm}>Confirm & Send Request</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

