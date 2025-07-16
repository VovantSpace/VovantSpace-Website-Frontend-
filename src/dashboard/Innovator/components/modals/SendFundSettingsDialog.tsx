import * as React from "react"
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

type SendFundSettingsDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export function SendFundSettingsDialog({
  isOpen,
  onClose,
}: SendFundSettingsDialogProps) {
  const [currentView, setCurrentView] = useState<
    "main" | "verifyOTPChangePin" | "changePin" | "verifyOTPForgotPin" | "forgotPin"
  >("main")

  const [paymentMethod, setPaymentMethod] = useState<"saved" | "new">("saved")
  
  // New card fields
  const [cardNumber, setCardNumber] = useState("")
  const [newExpiry, setNewExpiry] = useState("")
  const [newCvv, setNewCvv] = useState("")
  const [cardholder, setCardholder] = useState("")
  
  // Card deletion verification fields
  const [deleteExpiry, setDeleteExpiry] = useState("")
  const [deleteCvv, setDeleteCvv] = useState("")
  
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cardAction, setCardAction] = useState<"none" | "delete">("none")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Number(amount) < 5) return
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const handleOTPVerify = (action: "changePin" | "forgotPin") => {
    setCurrentView(action)
  }

  const handleCardActionConfirm = () => {
    alert("Card deleted successfully")
    setCardAction("none")
    setDeleteExpiry("")
    setDeleteCvv("")
  }

  const handleClose = () => {
    setCurrentView("main")
    setPaymentMethod("saved")
    setCardNumber("")
    setNewExpiry("")
    setNewCvv("")
    setDeleteExpiry("")
    setDeleteCvv("")
    setCardholder("")
    setCardAction("none")
    setAmount("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="secondbg dashtext dark:bg-gray-800 dark:text-white sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Fund Settings</DialogTitle>
        </DialogHeader>

        {currentView === "main" && (
          <div className="space-y-6">
            {/* Payment PIN Settings */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 space-y-3">
              <h2 className="text-lg font-semibold">Payment PIN Settings</h2>
              <Button
                className="dashbutton w-full"
                onClick={() => setCurrentView("verifyOTPChangePin")}
              >
                Change Payment PIN
              </Button>
              <Button
                variant="outline"
                className="dashbutton w-full text-white"
                onClick={() => setCurrentView("verifyOTPForgotPin")}
              >
                Forgot Payment PIN
              </Button>
            </div>

            {/* Payment Method Section */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 space-y-3">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(val) => setPaymentMethod(val as "saved" | "new")}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="saved" id="saved" className="dark:bg-white" />
                  <Label htmlFor="saved">Use Saved Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" className="dark:bg-white" />
                  <Label htmlFor="new">Add New Card</Label>
                </div>
              </RadioGroup>

              {paymentMethod === "saved" && (
                <div className="space-y-2">
                  <Label>Choose your saved card:</Label>
                  <select className="secondbg w-full p-2 text-sm border rounded-md dark:bg-gray-700">
                    <option>**** **** **** 4242</option>
                    <option>**** **** **** 1234</option>
                  </select>
                  <Button
                    type="button"
                    className="dashbutton w-full mt-2"
                    onClick={() => setCardAction("delete")}
                  >
                    Delete Saved Card
                  </Button>
                  
                  {cardAction === "delete" && (
                    <div className="space-y-2 mt-2">
                      <p className="text-sm">
                        Provide Expiry Date and CVC to confirm card deletion:
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="delete-expiry">Expiry Date</Label>
                          <Input
                            id="delete-expiry"
                            placeholder="MM/YY"
                            className="secondbg dark:bg-gray-700"
                            value={deleteExpiry}
                            required
                            onChange={(e) => setDeleteExpiry(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="delete-cvv">CVC</Label>
                          <Input
                            id="delete-cvv"
                            placeholder="123"
                            type="password"
                            maxLength={3}
                            className="secondbg dark:bg-gray-700"
                            value={deleteCvv}
                            required
                            onChange={(e) => setDeleteCvv(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2">
                        <Button
                          type="button"
                          className="dashbutton w-full"
                          onClick={handleCardActionConfirm}
                        >
                          Confirm Delete
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="dashbutton w-full text-white"
                          onClick={() => {
                            setCardAction("none")
                            setDeleteExpiry("")
                            setDeleteCvv("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === "new" && (
                <div className="grid gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="secondbg dark:bg-gray-700"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry-new">Expiry Date</Label>
                      <Input
                        id="expiry-new"
                        placeholder="MM/YY"
                        className="mt-2 secondbg dark:bg-gray-700"
                        value={newExpiry}
                        onChange={(e) => setNewExpiry(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv-new">CVV</Label>
                      <Input
                        id="cvv-new"
                        placeholder="123"
                        type="password"
                        maxLength={3}
                        className="mt-2 secondbg dark:bg-gray-700"
                        value={newCvv}
                        onChange={(e) => setNewCvv(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <Label htmlFor="cardholder">Card Holder Name</Label>
                    <Input
                      id="cardholder"
                      placeholder="Card Holder"
                      type="text"
                      className="mt-2 secondbg w-full dark:bg-gray-700"
                      value={cardholder}
                      onChange={(e) => setCardholder(e.target.value)}
                    />
                  </div>
                  <Button type="button" className="dashbutton w-full">
                    Add Card
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PIN/OTP views */}
        {currentView === "verifyOTPChangePin" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Verify OTP</h2>
            <Input placeholder="Enter 6-digit OTP" className="secondbg dark:bg-gray-700" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don&apos;t get OTP?{" "}
              <button className="text-green-700 hover:underline">Resend</button>
            </p>
            <DialogFooter>
              <Button className="dashbutton w-full" onClick={() => handleOTPVerify("changePin")}>
                Verify OTP
              </Button>
              <Button variant="outline" className="dashbutton w-full text-white" onClick={() => setCurrentView("main")}>
                Back
              </Button>
            </DialogFooter>
          </div>
        )}

        {currentView === "changePin" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Change Payment PIN</h2>
            <div>
              <Label htmlFor="old-pin">Old PIN</Label>
              <Input id="old-pin" placeholder="Enter old PIN" type="password" className="secondbg dark:bg-gray-700 mt-2" />
            </div>
            <div>
              <Label htmlFor="new-pin">New PIN</Label>
              <Input id="new-pin" placeholder="Enter new PIN" type="password" className="secondbg dark:bg-gray-700 mt-2" />
            </div>
            <DialogFooter>
              <Button className="dashbutton w-full">Update PIN</Button>
              <Button variant="outline" className="dashbutton w-full text-white" onClick={() => setCurrentView("main")}>
                Back
              </Button>
            </DialogFooter>
          </div>
        )}

        {currentView === "verifyOTPForgotPin" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Verify OTP</h2>
            <Input placeholder="Enter 6-digit OTP" className="secondbg dark:bg-gray-700" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don&apos;t get OTP?{" "}
              <button className="text-green-700 hover:underline">Resend</button>
            </p>
            <DialogFooter>
              <Button className="dashbutton w-full" onClick={() => handleOTPVerify("forgotPin")}>
                Verify OTP
              </Button>
              <Button variant="outline" className="dashbutton w-full text-white" onClick={() => setCurrentView("main")}>
                Back
              </Button>
            </DialogFooter>
          </div>
        )}

        {currentView === "forgotPin" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Forgot Payment PIN</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Set a new PIN below:</p>
            <Label htmlFor="new-pin-forgot">New PIN</Label>
            <Input id="new-pin-forgot" placeholder="Enter new PIN" type="password" className="secondbg dark:bg-gray-700 mt-2" />
            <DialogFooter>
              <Button className="dashbutton w-full">Save New PIN</Button>
              <Button variant="outline" className="dashbutton w-full text-white" onClick={() => setCurrentView("main")}>
                Back
              </Button>
            </DialogFooter>
          </div>
        )}

        <DialogFooter>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}