import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Clock, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/dashboard/Innovator/components/ui/dialog";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import { Input } from "@/dashboard/Innovator/components/ui/input";
import { toast } from "react-toastify";
import { format, addDays } from "date-fns";

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    rate?: number;
}

interface Availability {
    _id: string;
    type: "recurring" | "specific_date";
    dayOfWeek?: number;
    specificDate?: string;
    timeSlots?: TimeSlot[];
    specificTimeSlots?: TimeSlot[];
    timezone: string;
    hourlyRate: number;
}

export function BookSessionDialog({
                                      open,
                                      onOpenChange,
                                      mentorId,
                                      mentorName,
                                  }: any) {
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [bookedSlots, setBookedSlots] = useState<any[]>([]);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !mentorId) return;

        const load = async () => {
            try {
                const [availRes, bookedRes] = await Promise.all([
                    axios.get(`/api/mentees/mentors/${mentorId}/availability`, { withCredentials: true }),
                    axios.get(`/api/mentees/mentors/${mentorId}/booked-slots`, { withCredentials: true }),
                ]);

                const av = availRes.data?.data ?? [];
                const booked = bookedRes.data?.data ?? [];

                const normalized = av.map((a: any) => ({
                    ...a,
                    dayOfWeek:
                        typeof a.dayOfWeek === "string"
                            ? ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"].indexOf(a.dayOfWeek)
                            : a.dayOfWeek,
                }));

                setAvailability(normalized);
                setBookedSlots(booked);
            } catch (err: any) {
                console.error(err);
                toast.error("Failed to load availability");
            }
        };

        load();
    }, [open, mentorId]);

    useEffect(() => {
        if (!availability.length) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = new Set<string>();

        availability.forEach((a) => {
            // recurring
            if (a.type === "recurring" && typeof a.dayOfWeek === "number") {
                for (let i = 0; i < 60; i++) {
                    const d = addDays(today, i);
                    if (d.getDay() === a.dayOfWeek) {
                        result.add(format(d, "yyyy-MM-dd"));
                    }
                }
            }

            // specific_date
            if (a.type === "specific_date" && a.specificDate) {
                const d = new Date(a.specificDate);
                if (d >= today) {
                    result.add(format(d, "yyyy-MM-dd"));
                }
            }
        });

        setAvailableDates([...result].sort());
    }, [availability]);

    const availableSlots = useMemo(() => {
        if (!selectedDate) return [];

        const weekday = new Date(selectedDate).getDay();

        let slots: TimeSlot[] = [];

        availability.forEach((a) => {
            if (a.type === "recurring" && a.dayOfWeek === weekday) {
                slots.push(...(a.timeSlots ?? []));
            }

            if (
                a.type === "specific_date" &&
                a.specificDate &&
                format(new Date(a.specificDate), "yyyy-MM-dd") === selectedDate
            ) {
                slots.push(...(a.specificTimeSlots ?? []));
            }
        });

        return slots.map((s, i) => ({ ...s, id: s.id ?? `${i}` }));
    }, [selectedDate, availability]);

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTimeSlot || !topic.trim()) {
            toast.error("Fill all fields");
            return;
        }

        const start = new Date(`${selectedDate}T${selectedTimeSlot.startTime}:00`);
        const end = new Date(`${selectedDate}T${selectedTimeSlot.endTime}:00`);
        const duration =
            parseInt(selectedTimeSlot.endTime.slice(0, 2)) * 60 +
            parseInt(selectedTimeSlot.endTime.slice(3)) -
            (parseInt(selectedTimeSlot.startTime.slice(0, 2)) * 60 +
                parseInt(selectedTimeSlot.startTime.slice(3)));

        setLoading(true);

        try {
            await axios.post(
                "/api/mentees/sessions/book",
                {
                    mentorId,
                    requestedDate: start.toISOString(),
                    requestedEndTime: end.toISOString(),
                    duration,
                    topic,
                    description: `Session on ${topic}`,
                },
                { withCredentials: true }
            );

            toast.success("Session requested!");
            onOpenChange(false);
            setTopic("");
            setSelectedDate(null);
            setSelectedTimeSlot(null);
        } catch (err: any) {
            console.error("Booking error:", err?.response?.data);
            toast.error(err?.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md secondbg">
                <DialogTitle className="text-lg font-semibold">
                    Book a session with {mentorName}
                </DialogTitle>

                <div className="mt-4 space-y-6">
                    {/* DATE SELECTION */}
                    <div>
                        <h3 className="mb-1 font-medium">Select Date</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableDates.map((date) => (
                                <button
                                    key={date}
                                    onClick={() => {
                                        setSelectedDate(date);
                                        setSelectedTimeSlot(null);
                                    }}
                                    className={`border px-3 py-2 rounded ${
                                        selectedDate === date
                                            ? "bg-primary text-white"
                                            : "opacity-80 hover:opacity-100"
                                    }`}
                                >
                                    {format(new Date(date), "EEE, MMM d")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TIME SLOTS */}
                    {selectedDate && (
                        <div>
                            <h3 className="mb-1 font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Choose a Time Slot
                            </h3>

                            <div className="space-y-2">
                                {availableSlots.length === 0 ? (
                                    <p className="text-sm opacity-70">
                                        No available slots.
                                    </p>
                                ) : (
                                    availableSlots.map((slot) => (
                                        <button
                                            key={slot.id}
                                            onClick={() =>
                                                setSelectedTimeSlot(slot)
                                            }
                                            className={`border p-2 rounded w-full flex justify-between ${
                                                selectedTimeSlot?.id === slot.id
                                                    ? "bg-primary text-white"
                                                    : "opacity-80 hover:opacity-100"
                                            }`}
                                        >
                                            <span>
                                                {slot.startTime} –{" "}
                                                {slot.endTime}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* TOPIC INPUT */}
                    {selectedTimeSlot && (
                        <div>
                            <h3 className="mb-1 font-medium flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Topic
                            </h3>
                            <Input
                                value={topic}
                                onChange={(e) =>
                                    setTopic(e.target.value)
                                }
                                placeholder="What would you like to discuss?"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedTimeSlot || !topic.trim() || loading}
                    >
                        {loading ? "Sending..." : "Send Request"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
