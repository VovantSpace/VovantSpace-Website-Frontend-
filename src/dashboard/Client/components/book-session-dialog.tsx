import { useState } from "react"
import { Clock, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/dashboard/Innovator/components/ui/dialog"
import { Button } from "@/dashboard/Innovator/components/ui/button"
import { Input } from "@/dashboard/Innovator/components/ui/input"

interface TimeSlot {
  id: string
  time: string
}

interface BookSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mentorName: string
  onConfirm: (date: string, timeSlot: TimeSlot, topic: string) => void
}

export function BookSessionDialog({ open, onOpenChange, mentorName, onConfirm }: BookSessionDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [topic, setTopic] = useState("")

  const dates = ["Monday", "Wednesday", "Friday"]

  const timeSlots = [
    { id: "1", time: "1:00 PM - 1:30 PM" },
    { id: "2", time: "2:00 PM - 2:30 PM" },
    { id: "3", time: "3:00 PM - 3:30 PM" },
  ]

  const handleConfirm = () => {
    if (selectedDate && selectedTimeSlot) {
      onConfirm(selectedDate, selectedTimeSlot, topic)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md secondbg dark:!text-white">
        <DialogTitle className="text-xl font-semibold">Book a Session with {mentorName}</DialogTitle>

        <div className="mt-4 space-y-6">
          <div>
            <h3 className="mb-2 font-medium">Select Date</h3>
            <div className="flex gap-2">
              {dates.map((date) => (
                <button
                  key={date}
                  className={`flex-1 rounded-md border border-border px-4 py-2 text-sm transition-colors ${
                    selectedDate === date ? "border-primary dashbutton text-white " : "border-gray-700 dark:border-gray-300"
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div>
              <h3 className="mb-2 font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Available Sessions
              </h3>
              <div className="grid gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={slot.id}
                    className={`flex items-center justify-between rounded-md border border-border p-3 text-sm transition-colors ${
                      selectedTimeSlot?.id === slot.id ? " dashbutton text-white" : ""
                    }`}
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    <div className="font-medium">Session {index + 1}</div>
                    <div>{slot.time}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTimeSlot && (
            <div>
              <h3 className="mb-2 font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Session Discussion
              </h3>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter session topic"  className='dark:text-white secondbg border-gray-700 dark:border-gray-300'/>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className='dashbutton !text-white'>
            Cancel
          </Button>
          <Button disabled={!selectedDate || !selectedTimeSlot || !topic} onClick={handleConfirm} className='dashbutton !text-white'>
            Send Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

