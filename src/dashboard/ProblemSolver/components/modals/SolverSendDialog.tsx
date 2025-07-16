import { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@innovator/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@innovator/components/ui/dialog"
import { Input } from "@innovator/components/ui/input"
import { Label } from "@innovator/components/ui/label"

const solvers = [
  { id: "1", label: "Alex Johnson", expertise: "Smart Contracts" },
  { id: "2", label: "Sam Lee", expertise: "Protocol Design" },
  { id: "3", label: "Jordan Smith", expertise: "Cryptography" },
]

export function SolverSendDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="secondbg max-w-[calc(100vw-2rem)] sm:max-w-[450px] ">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Send className="h-6 w-6 text-primary dark:text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-semibold tracking-tight  dark:text-white">
                Peer Transfer
              </DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-gray-400">
                Direct funds transfer between solvers
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-2">
          {/* Recipient Dropdown */}
          <div className="space-y-2">
            <Label className="text-sm font-medium dark:text-white" htmlFor="recipient">
              Select Recipient
            </Label>
            <select
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="block w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 secondbg dark:text-white"
            >
              <option value="">Select a recipient</option>
              {solvers.map((solver) => (
                <option key={solver.id} value={solver.id}>
                  {solver.label} - {solver.expertise}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium dark:text-white">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 h-10 text-base secondbg dark:text-white"
                placeholder="0.00"
              />
            </div>
            {amount && Number(amount) < 5 && (
              <p className="text-sm text-destructive mt-1">
                Minimum transfer amount is $5
              </p>
            )}
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium dark:text-white">Message</Label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Optional note for recipient"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none min-h-[100px] secondbg dark:text-white"
            />
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="flex gap-3 mt-1">
          <Button
            variant="outline"
            onClick={onClose}
            className="dashbutton h-12 flex-1 text-white"
          >
            Cancel
          </Button>
          <Button
            className="dashbutton h-12 flex-1"
            disabled={!recipient || !amount || Number(amount) < 5}
          >
            Confirm Transfer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
