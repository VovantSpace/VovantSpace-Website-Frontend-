import { useState } from "react";
import { Button } from "@innovator/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

const formatTime = (hour) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${suffix}`;
};

export function ScheduleReviewDialog({ isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("45");

  // Generate today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg space-y-3 p-5 secondbg">
        <DialogHeader className="dark:text-white">
          <DialogTitle className="text-xl font-bold dark:text-white">
            Schedule a Meeting
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Date Picker */}
          <div className="grid gap-2">
            <Label htmlFor="date" className="dark:text-white">
              Select Date
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-md p-2"
              min={today}
              required
            />
          </div>

          {/* Time Selector */}
          <div className="grid gap-2">
            <Label htmlFor="time" className="dark:text-white">
              Select Time
            </Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              className="border rounded-md"
              required
            >
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const hour = i + 9; // 9 AM to 8 PM
                  const formattedValue = `${hour.toString().padStart(2, '0')}:00`;
                  return (
                    <SelectItem key={formattedValue} value={formattedValue}>
                      {formatTime(hour)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selector */}
          <div className="grid gap-2">
            <Label htmlFor="duration" className="dark:text-white">
              Duration
            </Label>
            <Select
              value={duration}
              onValueChange={setDuration}
              className="border rounded-md"
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="border rounded-md">
            Cancel
          </Button>
          <Button className="dashbutton text-white">
            Schedule Meeting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}