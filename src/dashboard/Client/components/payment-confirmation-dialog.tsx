import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@innovator/components/ui/dialog"
import { Button } from "@innovator/components/ui/button"
import { ScrollArea } from "@/dashboard/Innovator/components/ui/scroll-area"

interface PaymentConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionDetails: {
    mentor: string
    topic: string
    date: string
    time: string
    duration: string
  }
  paymentDetails: {
    sessionFee: number
    serviceFee: number
    totalAmount: number
  }
  timeLimit: number // in seconds
  onConfirm: () => void
}

export function PaymentConfirmationDialog({
  open,
  onOpenChange,
  sessionDetails,
  paymentDetails,
  timeLimit,
  onConfirm,
}: PaymentConfirmationDialogProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [pin, setPin] = useState(["", "", "", ""])

  useEffect(() => {
    if (!open) return

    setTimeRemaining(timeLimit)
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onOpenChange(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open, timeLimit, onOpenChange])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1)
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const isPinComplete = pin.every((digit) => digit !== "")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ScrollArea>
      <DialogContent className="sm:max-w-md secondbg !dark:text-white overflow-y-auto max-h-[100vh]">
        <DialogTitle className="text-xl font-semibold dark:text-white">Payment Confirmation</DialogTitle>

        <div className=" text-center text-sm text-muted-foreground dark:text-white -mt-2">Time remaining to complete payment</div>
        <div className="text-center text-2xl font-bold text-primary dark:text-white -my-3">{formatTime(timeRemaining)}</div>

        <div className=" space-y-2">
          <div className="rounded-md border border-gray-700 dark:text-white dark:border-gray-300 p-4">
            <h3 className="mb-3 font-medium">Session Details</h3>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-muted-foreground dark:text-gray-300">Advisor/Mentor:</div>
              <div>{sessionDetails.mentor}</div>

              <div className="text-muted-foreground dark:text-gray-300">Session Discussion:</div>
              <div>{sessionDetails.topic}</div>

              <div className="text-muted-foreground dark:text-gray-300">Date & Time:</div>
              <div>
                {sessionDetails.date} at {sessionDetails.time}
              </div>

              <div className="text-muted-foreground dark:text-gray-300">Session Duration:</div>
              <div>{sessionDetails.duration}</div>
            </div>
          </div>

          <div className="rounded-md border border-gray-700 dark:text-white text-sm dark:border-gray-300 p-4">
            <h3 className="mb-3 font-medium">Payment Details</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Session Fee</span>
                <span>${paymentDetails.sessionFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee (5%)</span>
                <span>${paymentDetails.serviceFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 font-medium">
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="text-primary dark:text-white">${paymentDetails.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <h3 className="mb-3 text-center font-medium dark:text-white">Enter Payment PIN</h3>
          <div className="flex justify-center gap-2">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                className="h-12 w-12 rounded-md border border-input bg-background text-center text-lg font-bold"
              />
            ))}
          </div>
        </div>

        <div className="">
          <Button className="w-full dashbutton text-white" disabled={!isPinComplete} onClick={onConfirm}>
            Confirm Payment
          </Button>
        </div>
      </DialogContent>
      </ScrollArea>
    </Dialog>
  )
}

