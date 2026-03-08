import {useEffect, useMemo, useState} from "react";
import api from "@/utils/api";
import {Clock, MessageSquare} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/dashboard/Innovator/components/ui/dialog";
import {Button} from "@/dashboard/Innovator/components/ui/button";
import {Input} from "@/dashboard/Innovator/components/ui/input";
import {toast} from "react-toastify";
import {format, addDays} from "date-fns";
import {
    Elements,
} from "@stripe/react-stripe-js";
import {stripePromise} from "@/lib/stripe";
import {SessionPaymentForm} from "@/utils/SessionPaymentForm";

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
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

interface Props {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>> | ((open: boolean) => void);
    mentorId: string;
    mentorName: string;
    mentorHourlyRate: number;
    onConfirm: (
        date: string,
        timeSlot: { id: string; startTime: string; endTime: string },
        topic: string
    ) => void;
}

export function BookSessionDialog({
                                      open,
                                      onOpenChange,
                                      mentorId,
                                      mentorName,
                                      mentorHourlyRate,
                                      onConfirm
                                  }: Props) {
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [step, setStep] = useState<"form" | "payment">("form");


    console.log("mentorId:", mentorId);
    /* ================= LOAD AVAILABILITY ================= */
    useEffect(() => {
        if (!open || !mentorId) return;

        const load = async () => {
            try {
                const res = await api.get(
                    `/mentees/mentors/${mentorId}/availability`,
                    {withCredentials: true}
                );

                const av = res.data?.data ?? [];

                const normalized = av.map((a: any) => ({
                    ...a,
                    dayOfWeek:
                        typeof a.dayOfWeek === "string"
                            ? [
                                "SUNDAY",
                                "MONDAY",
                                "TUESDAY",
                                "WEDNESDAY",
                                "THURSDAY",
                                "FRIDAY",
                                "SATURDAY",
                            ].indexOf(a.dayOfWeek)
                            : a.dayOfWeek,
                }));

                setAvailability(normalized);
            } catch (err) {
                toast.error("Failed to load availability");
            }
        };

        load();
    }, [open, mentorId]);
    console.log("Selected Slot:", selectedTimeSlot);

    /* ================= COMPUTE AVAILABLE DATES ================= */
    useEffect(() => {
        if (!availability.length) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = new Set<string>();

        availability.forEach((a) => {
            if (a.type === "recurring" && typeof a.dayOfWeek === "number") {
                for (let i = 0; i < 60; i++) {
                    const d = addDays(today, i);
                    if (d.getDay() === a.dayOfWeek) {
                        result.add(format(d, "yyyy-MM-dd"));
                    }
                }
            }

            if (a.type === "specific_date" && a.specificDate) {
                const d = new Date(a.specificDate);
                if (d >= today) {
                    result.add(format(d, "yyyy-MM-dd"));
                }
            }
        });

        setAvailableDates([...result].sort());
    }, [availability]);

    /* ================= COMPUTE AVAILABLE SLOTS ================= */
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

        return slots.map((s, i) => ({...s, id: s.id ?? `${i}`}));
    }, [selectedDate, availability]);

    /* ================= CREATE BOOKING ================= */
    const handleCreateBooking = async () => {
        if (!selectedDate || !selectedTimeSlot || !topic.trim()) {
            toast.error("Fill all fields");
            return;
        }

        // Build proper Date objects
        const start = new Date(`${selectedDate}T${selectedTimeSlot.startTime}:00`);
        const end = new Date(`${selectedDate}T${selectedTimeSlot.endTime}:00`);

        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            toast.error("Invalid time selected");
            return;
        }

        // Calculate duration safely (in minutes)
        const duration = Math.round((end.getTime() - start.getTime()) / 60000);

        if (duration <= 0) {
            toast.error("Invalid session duration");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                mentorId,
                requestedDate: start.toISOString(),
                requestedEndTime: end.toISOString(),
                duration,
                topic,
                description: `Session on ${topic}`,
            };

            console.log("Payload being sent:", payload);

            const res = await api.post(
                "/mentees/sessions/book",
                payload,
                {withCredentials: true}
            );

            setClientSecret(res.data.data.clientSecret);
            setStep("payment");

        } catch (err: any) {
            console.log("FULL ERROR:", err);
            console.log("RESPONSE:", err?.response);
            console.log("DATA:", err?.response?.data);
            toast.error(err?.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    /* ================= PAYMENT SUCCESS ================= */
    const handlePaymentSuccess = () => {
        toast.success("Session booked successfully 🎉");

        resetState();
        onOpenChange(false);
    };

    /* ================= RESET ================= */
    const resetState = () => {
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setTopic("");
        setClientSecret(null);
        setStep("form");
    };

    /* ================= RENDER ================= */
    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) resetState();
                onOpenChange(value);
            }}
        >
            <DialogContent className="sm:max-w-md secondbg">

                {/* ================= FORM STEP ================= */}
                {step === "form" && (
                    <>
                        <DialogTitle className="text-lg font-semibold">
                            Book a session with {mentorName}
                        </DialogTitle>
                        <p className={'text-sm text-muted-foreground mt-1'}>
                            Session rate: ${mentorHourlyRate.toFixed(2)}
                        </p>

                        <div className="mt-4 space-y-6">

                            {/* DATE */}
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

                            {/* TIME */}
                            {selectedDate && (
                                <div>
                                    <h3 className="mb-1 font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4"/>
                                        Choose a Time Slot
                                    </h3>

                                    <div className="space-y-2">
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot.id}
                                                onClick={() =>
                                                    setSelectedTimeSlot(slot)
                                                }
                                                className={`border p-2 rounded w-full flex justify-between ${
                                                    selectedTimeSlot?.id ===
                                                    slot.id
                                                        ? "bg-primary text-white"
                                                        : "opacity-80 hover:opacity-100"
                                                }`}
                                            >
                                                {slot.startTime} –{" "}
                                                {slot.endTime}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TOPIC */}
                            {selectedTimeSlot && (
                                <div>
                                    <h3 className="mb-1 font-medium flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4"/>
                                        Topic
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
                                onClick={handleCreateBooking}
                                disabled={
                                    !selectedTimeSlot ||
                                    !topic.trim() ||
                                    loading
                                }
                            >
                                {loading
                                    ? "Processing..."
                                    : "Continue to Payment"}
                            </Button>
                        </div>
                    </>
                )}

                {/* ================= PAYMENT STEP ================= */}
                {step === "payment" && clientSecret && (
                    <>
                        <DialogTitle className="text-lg font-semibold">
                            Complete Payment
                        </DialogTitle>

                        <Elements
                            stripe={stripePromise}
                            options={{clientSecret}}
                        >
                            <SessionPaymentForm
                                onSuccess={handlePaymentSuccess}
                            />
                        </Elements>

                        <div className="mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setStep("form")}
                            >
                                Back
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}