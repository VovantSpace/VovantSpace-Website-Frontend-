import {useEffect, useMemo, useState} from "react"
import axios from "axios"
import {Clock, MessageSquare} from "lucide-react"
import {Dialog, DialogContent, DialogTitle} from "@/dashboard/Innovator/components/ui/dialog"
import {Button} from "@/dashboard/Innovator/components/ui/button"
import {Input} from "@/dashboard/Innovator/components/ui/input"
import {format, addDays} from "date-fns"
import {toast} from "react-toastify";

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string
}

interface Availability {
    _id: string
    type: "recurring" | "specific_date"
    dayOfWeek?: number | string
    timeSlots?: TimeSlot[]
    specificDate?: string
    specificTimeDate?: TimeSlot[]
    specificTimeSlots?: TimeSlot[]  // Added to match API response
    timeZone: string
    hourlyRate: number
}

interface BookSessionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mentorId: string | null
    mentorName: string
    mentorHourlyRate: number;
    onConfirm?: (date: string, timeSlot: TimeSlot, topic: string) => void;
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
    const [fetchError, setFetchError] = useState<string | null>(null)

    const mapEnumToDay: Record<string, number> = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
    };

    // Fetch mentor availability and booked slots
    useEffect(() => {
        if (!open || !mentorId) return

        const load = async () => {
            setFetchError(null)
            try {
                console.log('Fetching availability for mentor:', mentorId)

                const [mentorRes, bookedRes] = await Promise.all([
                    axios.get(`/api/mentees/mentors/${mentorId}/availability`, {withCredentials: true}),
                    axios.get(`/api/mentor/${mentorId}/booked-slots`, {withCredentials: true}),
                ])


                // Handle different response structures
                const availabilityData = mentorRes.data?.data?.availability || mentorRes.data?.data || []
                const bookedData = bookedRes.data?.data || []

                console.log('Raw availability response:', mentorRes.data)
                console.log('Processed availability:', availabilityData)
                console.log('Booked slots:', bookedData)

                // Normalize availability data
                const normalizedAvailability = availabilityData.map((a: any) => {
                    let dayOfWeek = a.dayOfWeek

                    // Convert string day to number if needed
                    if (typeof dayOfWeek === 'string') {
                        dayOfWeek = mapEnumToDay[dayOfWeek.toUpperCase()] ?? dayOfWeek
                    }

                    const normalized = {
                        ...a,
                        dayOfWeek,
                        type: a.type,
                        timeZone: a.timeZone || a.timezone || "UTC",
                        timeSlots: a.timeSlots || [],
                        specificTimeDate: a.specificTimeSlots || a.specificTineDate || [],
                        hourlyRate: a.hourlyRate || 0
                    }

                    // Debug logging
                    if (normalized.type === "specific_date") {
                        console.log("📅 Found specific-date availability:", normalized);
                    } else {
                        console.log("📆 Found recurring availability:", normalized);
                    }

                    return normalized;
                })

                console.log("Normalized availability:", normalizedAvailability)

                setAvailability(normalizedAvailability)
                setBookedSlots(bookedData)

                if (normalizedAvailability.length === 0) {
                    setFetchError('This mentor has not set any availability yet.')
                }
            } catch (err: any) {
                console.error("Failed to fetch availability or booked slots", err)
                setFetchError(err.response?.data?.message || 'Failed to load availability')
                toast.error('Failed to load mentor availability')
            }
        }
        load()
    }, [open, mentorId])

    // Compute the next available dates from recurring/specific
    useEffect(() => {
        if (!availability.length) {
            setAvailableDates([]);
            return;
        }

        const upcoming: Set<string> = new Set(); // avoid duplicates
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        availability.forEach((a) => {
            // 🗓 Handle recurring availability
            if (a.type === "recurring" && a.dayOfWeek !== undefined && a.timeSlots && a.timeSlots.length > 0) {
                let numericDay: number | undefined;

                if (typeof a.dayOfWeek === "string") {
                    numericDay = mapEnumToDay[a.dayOfWeek.toUpperCase()];
                } else {
                    numericDay = a.dayOfWeek;
                }

                if (numericDay !== undefined) {
                    // Get next 8 weeks of that weekday
                    for (let i = 0; i < 56; i++) {
                        const date = addDays(today, i);
                        if (date.getDay() === numericDay) {
                            const dateStr = format(date, "yyyy-MM-dd");
                            upcoming.add(dateStr);
                        }
                    }
                }
            }

            // 📅 Handle specific date availability
            if (a.type === "specific_date" && a.specificDate) {
                const specificDate = new Date(a.specificDate);
                specificDate.setHours(0, 0, 0, 0);

                // Normalize time slot property (either from specificTimeSlots or specificTimeDate)
                const specificSlots = a.specificTimeSlots || a.specificTimeDate || [];

                // Only add if the date is in the future and has slots
                if (specificDate >= today && specificSlots.length > 0) {
                    const dateStr = format(specificDate, "yyyy-MM-dd");
                    upcoming.add(dateStr);
                }
            }
        });

        // ✅ Convert Set → sorted array
        const sortedDates = Array.from(upcoming).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        console.log("✅ Computed available dates:", sortedDates);

        setAvailableDates(sortedDates);
    }, [availability]);


    // Derive time slots for selected date
    const availableTimeSlots = useMemo(() => {
        if (!selectedDate) return []

        const date = new Date(selectedDate)
        const weekday = date.getDay();
        const now = new Date()

        let slots: TimeSlot[] = []

        availability.forEach((a) => {
            // Handle recurring slots
            if (a.type === 'recurring' && a.timeSlots) {
                let numericDay: number | undefined =
                    typeof a.dayOfWeek === 'string'
                        ? mapEnumToDay[a.dayOfWeek.toUpperCase()]
                        : a.dayOfWeek;

                if (numericDay === weekday) {
                    slots.push(...a.timeSlots)
                }
            }

            // Handle specific date slots
            if (a.type === 'specific_date' && a.specificDate) {
                const specificDateStr = format(new Date(a.specificDate), "yyyy-MM-dd")
                if (specificDateStr === selectedDate && a.specificTimeDate) {
                    slots.push(...a.specificTimeDate)
                }
            }
        });

        console.log('All slots for date:', slots)

        // Filter out already booked or past slots
        const free = slots.filter((slot) => {
            const slotStart = new Date(`${selectedDate}T${slot.startTime}`)
            const slotEnd = new Date(`${selectedDate}T${slot.endTime}`)

            // Skip if slot is in the past
            if (slotStart < now) {
                console.log('Skipping past slot:', slot)
                return false
            }

            // Check if slot overlaps with any booked slot
            const overlapping = bookedSlots.some((b) => {
                const bookedStart = new Date(b.requestedDate)
                const bookedEnd = new Date(b.requestedEndTime)
                return slotStart < bookedEnd && slotEnd > bookedStart
            })

            if (overlapping) {
                console.log('Skipping booked slot:', slot)
            }

            return !overlapping
        })

        console.log('Free slots:', free)

        // Add unique IDs to slots
        return free.map((s, i) => ({
            ...s,
            id: s.id || `${selectedDate}-${i}`
        }))
    }, [selectedDate, availability, bookedSlots])

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTimeSlot || !topic.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            const payload = {
                mentorId,
                requestedDate: `${selectedDate}T${selectedTimeSlot.startTime}`,
                requestedEndTime: `${selectedDate}T${selectedTimeSlot.endTime}`,
                duration: 30,
                sessionType: "one_time",
                topic: topic.trim(),
                description: `Session on ${topic.trim()}`,
                amount: mentorHourlyRate ?? 0,
            }

            console.log('Booking payload:', payload)

            await axios.post('/api/session/book', payload, {withCredentials: true})

            toast.success("Session request sent successfully!")

            // Reset form
            setSelectedDate(null)
            setSelectedTimeSlot(null)
            setTopic("")

            onOpenChange(false)

            if (onConfirm) {
                onConfirm(selectedDate, selectedTimeSlot, topic)
            }
        } catch (err: any) {
            console.error("Booking error:", err.response?.data || err.message || err)
            toast.error(err.response?.data?.message || "Failed to book session")
        } finally {
            setLoading(false)
        }
    }

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
                            {availableDates.map((date) => (
                                <button
                                    key={date}
                                    onClick={() => {
                                        setSelectedDate(date)
                                        setSelectedTimeSlot(null)
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

                    {/* Time Slot Selection */}
                    {selectedDate && (
                        <div>
                            <h3 className="mb-2 font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4"/>
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
                                <MessageSquare className="h-4 w-4"/>
                                Session Topic
                            </h3>
                            <Input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
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
                        onClick={() => {
                            setSelectedDate(null)
                            setSelectedTimeSlot(null)
                            setTopic("")
                            onOpenChange(false)
                        }}
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
    )
}