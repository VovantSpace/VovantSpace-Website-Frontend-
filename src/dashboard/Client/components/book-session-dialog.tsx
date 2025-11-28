import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Clock, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/dashboard/Innovator/components/ui/dialog";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import { Input } from "@/dashboard/Innovator/components/ui/input";
import { format, addDays } from "date-fns";
import { toast } from "react-toastify";

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
}

interface Availability {
    _id: string;
    type: "recurring" | "specific_date";
    dayOfWeek?: number | string;
    timeSlots?: TimeSlot[];
    specificDate?: string;
    specificTimeSlots?: TimeSlot[];
    timeZone: string;
    hourlyRate: number;
}

interface BookSessionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mentorId: string | null;
    mentorName: string;
    mentorHourlyRate: number;
    onConfirm?: (date: string, timeSlot: TimeSlot, topic: string) => void;
}

const mapEnumToDay: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
};

export function BookSessionDialog({
                                      open,
                                      onOpenChange,
                                      mentorId,
                                      mentorName,
                                      mentorHourlyRate,
                                      onConfirm,
                                  }: BookSessionDialogProps) {
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [bookedSlots, setBookedSlots] = useState<{ requestedDate: string; requestedEndTime: string }[]>([]);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Fetch availability + booked slots
    useEffect(() => {
        if (!open || !mentorId) return;

        const load = async () => {
            setFetchError(null);
            try {
                const [mentorRes, bookedRes] = await Promise.all([
                    axios.get(`/api/mentees/mentors/${mentorId}/availability`, { withCredentials: true }),
                    axios.get(`/api/mentees/mentors/${mentorId}/booked-slots`, { withCredentials: true }),
                ]);

                const availabilityData: any[] = mentorRes.data?.data || [];
                const bookedData = bookedRes.data?.data || [];

                const normalizedAvailability: Availability[] = availabilityData.map((a: any) => {
                    let dayOfWeek: string | number | undefined = a.dayOfWeek;

                    if (typeof dayOfWeek === "string") {
                        dayOfWeek = mapEnumToDay[dayOfWeek.toUpperCase()] ?? dayOfWeek;
                    }

                    return {
                        _id: a._id,
                        type: a.type,
                        dayOfWeek,
                        specificDate: a.specificDate,
                        timeSlots: Array.isArray(a.timeSlots) ? a.timeSlots : [],
                        specificTimeSlots: Array.isArray(a.specificTimeSlots) ? a.specificTimeSlots : [],
                        timeZone: a.timeZone || a.timezone || "UTC",
                        hourlyRate: a.hourlyRate || 0,
                    };
                });

                setAvailability(normalizedAvailability);
                setBookedSlots(bookedData);

                if (normalizedAvailability.length === 0) {
                    setFetchError("This mentor has not set any availability yet.");
                }
            } catch (err: any) {
                console.error("Failed to fetch availability or booked slots", err);
                setFetchError(err.response?.data?.message || "Failed to load availability");
                toast.error("Failed to load mentor availability");
            }
        };

        load();
    }, [open, mentorId]);

    // Compute next available dates (recurring + specific_date with slots)
    useEffect(() => {
        if (!availability.length) {
            setAvailableDates([]);
            return;
        }

        const upcoming = new Set<string>();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        availability.forEach(a => {
            // Recurring
            if (a.type === "recurring" && a.dayOfWeek !== undefined && Array.isArray(a.timeSlots) && a.timeSlots.length > 0) {
                const numericDay = typeof a.dayOfWeek === "number"
                    ? a.dayOfWeek
                    : mapEnumToDay[String(a.dayOfWeek).toUpperCase()];

                if (numericDay !== undefined) {
                    for (let i = 0; i < 56; i++) {
                        const date = addDays(today, i);
                        if (date.getDay() === numericDay) {
                            upcoming.add(format(date, "yyyy-MM-dd"));
                        }
                    }
                }
            }

            // Specific date with actual slots (not blackout)
            if (a.type === "specific_date" && a.specificDate && Array.isArray(a.specificTimeSlots) && a.specificTimeSlots.length > 0) {
                const specificDate = new Date(a.specificDate);
                specificDate.setHours(0, 0, 0, 0);
                if (specificDate >= today) {
                    upcoming.add(format(specificDate, "yyyy-MM-dd"));
                }
            }
        });

        const sorted = Array.from(upcoming).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        setAvailableDates(sorted);
    }, [availability]);

    // Time slots for selected date
    const availableTimeSlots = useMemo(() => {
        if (!selectedDate) return [];

        const date = new Date(selectedDate);
        const weekday = date.getDay();
        const now = new Date();

        let slots: TimeSlot[] = [];

        availability.forEach(a => {
            // Recurring
            if (a.type === "recurring" && Array.isArray(a.timeSlots) && a.timeSlots.length > 0) {
                const numericDay = typeof a.dayOfWeek === "number"
                    ? a.dayOfWeek
                    : mapEnumToDay[String(a.dayOfWeek).toUpperCase()];

                if (numericDay === weekday) {
                    slots.push(...a.timeSlots);
                }
            }

            // Specific date
            if (a.type === "specific_date" && a.specificDate && Array.isArray(a.specificTimeSlots)) {
                const specificStr = format(new Date(a.specificDate), "yyyy-MM-dd");
                if (specificStr === selectedDate) {
                    slots.push(...a.specificTimeSlots);
                }
            }
        });

        // Filter out past + overlapping
        const free = slots.filter(slot => {
            const slotStart = new Date(`${selectedDate}T${slot.startTime}`);
            const slotEnd = new Date(`${selectedDate}T${slot.endTime}`);

            if (slotStart < now) return false;

            const overlapping = bookedSlots.some(b => {
                const bookedStart = new Date(b.requestedDate);
                const bookedEnd = new Date(b.requestedEndTime);
                return slotStart < bookedEnd && slotEnd > bookedStart;
            });

            return !overlapping;
        });

        return free.map((s, i) => ({
            ...s,
            id: s.id || `${selectedDate}-${i}`,
        }));
    }, [selectedDate, availability, bookedSlots]);

    const toIso = (dateStr: string, timeStr: string) => {
        const [hour, minPart = "00"] = timeStr.split(":");
        const hourPadded = hour.padStart(2, "0");
        const minute = minPart.replace(/\D/g, "") || "00";
        const formatted = `${dateStr}T${hourPadded}:${minute}:00`;
        return new Date(formatted).toISOString();
    };

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTimeSlot || !topic.trim() || !mentorId) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                mentorId,
                requestedDate: toIso(selectedDate, selectedTimeSlot.startTime),
                requestedEndTime: toIso(selectedDate, selectedTimeSlot.endTime),
                duration: 60,
                sessionType: "one_time",
                topic: topic.trim(),
                description: `Session on ${topic.trim()}`,
                // amount is computed on backend using mentor's hourlyRate & duration
            };

            console.log("Booking payload:", payload);

            const res = await axios.post("/api/mentees/sessions/book", payload, {
                withCredentials: true,
            });

            toast.success("Session request sent successfully!");

            if (onConfirm) {
                onConfirm(selectedDate, selectedTimeSlot, topic.trim());
            }

            // Reset + close
            setSelectedDate(null);
            setSelectedTimeSlot(null);
            setTopic("");
            onOpenChange(false);
        } catch (err: any) {
            const status = err.response?.status;
            const message =
                err.response?.data?.message ||
                err.message ||
                "Something went wrong while booking this session.";

            console.error("Booking error:", err.response?.data || err.message || err);

            if (status === 409) {
                toast.warning(message);
            } else if (status === 400) {
                toast.error(message);
            } else {
                toast.error("Server error. Please try again");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setTopic("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md secondbg dark:!text-white">
                <DialogTitle className="text-xl font-semibold">
                    Book a Session with {mentorName}
                </DialogTitle>

                {fetchError && (
                    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-800 dark:text-red-200">
                        {fetchError}
                    </div>
                )}

                <div className="mt-4 space-y-6">
                    {/* Date Selection */}
                    <div>
                        <h3 className="mb-2 font-medium">Select Date</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableDates.length === 0 && !fetchError && (
                                <p className="text-sm text-gray-400">Loading availability...</p>
                            )}
                            {availableDates.length === 0 && availability.length > 0 && !fetchError && (
                                <p className="text-sm text-gray-400">No upcoming availability</p>
                            )}
                            {availableDates.map(date => (
                                <button
                                    key={date}
                                    onClick={() => {
                                        setSelectedDate(date);
                                        setSelectedTimeSlot(null);
                                    }}
                                    className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                                        selectedDate === date
                                            ? "border-primary dashbutton text-white"
                                            : "border-gray-700 dark:border-gray-300 hover:border-primary"
                                    }`}
                                >
                                    {format(new Date(date), "EEE, MMM d")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                        <div>
                            <h3 className="mb-2 font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Available Time Slots
                            </h3>
                            {availableTimeSlots.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    No available slots for this date.
                                </p>
                            ) : (
                                <div className="grid gap-2">
                                    {availableTimeSlots.map((slot, i) => (
                                        <button
                                            key={slot.id}
                                            onClick={() => setSelectedTimeSlot(slot)}
                                            className={`flex items-center justify-between rounded-md border p-3 text-sm transition-colors ${
                                                selectedTimeSlot?.id === slot.id
                                                    ? "dashbutton text-white"
                                                    : "border-gray-700 dark:border-gray-300 hover:border-primary"
                                            }`}
                                        >
                                            <div className="font-medium">Slot {i + 1}</div>
                                            <div>
                                                {slot.startTime} – {slot.endTime}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Topic Input */}
                    {selectedTimeSlot && (
                        <div>
                            <h3 className="mb-2 font-medium flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Session Topic
                            </h3>
                            <Input
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                placeholder="What would you like to discuss?"
                                className="dark:text-white secondbg border-gray-700 dark:border-gray-300"
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="dashbutton hover:text-black transition-colors duration-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!selectedDate || !selectedTimeSlot || !topic.trim() || loading}
                        onClick={handleConfirm}
                        className="dashbutton !text-white"
                    >
                        {loading ? "Sending..." : "Send Request"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
