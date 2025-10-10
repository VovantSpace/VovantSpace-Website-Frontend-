import {useEffect, useMemo, useState} from "react"
import axios from "axios"
import {Clock, MessageSquare} from "lucide-react"
import {Dialog, DialogContent, DialogTitle} from "@/dashboard/Innovator/components/ui/dialog"
import {Button} from "@/dashboard/Innovator/components/ui/button"
import {Input} from "@/dashboard/Innovator/components/ui/input"
import {format, addDays, nextDay} from "date-fns"
import {toast} from "react-toastify";
import {Mentor} from "@/hooks/useMentor";

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string
    time: string;
    date: string;
}

interface Availability {
    _id: string
    type: "recurring" | "specific_date"
    dayOfWeek?: number | string
    timeSlots?: TimeSlot[]
    specificDate?: string
    specificTimeDate?: TimeSlot[]
    timeZone: string
    hourlyRate: number
}

interface BookSessionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mentorId: Object | null
    mentorName: string
    mentorHourlyRate: number;
    onConfirm: (date: string, timeSlot: {
        id: string;
        startTime: string;
        endTime: string;
    }, topic: string) => void;
}

export function BookSessionDialog({
                                      open,
                                      onOpenChange,
                                      mentorId,
                                      mentorName,
                                      onConfirm,
                                      mentorHourlyRate,
                                  }: BookSessionDialogProps) {
    const [availability, setAvailability] = useState<Availability[]>([])
    const [bookedSlots, setBookedSlots] = useState<{ requestedDate: string; requestedEndTime: string }[]>([])
    const [availableDates, setAvailableDates] = useState<string[]>([])
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
    const [topic, setTopic] = useState("")
    const [loading, setLoading] = useState(false)

    const mapEnumToDay: Record<string, number> = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
    };


    // fetch mentor availability and booked slots
    useEffect(() => {
        if (!open || !mentorId) return

        const load = async () => {
            try {
                const [mentorRes, bookedRes] = await Promise.all([
                    axios.get(`/api/mentees/mentors/${mentorId}/availability`, {withCredentials: true}),
                    axios.get(`/api/mentor/${mentorId}/booked-slots`, {withCredentials: true}),
                ])
                const av = (mentorRes.data?.data?.availability || []).map((a: any) => ({
                    ...a,
                    timeZone: a.timeZone || a.timezone || "UTC"
                }))
                const booked = bookedRes.data?.data || []
                setAvailability(av)
                console.log("Mentor availability fetched:", av)
                setBookedSlots(booked)
            } catch (err) {
                console.error("Failed to fetch availability or booked slots", err)
            }
        }
        load()
    }, [open, mentorId])

    // compute the next few available dates from recurring/specific
    useEffect(() => {
        if (!availability.length) return;

        const upcoming: string[] = [];
        const today = new Date();

        availability.forEach((a) => {
            if (a.type === "recurring" && a.dayOfWeek !== undefined) {
                let numericDay: number | undefined;

                if (typeof a.dayOfWeek === "string") {
                    numericDay = mapEnumToDay[a.dayOfWeek.toUpperCase()];
                } else {
                    numericDay = a.dayOfWeek;
                }

                if (numericDay !== undefined) {
                    for (let i = 0; i < 30; i++) {
                        const date = addDays(today, i)
                        if (date.getDay() === numericDay) {
                            upcoming.push(format(date, "yyyy-MM-dd"));
                        }
                    }
                }
            }

            // One-time availability
            if (a.type === "specific_date") {
                const dateSource = a.specificDate || (a.specificTimeDate?.[0]?.date);
                if (dateSource) {
                    const dateStr = format(new Date(dateSource), "yyyy-MM-dd");
                    if (!upcoming.includes(dateStr)) {
                        upcoming.push(dateStr);
                    }
                }
            }

            // if (a.type === "specific_date" && a.specificDate) {
            //     upcoming.push(format(new Date(a.specificDate), "yyyy-MM-dd"));
            // }
        });

        const uniqueSorted = Array.from(new Set(upcoming)).sort();
        setAvailableDates(uniqueSorted);
    }, [availability]);


    // derive slots for selected date
    const availableTimeSlots = useMemo(() => {
        if (!selectedDate) return []

        const date = new Date(selectedDate)
        const weekday = date.getDay();

        let slots: TimeSlot[] = []

        availability.forEach((a) => {
            // recurring
            if (a.type === 'recurring' && a.timeSlots) {
                let numericDay: number | undefined =
                    typeof a.dayOfWeek === 'string'
                        ? mapEnumToDay[a.dayOfWeek.toUpperCase()]
                        : a.dayOfWeek;

                if (numericDay === weekday) {
                    slots.push(...a.timeSlots)
                }
            }

            // specific date
            if (
                a.type === 'specific_date' &&
                format(new Date(a.specificDate!), "yyyy-MM-dd") === selectedDate &&
                a.specificTimeDate
            ) {
                slots.push(...a.specificTimeDate)
            }
        });


        // filter out already booked or past
        const free = slots.filter((slot) => {
            const slotStart = new Date(`${selectedDate}T${slot.startTime}`)
            const slotEnd = new Date(`${selectedDate}T${slot.endTime}`)
            const now = new Date()

            if (slotStart < now) return false

            const overlapping = bookedSlots.some((b) => {
                const bookedStart = new Date(b.requestedDate)
                const bookedEnd = new Date(b.requestedEndTime)
                return slotStart < bookedEnd && slotEnd > bookedStart
            })
            return !overlapping
        })
        return free.map((s, i) => ({...s, id: `${selectedDate}-${i}`}))
    }, [selectedDate, availability, bookedSlots])

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTimeSlot || !topic) return;
        setLoading(true)
        try {
          const payload = {
              mentorId: typeof mentorId === 'object' ? mentorId?.toString() : mentorId,
              requestedDate: `${selectedDate}T${selectedTimeSlot.startTime}`,
              requestedEndTime: `${selectedDate}T${selectedTimeSlot.endTime}`,
              duration: 30,
              sessionType: "one_time",
              topic,
              description: `Session on ${topic}`,
              amount: mentorHourlyRate ?? 0,
          }

          await axios.post('/api/session/book', payload, {withCredentials: true})

            toast.success("Session request sent successfully!")
            onOpenChange(false)
        } catch (err: any) {
            console.error("Booking error:", err.response?.data || err.message || err)
            toast.error(err.response?.data?.message || "Failed to book session")
        } finally {
            setLoading(false)
        }
    }

    // ---- UI ----
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md secondbg dark:!text-white">
                <DialogTitle className="text-xl font-semibold">
                    Book a Session with {mentorName}
                </DialogTitle>

                <div className="mt-4 space-y-6">
                    {/* Date Selection */}
                    <div>
                        <h3 className="mb-2 font-medium">Select Date</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableDates.length === 0 && (
                                <p className="text-sm text-gray-400">No upcoming availability</p>
                            )}
                            {availableDates.map((date) => (
                                <button
                                    key={date}
                                    onClick={() => {
                                        setSelectedDate(date)
                                        setSelectedTimeSlot(null)
                                    }}
                                    className={`rounded-md border px-4 py-2 text-sm ${
                                        selectedDate === date
                                            ? "border-primary dashbutton text-white"
                                            : "border-gray-700 dark:border-gray-300"
                                    }`}
                                >
                                    {format(new Date(date), "EEE, MMM d")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Slot Selection */}
                    {selectedDate && (
                        <div>
                            <h3 className="mb-2 font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4"/>
                                Available Sessions
                            </h3>
                            {availableTimeSlots.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    No free slots for this date.
                                </p>
                            ) : (
                                <div className="grid gap-2">
                                    {availableTimeSlots.map((slot, i) => (
                                        <button
                                            key={slot.id}
                                            onClick={() => setSelectedTimeSlot(slot)}
                                            className={`flex items-center justify-between rounded-md border p-3 text-sm ${
                                                selectedTimeSlot?.id === slot.id
                                                    ? "dashbutton text-white"
                                                    : "border-gray-700 dark:border-gray-300"
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
                                <MessageSquare className="h-4 w-4"/>
                                Session Topic
                            </h3>
                            <Input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter session topic"
                                className="dark:text-white secondbg border-gray-700 dark:border-gray-300"
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}
                            className="dashbutton  hover:text-black transition-colors duration-300">
                        Cancel
                    </Button>
                    <Button
                        disabled={!selectedDate || !selectedTimeSlot || !topic || loading}
                        onClick={handleConfirm}
                        className="dashbutton !text-white"
                    >
                        {loading ? "Sending..." : "Send Request"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
