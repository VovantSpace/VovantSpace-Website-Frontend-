import { useState} from "react";
import { Button } from "@innovator/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@innovator/components/ui/select";
import { Input } from "@innovator/components/ui/input";
import { X } from "lucide-react";
import { MainLayout } from "../../components/layout/main-layout";
import { Switch } from "@innovator/components/ui/switch";

type Session = {
  id: string;
  start: string;
  end: string;
};

type TimeSlot = {
  id: string;
  start: string;
  end: string;
};

type DaySchedule = {
  day: string;
  timeSlots: TimeSlot[];
  excludedSessions: string[];
};

export default function AvailabilityPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [sessionDuration, setSessionDuration] = useState("30");
  const [bufferTime, setBufferTime] = useState("5");
  const [blackoutDates, setBlackoutDates] = useState<string[]>([]);
  const [newDateInput, setNewDateInput] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);

  const [schedule, setSchedule] = useState<DaySchedule[]>([
    ...createDaySchedules(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
    ...createDaySchedules(["Saturday", "Sunday"])
  ]);

  function createDaySchedules(days: string[]): DaySchedule[] {
    return days.map(day => ({
      day,
      timeSlots: [],
      excludedSessions: []
    }));
  }

  const parseTime = (time: string) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  // Improved buffer time logic:
  // Loop until adding the next session (and buffer) would exceed the slot end.
  const generateSessions = (timeSlot: TimeSlot) => {
    const slotStart = parseTime(timeSlot.start);
    const slotEnd = parseTime(timeSlot.end);
    const duration = parseInt(sessionDuration);
    const buffer = parseInt(bufferTime);

    if (!slotStart || !slotEnd || slotStart >= slotEnd || duration <= 0) return [];

    const sessions: Session[] = [];
    let currentStart = slotStart;

    while (true) {
      if (currentStart + duration > slotEnd) break;
      const sessionEnd = currentStart + duration;
      sessions.push({
        id: `${timeSlot.id}-${formatTime(currentStart)}-${formatTime(sessionEnd)}`,
        start: formatTime(currentStart),
        end: formatTime(sessionEnd)
      });
      if (currentStart + duration + buffer > slotEnd) break;
      currentStart = currentStart + duration + buffer;
    }

    return sessions;
  };

  const handleAddTimeSlot = (day: string) => {
    setSchedule(prev =>
      prev.map(d => {
        if (d.day !== day) return d;
        const newSlot = {
          id: crypto.randomUUID(),
          start: '09:00',
          end: '17:00'
        };
        return {
          ...d,
          timeSlots: [...d.timeSlots, newSlot]
        };
      })
    );
  };

  const handleTimeChange = (day: string, slotId: string, type: 'start' | 'end', value: string) => {
    setSchedule(prev =>
      prev.map(d => {
        if (d.day !== day) return d;
        return {
          ...d,
          timeSlots: d.timeSlots.map(slot =>
            slot.id === slotId ? { ...slot, [type]: value } : slot
          )
        };
      })
    );
  };

  const handleRemoveSlot = (day: string, slotId: string) => {
    setSchedule(prev =>
      prev.map(d => {
        if (d.day !== day) return d;
        return {
          ...d,
          timeSlots: d.timeSlots.filter(slot => slot.id !== slotId)
        };
      })
    );
  };

  const handleRemoveSession = (day: string, sessionId: string) => {
    setSchedule(prev =>
      prev.map(d => {
        if (d.day !== day) return d;
        return { ...d, excludedSessions: [...d.excludedSessions, sessionId] };
      })
    );
  };

  const handleAddBlackoutDate = () => {
    if (newDateInput) {
      setBlackoutDates(prev => [...prev, newDateInput]);
      setNewDateInput("");
      setShowDateInput(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-4 space-y-8 dark:text-white">
        {/* Availability Toggle */}
        <div className="rounded-xl p-6 shadow-lg secondbg dark:!text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground dark:text-white">Availability Status</h2>
              <p className="text-sm text-muted-foreground mt-1 dark:text-white">
                {isAvailable ? 'Available for bookings' : 'Currently unavailable'}
              </p>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
              className="data-[state=checked]:bg-primary dashbutton"
            />
          </div>
        </div>

        {/* Session Settings */}
        <div className={`rounded-xl p-6 shadow-lg secondbg dark:!text-white ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-semibold text-foreground dark:text-white">Session Settings</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground dark:text-white">
                Session Duration
              </label>
              <Select value={sessionDuration} onValueChange={setSessionDuration}>
                <SelectTrigger className="h-12 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[15, 30, 45, 60].map(mins => (
                    <SelectItem key={mins} value={String(mins)}>
                      {mins} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground dark:text-white">
                Buffer Time
              </label>
              <Select value={bufferTime} onValueChange={setBufferTime}>
                <SelectTrigger className="h-12 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 5, 10, 15].map(mins => (
                    <SelectItem key={mins} value={String(mins)}>
                      {mins} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className={`rounded-xl p-6 shadow-lg secondbg dark:!text-white space-y-4 ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground dark:text-white">Weekly Schedule</h2>
          </div>

          <div className="space-y-4 ">
            {schedule.map(daySchedule => (
              <div key={daySchedule.day} className="p-4 rounded-lg border  ">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground dark:text-white">{daySchedule.day}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="dashbutton text-white"
                    onClick={() => handleAddTimeSlot(daySchedule.day)}
                  >
                    + Add Time Slot
                  </Button>
                </div>

                {daySchedule.timeSlots.map(timeSlot => (
                  <TimeSlotSelector
                    key={timeSlot.id}
                    day={daySchedule.day}
                    slot={timeSlot}
                    sessions={generateSessions(timeSlot).filter(s =>
                      !daySchedule.excludedSessions.includes(s.id)
                    )}
                    onTimeChange={(type, value) =>
                      handleTimeChange(daySchedule.day, timeSlot.id, type, value)
                    }
                    onRemoveSlot={() =>
                      handleRemoveSlot(daySchedule.day, timeSlot.id)
                    }
                    onRemoveSession={handleRemoveSession}
                  />
                ))}

                {daySchedule.timeSlots.length === 0 && (
                  <div className="p-4 text-center rounded ">
                    <p className="text-sm text-muted-foreground dark:text-white">
                      No time slots added yet
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Blackout Dates */}
        <div className={`rounded-xl p-6 shadow-lg secondbg dark:!text-white ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground dark:text-white">Blackout Dates</h2>
            <div className="flex gap-2">
              {showDateInput && (
                <Input
                  type="date"
                  className="w-40 secondbg"
                  value={newDateInput}
                  onChange={(e) => setNewDateInput(e.target.value)}
                />
              )}
              <Button
                variant="outline"
                size="sm"
                className="dashbutton text-white"
                onClick={showDateInput ? handleAddBlackoutDate : () => setShowDateInput(true)}
              >
                {showDateInput ? 'Confirm' : '+ Add Date'}
              </Button>
            </div>
          </div>

          <div className="rounded-lg p-1 space-y-2 ">
            {blackoutDates.length > 0 ? (
              blackoutDates.map(date => (
                <div key={date} className="flex items-center border-gray-700 border justify-between p-2 rounded">
                  <span className="text-sm text-foreground dark:text-white">{date}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className=" text-white"
                    onClick={() => setBlackoutDates(prev => prev.filter(d => d !== date))}
                  >
                    <X className="w-6 h-6 text-red-700" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground dark:text-white">
                No blackout dates added
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

interface TimeSlotSelectorProps {
  day: string;
  slot: TimeSlot;
  sessions: Session[];
  onTimeChange: (type: 'start' | 'end', value: string) => void;
  onRemoveSlot: () => void;
  onRemoveSession: (day: string, sessionId: string) => void;
}

function TimeSlotSelector({ day, slot, sessions, onTimeChange, onRemoveSlot, onRemoveSession }: TimeSlotSelectorProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-700 dark:border-gray-300 secondbg mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          <Input
            type="time"
            value={slot.start}
            onChange={(e) => onTimeChange('start', e.target.value)}
            className="w-[120px] secondbg border border-gray-700 focus:border-transparent focus:ring-0"
            onMouseDown={(e) => e.preventDefault()}
          />

          <span className="text-muted-foreground dark:text-white">to</span>
          <Input
            type="time"
            value={slot.end}
            onChange={(e) => onTimeChange('end', e.target.value)}
            className="w-[120px] secondbg border border-gray-700 focus:border-transparent focus:ring-0"
            onMouseDown={(e) => e.preventDefault()} 
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 "
          onClick={onRemoveSlot}
        >
          <X className="w-7 h-7" />
        </Button>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-primary dark:text-white">
            <span>{sessions.length} Available Sessions</span>
          </div>

          {/* Sessions displayed in a single column with small text */}

          <div className="flex flex-col">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className="flex items-center p-1 "
              >
                <span className="text-xs text-foreground dark:text-white w-24">
                  Session {index + 1}:
                </span>
                <span className="text-xs text-foreground dark:text-white w-32">
                  {session.start} - {session.end}
                </span>
                {/*
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:bg-red-100/50 dashbutton"
                  onClick={() => onRemoveSession(day, session.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
                */}
              </div>
            ))}
          </div>
        </div>

      ) : (
        <div className="p-3 text-center rounded ">
          <p className="text-sm text-muted-foreground dark:text-white">
            No sessions available in this time slot
          </p>
        </div>
      )}
    </div>
  );
}
