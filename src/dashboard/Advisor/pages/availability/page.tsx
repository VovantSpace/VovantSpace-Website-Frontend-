import {useEffect, useState} from "react";
import {Button} from "@/dashboard/Innovator/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/dashboard/Innovator/components/ui/select";
import {Input} from "@/dashboard/Innovator/components/ui/input";
import {X, AlertCircle, Loader2, Save, Calendar, Clock} from "lucide-react";
import {MainLayout} from "../../../component/main-layout";
import {Switch} from "@/dashboard/Innovator/components/ui/switch";
import {useAvailability, Availability} from "@/hooks/useMentor";
import {toast} from "react-toastify";


type Session = {
    id: string;
    start: string;
    end: string;
};

type TimeSlot = {
    id: string;
    startTime: string;
    endTime: string;
};

type DaySchedule = {
    day: string;
    dayOfWeek: number;
    timeSlots: TimeSlot[];
    excludedSessions: string[];
    hourlyRate: number;
};

// Loading Skeleton component
const AvailabilitySkeleton = () => (
    <div className={'space-y-8'}>
        {[1, 2, 3].map((i) => (
            <div key={i} className={'rounded.xl p-6 shadow-lg secondbg animate-pulse'}>
                <div className={'h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4'}>
                    <div className={'space-y-4'}>
                        <div className={'h-4 w-full bg-gray-300 dark:bg-gray-700 rounded'}></div>
                        <div className={'h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded'}></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)


export default function AvailabilityPage() {
    const [isAvailable, setIsAvailable] = useState(true);
    const [sessionDuration, setSessionDuration] = useState("30");
    const [bufferTime, setBufferTime] = useState("5");
    const [blackoutDates, setBlackoutDates] = useState<string[]>([]);
    const [newDateInput, setNewDateInput] = useState("");
    const [showDateInput, setShowDateInput] = useState(false);
    const [saving, setSaving] = useState(false);

    const {
        availability,
        loading,
        error,
        refetch,
        createAvailability,
        updateAvailability,
        deleteAvailability
    } = useAvailability();

    const [schedule, setSchedule] = useState<DaySchedule[]>([
        ...createDaySchedules([
            {day: "Monday", dayOfWeek: 1},
            {day: 'Tuesday', dayOfWeek: 2},
            {day: 'Wednesday', dayOfWeek: 3},
            {day: 'Thursday', dayOfWeek: 4},
            {day: 'Friday', dayOfWeek: 5}
        ]),
        ...createDaySchedules([
            {day: 'Saturday', dayOfWeek: 6},
            {day: 'Sunday', dayOfWeek: 7}
        ])
    ]);

    function createDaySchedules(days: { day: string; dayOfWeek: number }[]): DaySchedule[] {
        return days.map(({day, dayOfWeek}) => ({
            day,
            dayOfWeek,
            timeSlots: [],
            excludedSessions: [],
            hourlyRate: 50 // Default rate
        }));
    }

    // Load existing availability data
    useEffect(() => {
        if (availability && availability.length > 0) {
            const updatedSchedule = schedule.map(daySchedule => {
                const existingAvailability = availability.find(
                    (avail) => avail.type === 'recurring' && avail.dayOfWeek === daySchedule.dayOfWeek
                )

                if (existingAvailability) {
                    return {
                        ...daySchedule,
                        timeSlots: existingAvailability.timeSlots || [],
                        hourlyRate: existingAvailability.hourlyRate
                    }
                }
                return daySchedule;
            })
            setSchedule(updatedSchedule);

            // Set global availability status based on if any schedule exists
            setIsAvailable(availability.some(avail => avail.isActive));
        }
    }, [availability]);

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
        const slotStart = parseTime(timeSlot.startTime);
        const slotEnd = parseTime(timeSlot.endTime);
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
                    startTime: '09:00',
                    endTime: '17:00'
                }
                return {
                    ...d,
                    timeSlots: [...d.timeSlots, newSlot]
                }
            })
        )
    };

    const handleTimeChange = (day: string, slotId: string, type: string, value: string) => {
        setSchedule(prev =>
            prev.map(d => {
                if (d.day !== day) return d;
                return {
                    ...d,
                    timeSlots: d.timeSlots.map(slot =>
                        slot.id === slotId ? {...slot, [type]: value} : slot
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

    const handleHourlyRateChange = (day: string, rate: number) => {
        setSchedule(prev =>
            prev.map(d => {
                if (d.day !== day) return d;
                return {...d, hourlyRate: rate};
            })
        )
    }

    const handleRemoveSession = (day: string, sessionId: string) => {
        setSchedule(prev =>
            prev.map(d => {
                if (d.day !== day) return d;
                return {...d, excludedSessions: [...d.excludedSessions, sessionId]};
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

    const saveAvailability = async () => {
        try {
            setSaving(true);

            // Save each day's schedule
            for (const daySchedule of schedule) {
                if (daySchedule.timeSlots.length > 0) {
                    const availabilityData = {
                        type: 'recurring' as const,
                        dayOfWeek: daySchedule.dayOfWeek,
                        timeSlots: daySchedule.timeSlots,
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        hourlyRate: daySchedule.hourlyRate,
                    }

                    // Check if availability already exists for this day
                    const existingAvailability = availability?.find(
                        (avail) => avail.type === 'recurring' && avail.dayOfWeek === daySchedule.dayOfWeek
                    )

                    if (existingAvailability) {
                        await updateAvailability(availabilityData)
                    } else {
                        await createAvailability(availabilityData)
                    }
                }
            }

            // Handle blackout dates (specific dates)
            for (const date of blackoutDates) {
                const blackoutData = {
                    type: 'specific_date' as const,
                    specificDate: date,
                    specificTimeDate: [], // No time slots for blackout dates
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    hourlyRate: 0
                };
                await createAvailability(blackoutData)
            }

            await refetch()
            toast.success("Availability updated successfully")
        } catch (error: any) {
            console.error("Error saving availability", error)
            toast.error(error.message)
        } finally {
            setSaving(false);
        }
    }

    const handleDeleteDay = async (dayOfWeek: number) => {
        try {
            const exisitingAvailability = availability?.find(
                (avail) => avail.type === 'recurring' && avail.dayOfWeek === dayOfWeek
            )

            if (exisitingAvailability) {
                await deleteAvailability(exisitingAvailability._id)
                await refetch()
                toast.success("Day availability deleted successfully")
            }
        } catch (error: any) {
            console.error("Error deleting availability", error)
            toast.error(error.message)
        }
    }

    if (error) {
        return (
            <MainLayout>
                <div className={'p-4'}>
                    <div className='rounded-lg bg-red-50 dark:bg-red-900/20 p-6 text-center'>
                        <AlertCircle className={'h-12 w-12 text-red-500 mx-auto mb-4'}/>
                        <h2 className={'text-xl font-semibold text-red-800 dark:text-red-300 mb-2'}>
                            Error Loading Availability
                        </h2>
                        <p className={'text-red-600 dark:text-red-400 mb-4'}>{error}</p>
                        <Button onClick={refetch} className={'bg-red-600 text-white hover:bg-red-700'}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </MainLayout>
        )
    }

    if (loading && !availability) {
        return (
            <MainLayout>
                <div className={'p-4'}>
                    <AvailabilitySkeleton/>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="p-4 space-y-8 dark:text-white">
                {/*Header with a Save button*/}
                <div className={'flex justify-between items-center'}>
                    <h1 className={'text-2xl font-bold text-black dark:text-white'}>Availability Management</h1>
                    <div className={'flex gap-2'}>
                        <Button onClick={refetch} variant={'outline'} disabled={loading || saving}>
                            {loading && <Loader2 className={'mr-2 h-4 w-4 animate-spin dark:text-black'}/>}
                            Refresh
                        </Button>
                        <Button
                            onClick={saveAvailability}
                            disabled={saving}
                            className={'dashbutton bg-green-600 text-white hover:bg-green-700'}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Availability Toggle */}
                <div className="rounded-xl p-6 shadow-lg secondbg dark:!text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground dark:text-white">Availability
                                Status</h2>
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
                <div
                    className={`rounded-xl p-6 shadow-lg secondbg dark:!text-white ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className={'h-5 w-5'}/>
                        <h2 className="text-xl font-semibold text-foreground dark:text-white">Session Settings</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground dark:text-white">
                                Session Duration
                            </label>
                            <Select value={sessionDuration} onValueChange={setSessionDuration}>
                                <SelectTrigger className="h-12 text-black">
                                    <SelectValue/>
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
                                    <SelectValue/>
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
                <div
                    className={`rounded-xl p-6 shadow-lg secondbg dark:!text-white space-y-4 ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-between">
                        <div className={'flex items-center gap-2'}>
                            <Calendar className={'h-5 w-5'}/>
                            <h2 className="text-xl font-semibold text-foreground dark:text-white">Weekly Schedule</h2>
                        </div>
                    </div>

                    <div className="space-y-4 ">
                        {schedule.map(daySchedule => (
                            <div key={daySchedule.day} className="p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-medium text-foreground dark:text-white">{daySchedule.day}</h3>
                                    <div className={'flex items-center gap-2'}>
                                        <span
                                            className={'text-sm text-foreground dark:text-white'}>Hourly Rate: $</span>
                                        <input
                                            type="number"
                                            min={'0'}
                                            step={'5'}
                                            value={daySchedule.hourlyRate}
                                            onChange={(e) => handleHourlyRateChange(daySchedule.day, parseInt(e.target.value) || 0)}
                                            className={'w-20 h-8 text-center dark:text-black'}
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="dashbutton text-white"
                                        onClick={() => handleAddTimeSlot(daySchedule.day)}
                                    >
                                        + Add Time Slot
                                    </Button>
                                    {daySchedule.timeSlots.length > 0 && (
                                        <Button
                                            variant={'destructive'}
                                            size="sm"
                                            onClick={() => handleDeleteDay(daySchedule.dayOfWeek)}
                                        >
                                            Clear Day
                                        </Button>
                                    )}
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
                                            No time slots added for {daySchedule.day}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Blackout Dates */}
                <div
                    className={`rounded-xl p-6 shadow-lg secondbg dark:!text-white ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={'flex items-center gap-2'}>
                            <X className={'h-5 w-5'}/>
                            <h2 className="text-xl font-semibold text-foreground dark:text-white">Blackout Dates</h2>
                        </div>

                        <div className="flex gap-2">
                            {showDateInput && (
                                <Input
                                    type="date"
                                    className="w-40 secondbg"
                                    value={newDateInput}
                                    onChange={(e) => setNewDateInput(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="dashbutton text-white"
                                onClick={showDateInput ? handleAddBlackoutDate : () => setShowDateInput(true)}
                                disabled={showDateInput && !newDateInput}
                            >
                                {showDateInput ? 'Confirm' : '+ Add Date'}
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg p-1 space-y-2 ">
                        {blackoutDates.length > 0 ? (
                            blackoutDates.map(date => (
                                <div key={date}
                                     className="flex items-center border-gray-700 border justify-between p-2 rounded">
                                    <span className="text-sm text-foreground dark:text-white">
                                        {new Date(date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className=" text-white"
                                        onClick={() => setBlackoutDates(prev => prev.filter(d => d !== date))}
                                    >
                                        <X className="w-6 h-6 text-red-700"/>
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

            {/*  Current Availability Summary  */}
            {availability && availability.length > 0 && (
                <div className={'rounded-xl p-6 shadow-lg secondbg dark:!text-white'}>
                    <h2 className={'text-xl font-semibold text-foreground dark:text-white mb-4'}>
                        Current Availability Summary
                    </h2>
                    <div className={'grid gap-4 md:grid-cols-2 lg:grid-cols-3'}>
                        {availability
                            .filter(avail => avail.type === 'recurring')
                            .map(avail => (
                                <div key={avail._id} className={'p-3 border rounded-lg'}>
                                    <h3 className={'font-medium text-foreground dark:text-white'}>
                                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][avail.dayOfWeek || 0]}
                                    </h3>
                                    <p className={'text-sm text-muted-foreground dark:text-white'}>
                                        Rate: ${avail.hourlyRate}/hour
                                    </p>
                                    <p className={'text-sm text-muted-foreground dark:text-white'}>
                                        {avail.timeSlots?.length || 0} time slots
                                    </p>
                                    <p className={'text-sm text-muted-foreground dark:text-white'}>
                                        Status: {avail.isActive ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

interface TimeSlotSelectorProps {
    day: string;
    slot: TimeSlot;
    sessions: Session[];
    onTimeChange: (type: string, value: string) => void;
    onRemoveSlot: () => void;
    onRemoveSession: (day: string, sessionId: string) => void;
}

function TimeSlotSelector({day, slot, sessions, onTimeChange, onRemoveSlot, onRemoveSession}: TimeSlotSelectorProps) {
    return (
        <div className="space-y-4 p-4 rounded-lg border border-gray-700 dark:border-gray-300 secondbg mb-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                    <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => onTimeChange('startTime', e.target.value)}
                        className="w-[120px] secondbg border border-gray-700 focus:border-transparent focus:ring-0"
                    />
                    <span className="text-muted-foreground dark:text-white">to</span>
                    <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => onTimeChange('endTime', e.target.value)}
                        className="w-[120px] secondbg border border-gray-700 focus:border-transparent focus:ring-0"
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
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
                    <div className="flex flex-col">
                        {sessions.map((session, index) => (
                            <div key={session.id} className="flex items-center p-1">
                <span className="text-xs text-foreground dark:text-white w-24">
                  Session {index + 1}:
                </span>
                                <span className="text-xs text-foreground dark:text-white w-32">
                  {session.start} - {session.end}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-3 text-center rounded">
                    <p className="text-sm text-muted-foreground dark:text-white">
                        No sessions available in this time slot
                    </p>
                </div>
            )}
        </div>
    );
}
