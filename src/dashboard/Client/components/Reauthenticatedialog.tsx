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
      isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-[#131313] p-6 rounded-md w-[400px]">
                  <h2 className="text-xl font-semibold dashtext mb-2">Re-enter Password</h2>
                  <p className="text-sm text-gray-400 mb-4">We need to verify it's really you.</p>

                  <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border p-2 rounded w-full mb-3"
                  />

                  {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

                  <div className="flex justify-end gap-2">
                      <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                      <button onClick={handleSubmit} className="px-4 py-2 bg-emerald-600 text-white rounded">Continue</button>
                  </div>
              </div>
          </div>
      )
  )
}