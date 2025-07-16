import type React from "react"
import { useState } from "react"
import { CreditCard, DollarSign } from "lucide-react"

import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"

export function FundWalletDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"saved" | "new">("saved")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholder, setCardholder] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Number(amount) < 5) {
      return
    }
    setIsLoading(true)
    // Add funding logic here
    setTimeout(() => {
      setIsLoading(false)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="secondbg dashtext sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fund Wallet
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 pb-4">
            {/* Amount Input */}
            <div>
              <Label htmlFor="amount">Amount($)</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  min={5}
                  placeholder="Enter Amount"
                  className="secondbg pl-10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            {amount && Number(amount) < 5 && (
              <span className="text-sm font-medium text-red-500">
                Enter a value equal to or greater than 5
              </span>
            )}

            {/* Payment Method Radios */}
            <div>
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(val) => setPaymentMethod(val as "saved" | "new")}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2 ">
                  <RadioGroupItem value="saved" id="saved" className="dark:bg-white" />
                  <Label htmlFor="saved">Saved Card</Label>
                </div>
                <div className="flex items-center space-x-2 ">
                  <RadioGroupItem value="new" id="new" className="dark:bg-white" />
                  <Label htmlFor="new">New Card</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Conditionally render content based on paymentMethod */}
            {paymentMethod === "saved" ? (
              <div className="space-y-2">
                <Label>Choose your saved card:</Label>
                <select className="secondbg w-full p-2 text-sm border rounded-md">
                  <option>**** **** **** 4242</option>
                  <option>**** **** **** 1234</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      className="secondbg pl-10"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-2 secondbg"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      maxLength={3}
                      className="mt-2 secondbg"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <Label htmlFor="cardholder">Card Holder Name</Label>
                  <Input
                    id="cardholder"
                    placeholder="Card Holder"
                    type="text"
                    className="mt-2 secondbg w-full"
                    value={cardholder}
                    onChange={(e) => setCardholder(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="dashbutton w-full" disabled={isLoading || Number(amount) < 5}>
              {isLoading ? "Processing..." : "Add Funds"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
