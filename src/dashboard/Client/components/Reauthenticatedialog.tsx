import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/dashboard/Innovator/components/ui/dialog"
import { Link } from "react-router-dom"
import { Input } from "@/dashboard/Innovator/components/ui/input"
import { Label } from "@/dashboard/Innovator/components/ui/label"
import { Button } from "@/dashboard/Innovator/components/ui/button"


export default function ReauthenticateDialog({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    try {
      // Add your authentication API call here
      // await verifyPassword(password)
      onSuccess()
      onClose()
    } catch (err) {
      setError("Incorrect password. Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 rounded-md dark:bg-[#131313] border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dashtext">Re-enter Password</DialogTitle>
          <p className="text-sm text-gray-400 mt-1">We need to verify it's really you.</p>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className=" text-black dark:text-white">v...@gmail.com</span>
            <Link to={'/login'}>
              <button className="text-xs text-emerald-500 hover:underline">Not you?</button>
            </Link>
          </div>
          <Label htmlFor="password" className="block text-sm dashtext">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex items-center justify-between">
            <Link to={'/forget'}>
              <button className="text-xs text-emerald-500 hover:underline">Forgot password?</button>
            </Link>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={onClose} className="dashbutton text-white">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="dashbutton">
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}