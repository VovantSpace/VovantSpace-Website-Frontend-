import { useState } from "react";
import { Button } from "@innovator/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@innovator/components/ui/dialog";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { cn } from "@/dashboard/Innovator/lib/utils";

export function RescheduleSession({open,onOpenChange}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleReschedule = () => {
    if (selectedDate && selectedTime) {
      console.log("Rescheduled to:", selectedDate, selectedTime);
      onOpenChange(false);
    }
  };

  return (
    <>

      {/* Reschedule Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-6 rounded-lg shadow-lg secondbg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Reschedule Session
            </DialogTitle>
          </DialogHeader>

          {/* Date Picker */}
          <div className="flex items-center space-x-3 mt-4">
            <CalendarIcon className="text-gray-500 dark:text-white" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 secondbg border-gray-300 dark:text-white text-sm "
            />
          </div>

          {/* Time Picker */}
          <div className="flex items-center space-x-3 mt-3">
            <ClockIcon className="text-gray-500  dark:text-white" />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 secondbg border-gray-300 dark:text-white text-sm "
            />
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-4">
            <Button 
              onClick={handleReschedule}
              disabled={!selectedDate || !selectedTime}
              className={cn(
                "w-full py-2 text-white transition dashbutton",
                selectedDate && selectedTime ? "dashbutton" : " cursor-not-allowed"
              )}
            >
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
