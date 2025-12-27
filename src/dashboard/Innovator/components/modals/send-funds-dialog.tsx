import { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/dashboard/Innovator/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

const challenges = [
  { id: "1", label: "Challenge 1" },
  { id: "2", label: "Challenge 2" },
]

const solvers = [
  { id: "1", label: "Problem Solver 1" },
  { id: "2", label: "Problem Solver 2" },
]

export function SendFundsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [challenge, setChallenge] = useState("")
  const [solver, setSolver] = useState("")
  const [remark, setRemark] = useState("")
  const [amount, setAmount] = useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] secondbg dashtext max-h-[90vh] overflow-y-auto p-6 shadow-lg rounded-lg">
        <DialogHeader className=" pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold">
            <Send className="h-6 w-6" />
            Send Funds
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Transfer funds with additional challenge details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">

          <div className="grid gap-2">
            <Label htmlFor="challenge" className="text-sm font-medium">
              Select Challenge
            </Label>
            <select
              id="challenge"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              className=" p-2 rounded-md border text-sm secondbg border-gray-600"
            >
              <option value="">Select a challenge</option>
              {challenges.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="solver" className="text-sm font-medium">
              Select Problem Solver
            </Label>
            <select
              id="solver"
              value={solver}
              onChange={(e) => setSolver(e.target.value)}
              className="secondbg p-2 rounded-md text-sm border border-gray-600"
            >
              <option value="">Select a solver</option>
              {solvers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="remark" className="text-sm font-medium">
              Remark
            </Label>
            <textarea
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Payment Description"
              className="secondbg dashinput p-2 text-sm rounded-md border border-gray-600"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount ($)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="secondbg dashinput pl-8 pb-1"
                placeholder="0.00"
              />
            </div>
            {amount && Number(amount) < 5 && (
              <span className="text-sm font-medium text-red-500">
                Enter a value equal to or greater than 5
              </span>
            )}

          </div>
        </div>

        <DialogFooter className="pt-4 border-gray-700">
          <Button variant="outline" onClick={onClose} className="dashbutton text-white">
            Cancel
          </Button>
          <Button
            className="dashbutton "
            disabled={Number(amount) < 5}
          >
            Send Funds
          </Button>


        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
