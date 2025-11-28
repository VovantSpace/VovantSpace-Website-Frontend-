import { useEffect, useState } from "react";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/dashboard/Innovator/components/ui/select";
import { Input } from "@/dashboard/Innovator/components/ui/input";
import { X, AlertCircle, Loader2, Calendar, Clock } from "lucide-react";
import { MainLayout } from "../../../component/main-layout";
import { Switch } from "@/dashboard/Innovator/components/ui/switch";
import { useAvailability } from "@/hooks/useMentor";
import { toast } from "react-toastify";

type Session = {
    id: string;
    start: string;
    end: string;
};

type TimeSlot = {
    id: string;
    startTime: string;
    endTime: string;
    rate: number;
};

type DaySchedule = {
    day: string;
    dayOfWeek: number; // 0–6 (Sun–Sat)
    timeSlots: TimeSlot[];
    excludedSessions: string[];
    hourlyRate: number;
};

// Helpers to convert between FE numeric dayOfWeek and BE enum strings
const DAY_INDEX_TO_ENUM: Record<number, string> = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
};

const DAY_ENUM_TO_INDEX: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
};

const DAY_LABELS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const getDayName = (dayOfWeek: any): string => {
    if (typeof dayOfWeek === "number") {
        return DAY_LABELS[dayOfWeek] ?? "Unknown";
    }
    if (typeof dayOfWeek === "string") {
        const upper = dayOfWeek.toUpperCase();
        const idx = DAY_ENUM_TO_INDEX[upper];
        return idx !== undefined ? DAY_LABELS[idx] : upper;
    }
    return "Unknown";
};

// Loading Skeleton component
const AvailabilitySkeleton = () => (
    <div className={"space-y-8"}>
        {[1, 2, 3].map((i) => (
            <div key={i} className={"rounded.xl p-6 shadow-lg secondbg animate-pulse"}>
                <div className={"h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"}>
                    <div className={"space-y-4"}>
                        <div className={"h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"}></div>
                        <div className={"h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"}></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default function AvailabilityPage() {
    const [isAvailable, setIsAvailable] = useState(true);
    const [sessionDuration, setSessionDuration] = useState("30");
    const [bufferTime, setBufferTime] = useState("5");
    const [blackoutDates, setBlackoutDates] = useState<string[]>([]);
    const [newDateInput, setNewDateInput] = useState("");
    const [showDateInput, setShowDateInput] = useState(false);
    const [saving, setSaving] = useState(false);

    const [oneTimeAvailabilities, setOneTimeAvailabilities] = useState<{
        date: string;           // "YYYY-MM-DD"
        timeSlots: TimeSlot[];  // slots for that date
        hourlyRate: number;
    }[]>([]);

    const {
        availability,
        loading,
        error,
        refetch,
        createAvailability,
        updateAvailability,
        deleteAvailability,
    } = useAvailability();

    const [schedule, setSchedule] = useState<DaySchedule[]>([
        ...createDaySchedules([
            { day: "Monday", dayOfWeek: 1 },
            { day: "Tuesday", dayOfWeek: 2 },
            { day: "Wednesday", dayOfWeek: 3 },
            { day: "Thursday", dayOfWeek: 4 },
            { day: "Friday", dayOfWeek: 5 },
        ]),
        ...createDaySchedules([
            { day: "Saturday", dayOfWeek: 6 },
            { day: "Sunday", dayOfWeek: 0 }, // Sunday is 0
        ]),
    ]);

    function createDaySchedules(days: { day: string; dayOfWeek: number }[]): DaySchedule[] {
        return days.map(({ day, dayOfWeek }) => ({
            day,
            dayOfWeek,
            timeSlots: [],
            excludedSessions: [],
            hourlyRate: 50,
        }));
    }

    // Helper to round up numbers
    const roundRate = (value: number | string): number => {
        return Math.round(Number(value) || 0);
    };

    // ---- LOAD EXISTING AVAILABILITY ----
    useEffect(() => {
        if (!availability || availability.length === 0) return;

        console.log("📥 ===== LOADING AVAILABILITY DATA =====");
        console.log("📥 Total availability entries:", availability.length);

        // ===== LOAD RECURRING SCHEDULES =====
        const updatedSchedule = schedule.map((daySchedule) => {
            const existingAvailability = availability.find((avail: any) => {
                if (avail.type !== "recurring") return false;

                const dayField = avail.dayOfWeek;
                let idx: number | undefined;

                if (typeof dayField === "number") {
                    idx = dayField;
                } else if (typeof dayField === "string") {
                    idx = DAY_ENUM_TO_INDEX[dayField.toUpperCase()] ?? undefined;
                }

                return idx === daySchedule.dayOfWeek;
            });

            if (existingAvailability) {
                console.log(
                    `✅ Found recurring availability for ${daySchedule.day}:`,
                    existingAvailability
                );
                const slots = (existingAvailability as any).timeSlots || [];

                return {
                    ...daySchedule,
                    timeSlots: slots.map((slot: any) => ({
                        id: slot.id || crypto.randomUUID(),
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        rate: roundRate(slot.rate ?? daySchedule.hourlyRate ?? 0),
                    })),
                    hourlyRate: roundRate(existingAvailability.hourlyRate),
                };
            }

            return daySchedule;
        });

        setSchedule(updatedSchedule);
        console.log("✅ Recurring schedules loaded");

        // ===== LOAD ONE-TIME AVAILABILITIES =====
        const oneTime = availability
            .filter((avail: any) => {
                if (avail.type !== "specific_date") return false;

                const slots =
                    (avail.specificTimeSlots && avail.specificTimeSlots.length > 0
                        ? avail.specificTimeSlots
                        : avail.specificTimeDate) || [];

                const hasSlots = Array.isArray(slots) && slots.length > 0;

                console.log("🔍 Checking specific_date for one-time:", {
                    _id: avail._id,
                    type: avail.type,
                    specificDate: avail.specificDate,
                    specificTimeSlots: avail.specificTimeSlots,
                    specificTimeDate: avail.specificTimeDate,
                    hasSlots,
                    slotsCount: slots.length,
                });

                return hasSlots;
            })
            .map((a: any) => {
                const rawDate = a.specificDate;
                const formattedDate = rawDate
                    ? new Date(rawDate).toISOString().substring(0, 10)
                    : "";

                const slots =
                    (a.specificTimeSlots && a.specificTimeSlots.length > 0
                        ? a.specificTimeSlots
                        : a.specificTimeDate) || [];

                const oneTimeEntry = {
                    date: formattedDate,
                    hourlyRate: a.hourlyRate ?? 0,
                    timeSlots: slots.map((slot: any) => ({
                        id: crypto.randomUUID(),
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        rate: roundRate(slot.rate ?? a.hourlyRate ?? 0),
                    })),
                };

                console.log("✅ Loaded one-time availability:", oneTimeEntry);
                return oneTimeEntry;
            });

        console.log(`✅ One-time availabilities loaded: ${oneTime.length}`);
        setOneTimeAvailabilities(oneTime);

        // ===== LOAD BLACKOUT DATES =====
        const blackouts = availability
            .filter((avail: any) => {
                if (avail.type !== "specific_date") return false;

                const slots =
                    (avail.specificTimeSlots && avail.specificTimeSlots.length > 0
                        ? avail.specificTimeSlots
                        : avail.specificTimeDate) || [];

                const hasNoTimeSlots = !Array.isArray(slots) || slots.length === 0;

                console.log(`🔍 Checking for blackout ${avail._id}:`, {
                    type: avail.type,
                    specificDate: avail.specificDate,
                    specificTimeSlots: avail.specificTimeSlots,
                    specificTimeDate: avail.specificTimeDate,
                    hasNoTimeSlots,
                    slotsCount: slots.length,
                });

                return hasNoTimeSlots;
            })
            .map((a: any) => {
                const rawDate = a.specificDate;
                const formattedDate = rawDate
                    ? new Date(rawDate).toISOString().substring(0, 10)
                    : "";
                console.log("✅ Loaded blackout date:", formattedDate);
                return formattedDate;
            })
            .filter((d: string) => d !== "");

        console.log(`✅ Blackout dates loaded: ${blackouts.length}`);
        setBlackoutDates(blackouts);

        // Global availability toggle
        setIsAvailable(availability.some((avail: any) => avail.isActive));

        console.log("🏁 ===== AVAILABILITY LOADING COMPLETE =====");
        console.log("📊 Summary:", {
            recurringDays: updatedSchedule.filter((d) => d.timeSlots.length > 0).length,
            oneTimeCount: oneTime.length,
            blackoutCount: blackouts.length,
        });
    }, [availability]); // eslint-disable-line react-hooks/exhaustive-deps

    const parseTime = (time: string) => {
        if (!time) return 0;
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
    };

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
                end: formatTime(sessionEnd),
            });
            if (currentStart + duration + buffer > slotEnd) break;
            currentStart = currentStart + duration + buffer;
        }

        return sessions;
    };

    const handleAddTimeSlot = (day: string) => {
        setSchedule((prev) =>
            prev.map((d) => {
                if (d.day !== day) return d;
                const newSlot = {
                    id: crypto.randomUUID(),
                    startTime: "09:00",
                    endTime: "17:00",
                    rate: d.hourlyRate || 0,
                };
                return {
                    ...d,
                    timeSlots: [...d.timeSlots, newSlot],
                };
            })
        );
    };

    const handleTimeChange = (
        day: string,
        slotId: string,
        type: string,
        value: string | number
    ) => {
        setSchedule((prev) =>
            prev.map((d) => {
                if (d.day !== day) return d;
                return {
                    ...d,
                    timeSlots: d.timeSlots.map((slot) =>
                        slot.id === slotId ? { ...slot, [type]: value } : slot
                    ),
                };
            })
        );
    };

    const handleRemoveSlot = (day: string, slotId: string) => {
        setSchedule((prev) =>
            prev.map((d) => {
                if (d.day !== day) return d;
                return {
                    ...d,
                    timeSlots: d.timeSlots.filter((slot) => slot.id !== slotId),
                };
            })
        );
    };

    const handleHourlyRateChange = (day: string, rate: number) => {
        setSchedule((prev) =>
            prev.map((d) => (d.day !== day ? d : { ...d, hourlyRate: roundRate(rate) }))
        );
    };

    const handleRemoveSession = (day: string, sessionId: string) => {
        setSchedule((prev) =>
            prev.map((d) => {
                if (d.day !== day) return d;
                return { ...d, excludedSessions: [...d.excludedSessions, sessionId] };
            })
        );
    };

    const handleAddBlackoutDate = () => {
        if (newDateInput) {
            setBlackoutDates((prev) => [...prev, newDateInput]);
            setNewDateInput("");
            setShowDateInput(false);
        }
    };

    const saveAvailability = async () => {
        try {
            setSaving(true);
            console.log("🔄 ===== STARTING SAVE AVAILABILITY =====");

            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log("⏰ Timezone:", timeZone);

            // -------------------------------------------------
            // Helper builders (pure functions)
            // -------------------------------------------------

            const buildRecurringPayloads = () => {
                return schedule
                    .filter((day) => day.timeSlots.length > 0)
                    .map((day) => ({
                        type: "recurring" as const,
                        dayOfWeek: day.dayOfWeek,
                        timeSlots: day.timeSlots.map((slot) => ({
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                            rate:
                                roundRate(slot.rate) ||
                                roundRate(day.hourlyRate) ||
                                0,
                        })),
                        timeZone,
                        hourlyRate: roundRate(day.hourlyRate) || 0,
                    }));
            };

            const buildOneTimePayloads = () => {
                const filtered = oneTimeAvailabilities.filter((entry, index) => {
                    const hasDate = entry.date && entry.date.trim() !== "";
                    const hasTimeSlots =
                        entry.timeSlots && entry.timeSlots.length > 0;
                    const hasValidRate =
                        typeof entry.hourlyRate === "number" &&
                        entry.hourlyRate > 0;

                    console.log(`🔍 Entry ${index}:`, {
                        date: entry.date,
                        hasDate,
                        timeSlots: entry.timeSlots,
                        hasTimeSlots,
                        slotsCount: entry.timeSlots?.length || 0,
                        hourlyRate: entry.hourlyRate,
                        hasValidRate,
                        willInclude: hasDate && hasTimeSlots && hasValidRate,
                    });

                    return hasDate && hasTimeSlots && hasValidRate;
                });

                console.log("✅ Filtered one-time entries:", filtered.length);

                return filtered.map((entry) => {
                    // entry.date is already "YYYY-MM-DD"
                    const formattedDate = entry.date;

                    return {
                        type: "specific_date" as const,
                        specificDate: formattedDate,
                        specificTimeSlots: entry.timeSlots.map((slot) => ({
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                            rate: roundRate(slot.rate || entry.hourlyRate || 0),
                        })),
                        timeZone,
                        hourlyRate: roundRate(entry.hourlyRate) || 0,
                    };
                });
            };

            const buildBlackoutPayloads = (oneTimePayloads: any[]) => {
                const oneTimeDates = new Set(
                    oneTimePayloads.map((p) => p.specificDate)
                );

                return blackoutDates
                    .filter((date) => date && date.trim() !== "")
                    .map((date) => {
                        // blackoutDates already store "YYYY-MM-DD"
                        return date;
                    })
                    .filter((formattedDate) => {
                        const isOverlapping = oneTimeDates.has(formattedDate);
                        if (isOverlapping) {
                            console.log(
                                `Skipping blackout for ${formattedDate} because it overlaps with one-time availability`
                            );
                        }
                        return !isOverlapping;
                    })
                    .map((formattedDate) => ({
                        type: "specific_date" as const,
                        specificDate: formattedDate,
                        specificTimeSlots: [],
                        timeZone,
                        hourlyRate: 0,
                    }));
            };

            // -------------------------------------------------
            // BUILD ALL PAYLOADS
            // -------------------------------------------------

            const recurringPayloads = buildRecurringPayloads();
            const oneTimePayloads = buildOneTimePayloads();
            const blackoutPayloads = buildBlackoutPayloads(oneTimePayloads);

            console.log("\n📊 ===== PAYLOAD SUMMARY =====");
            console.log("🔄 Recurring:", recurringPayloads.length);
            console.log("📅 One-time:", oneTimePayloads.length);
            console.log("🚫 Blackouts:", blackoutPayloads.length);

            // Track results
            let recurringCount = 0;
            let oneTimeCount = 0;
            let blackoutCount = 0;
            const errors: string[] = [];

            // -------------------------------------------------
            // SAVE RECURRING AVAILABILITY (SEQUENTIALLY)
            // -------------------------------------------------

            console.log("\n🔄 ===== SAVING RECURRING =====");
            for (const payload of recurringPayloads) {
                try {
                    const existing = availability?.find((a: any) => {
                        if (a.type !== "recurring") return false;

                        const dayField = a.dayOfWeek;
                        let idx: number | undefined;

                        if (typeof dayField === "number") {
                            idx = dayField;
                        } else if (typeof dayField === "string") {
                            idx = DAY_ENUM_TO_INDEX[dayField.toUpperCase()] ?? undefined;
                        }

                        return idx === payload.dayOfWeek;
                    });

                    console.log(
                        `Processing day ${payload.dayOfWeek}:`,
                        existing ? "UPDATE" : "CREATE"
                    );

                    let result;
                    if (existing) {
                        console.log(
                            `✏️ Updating recurring for day ${payload.dayOfWeek}`
                        );
                        result = await updateAvailability(payload);
                    } else {
                        console.log(
                            `➕ Creating recurring for day ${payload.dayOfWeek}`
                        );
                        result = await createAvailability(payload);
                    }

                    console.log('Recurring API result:', result)
                    if (result && !result.error) {
                        recurringCount++;
                        console.log(
                            `✅ Recurring saved successfully (count: ${recurringCount})`
                        );
                    } else {
                        const errorMsg = result?.error || (typeof result?.message === 'string' ? result.message : "") ||
                            "Failed to save";
                        console.error(`❌ Recurring save failed:`, errorMsg);
                        errors.push(
                            `Recurring (Day ${payload.dayOfWeek}): ${errorMsg}`
                        );
                    }
                } catch (err: any) {
                    console.error(`❌ Error saving recurring:`, err);
                    errors.push(
                        `Recurring (Day ${payload.dayOfWeek}): ${
                            err.message || "Unknown error"
                        }`
                    );
                }
            }

            // -------------------------------------------------
            // SAVE ONE-TIME AVAILABILITY (SEQUENTIALLY)
            // -------------------------------------------------

            console.log(
                `\n📅 ===== SAVING ONE-TIME (${oneTimePayloads.length} entries) =====`
            );

            for (let i = 0; i < oneTimePayloads.length; i++) {
                const payload = oneTimePayloads[i];
                try {
                    console.log(
                        `\n➕ [${i + 1}/${oneTimePayloads.length}] Creating one-time availability`
                    );
                    console.log(`📅 Date: ${payload.specificDate}`);
                    console.log(`🕐 Slots: ${payload.specificTimeSlots.length}`);
                    console.log(`💰 Rate: $${payload.hourlyRate}`);

                    const result = await createAvailability(payload);

                    console.log("One-time API result:", result)
                    if (result && !result.error) {
                        console.log(`✅ SUCCESS! One-time availability saved`);
                        oneTimeCount++;
                    } else {
                        const errorMsg = result?.error || (typeof result?.message === 'string' ?
                            result.message : ""
                        ) || "Failed to save";
                        console.error(`❌ One-time save failed:`, errorMsg);
                        errors.push(
                            `One-time (${payload.specificDate}): ${errorMsg}`
                        );
                    }
                } catch (err: any) {
                    console.error(
                        `❌ FAILED! Error saving one-time availability:`,
                        {
                            error: err,
                            message: err.message,
                            payload: payload,
                        }
                    );
                    errors.push(
                        `One-time (${payload.specificDate}): ${
                            err.message || "Unknown error"
                        }`
                    );
                }
            }

            // -------------------------------------------------
            // SAVE BLACKOUT DATES (SEQUENTIALLY)
            // -------------------------------------------------

            console.log(
                `\n🚫 ===== SAVING BLACKOUTS (${blackoutPayloads.length} dates) =====`
            );
            for (const payload of blackoutPayloads) {
                try {
                    console.log(
                        `➕ Creating blackout date for ${payload.specificDate}`
                    );
                    const result = await createAvailability(payload);

                    console.log("Blackout API result:", result)
                    if (result && !result.error) {
                        blackoutCount++;
                        console.log(
                            `✅ Blackout saved (count: ${blackoutCount})`
                        );
                    } else {
                        const errorMsg = result?.error || (typeof result?.message === 'string' ? result.message : "") ||
                        "Failed to save";
                        console.error(`❌ Blackout save failed:`, errorMsg);
                        errors.push(
                            `Blackout (${payload.specificDate}): ${errorMsg}`
                        );
                    }
                } catch (err: any) {
                    console.error(`❌ Error saving blackout:`, err);
                    errors.push(
                        `Blackout (${payload.specificDate}): ${
                            err.message || "Unknown error"
                        }`
                    );
                }
            }

            // -------------------------------------------------
            // FINALIZE
            // -------------------------------------------------

            console.log("\n🔄 Refetching availability...");
            await refetch();
            console.log("✅ Refetch complete");

            console.log("\n📊 ===== FINAL RESULTS =====");
            console.log("✅ Recurring saved:", recurringCount);
            console.log("✅ One-time saved:", oneTimeCount);
            console.log("✅ Blackouts saved:", blackoutCount);
            console.log("❌ Errors:", errors.length);

            const totalSaved =
                recurringCount + oneTimeCount + blackoutCount;
            const totalExpected =
                recurringPayloads.length +
                oneTimePayloads.length +
                blackoutPayloads.length;

            if (errors.length === 0 && totalSaved > 0) {
                const parts: string[] = [];
                if (recurringCount > 0) parts.push(`${recurringCount} recurring`);
                if (oneTimeCount > 0) parts.push(`${oneTimeCount} one-time`);
                if (blackoutCount > 0) parts.push(`${blackoutCount} blackout`);

                const message = `✅ Successfully saved: ${parts.join(
                    ", "
                )} availability!`;
                console.log("🎉 SHOWING SUCCESS TOAST:", message);
                toast.success(message);
            } else if (errors.length === 0 && totalSaved === 0) {
                console.log("ℹ️ No changes to save");
                toast.info("No changes to save");
            } else if (totalSaved > 0 && errors.length > 0) {
                const message = `⚠️ Saved ${totalSaved}/${totalExpected} items. ${errors.length} failed.`;
                console.log("⚠️ SHOWING WARNING TOAST:", message);
                console.error("Failed items:", errors);
                toast.warning(message);
            } else {
                const message = `❌ Failed to save availability. Please check console.`;
                console.log("❌ SHOWING ERROR TOAST:", message);
                console.error("All errors:", errors);
                toast.error(message);
            }

            console.log("🏁 ===== SAVE COMPLETE =====\n");
        } catch (error: any) {
            console.error("💥 ===== FATAL ERROR =====");
            console.error("❌ Error:", error);
            console.error("❌ Message:", error.message);
            console.error("❌ Stack:", error.stack);
            toast.error(`Failed to save: ${error.message || "Unknown error"}`);
        } finally {
            setSaving(false);
            console.log("🔓 Save state unlocked (saving = false)");
        }
    };

    const handleDeleteDay = async (dayOfWeek: number) => {
        try {
            const dayEnum = DAY_INDEX_TO_ENUM[dayOfWeek];

            const existingAvailability = availability?.find((avail: any) => {
                if (avail.type !== "recurring") return false;
                const dayField = avail.dayOfWeek;
                if (typeof dayField === "string") {
                    return dayField.toUpperCase() === dayEnum;
                }
                if (typeof dayField === "number") {
                    return dayField === dayOfWeek;
                }
                return false;
            });

            if (existingAvailability) {
                await deleteAvailability(existingAvailability._id);

                setSchedule((prev) =>
                    prev.map((d) =>
                        d.dayOfWeek === dayOfWeek
                            ? { ...d, timeSlots: [], hourlyRate: 50 }
                            : d
                    )
                );

                await refetch();
                toast.success("Day availability deleted successfully");
            }
        } catch (error: any) {
            console.error("Error deleting availability:", error);
            toast.error(error.message || "Failed to delete availability");
        }
    };

    if (error) {
        return (
            <MainLayout>
                <div className={"p-4"}>
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 text-center">
                        <AlertCircle className={"h-12 w-12 text-red-500 mx-auto mb-4"} />
                        <h2 className={"text-xl font-semibold text-red-800 dark:text-red-300 mb-2"}>
                            Error Loading Availability
                        </h2>
                        <p className={"text-red-600 dark:text-red-400 mb-4"}>{error}</p>
                        <Button
                            onClick={refetch}
                            className={"bg-red-600 text-white hover:bg-red-700"}
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (loading && !availability) {
        return (
            <MainLayout>
                <div className={"p-4"}>
                    <AvailabilitySkeleton />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="p-4 space-y-8 dark:text-white">
                {/* Header with Save button */}
                <div className={"flex justify-between items-center"}>
                    <h1 className={"text-2xl font-bold text-black dark:text-white"}>
                        Availability Management
                    </h1>
                    <div className={"flex gap-2"}>
                        <Button
                            onClick={refetch}
                            variant={"outline"}
                            disabled={loading || saving}
                            className={
                                "dark:text-white text-white bg-green-500 hover:bg-green-700 hover:text-white dashbutton"
                            }
                        >
                            {loading && (
                                <Loader2
                                    className={"mr-2 h-4 w-4 animate-spin dark:text-white"}
                                />
                            )}
                            Refresh
                        </Button>
                        <Button
                            onClick={saveAvailability}
                            disabled={saving}
                            className={"dashbutton bg-green-600 text-white hover:bg-green-700"}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className={"mr-2 h-4 w-4 animate-spin"} />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Availability Toggle */}
                <div className="rounded-xl p-6 shadow-lg secondbg dark:!text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground dark:text-white">
                                Availability Status
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1 dark:text-white">
                                {isAvailable
                                    ? "Available for bookings"
                                    : "Currently unavailable"}
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
                    className={`rounded-xl p-6 shadow-lg secondbg dark:!text-white ${
                        !isAvailable ? "opacity-50 pointer-events-none" : ""
                    }`}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className={"h-5 w-5"} />
                        <h2 className="text-xl font-semibold text-foreground dark:text-white">
                            Session Settings
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground dark:text-white">
                                Session Duration
                            </label>
                            <Select
                                value={sessionDuration}
                                onValueChange={setSessionDuration}
                            >
                                <SelectTrigger className="h-12 text-black">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[15, 30, 45, 60].map((mins) => (
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
                                    {[0, 5, 10, 15].map((mins) => (
                                        <SelectItem key={mins} value={String(mins)}>
                                            {mins} minutes
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* One-Time availability slot */}
                <div className="rounded-xl p-6 shadow-lg secondbg dark:!text-white">
                    <div className={"flex items-center justify-between mb-4"}>
                        <div className={"flex items-center gap-2"}>
                            <Calendar className={"h-5 w-5"} />
                            <h2 className={"text-xl font-semibold text-foreground dark:text-white"}>
                                One-Time (Specific Date) Availability
                            </h2>
                        </div>
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            className={"dashbutton text-white"}
                            onClick={() =>
                                setOneTimeAvailabilities((prev) => [
                                    ...prev,
                                    {
                                        date: "",
                                        hourlyRate: 50,
                                        timeSlots: [
                                            {
                                                id: crypto.randomUUID(),
                                                startTime: "09:00",
                                                endTime: "17:00",
                                                rate: 50,
                                            },
                                        ],
                                    },
                                ])
                            }
                        >
                            + Add One-Time Date
                        </Button>
                    </div>

                    <div className={"space-y-4"}>
                        {oneTimeAvailabilities.length === 0 ? (
                            <p className="text-sm text-center text-muted-foreground dark:text-white p-4">
                                No one-time availabilities added
                            </p>
                        ) : (
                            oneTimeAvailabilities.map((entry, i) => (
                                <div key={i} className={"p-4 border rounded-lg"}>
                                    {/* Date + Rate */}
                                    <div className={"flex items-center justify-between gap-3 mb-3"}>
                                        <div className="flex items-center gap-3 flex-1">
                                            <Input
                                                type="date"
                                                className={"w-48 secondbg"}
                                                value={entry.date}
                                                min={new Date().toISOString().split("T")[0]}
                                                onChange={(e) => {
                                                    const newDate = e.target.value;
                                                    setOneTimeAvailabilities((prev) =>
                                                        prev.map((a, idx) =>
                                                            idx === i ? { ...a, date: newDate } : a
                                                        )
                                                    );
                                                }}
                                            />

                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-foreground dark:text-white">
                                                    Rate: $
                                                </span>
                                                <Input
                                                    type={"number"}
                                                    placeholder={"Hourly rate"}
                                                    className={"w-24 secondbg"}
                                                    min={0}
                                                    step={5}
                                                    value={entry.hourlyRate ?? 0}
                                                    onChange={(e) => {
                                                        const rate =
                                                            roundRate(e.target.value) || 0;
                                                        setOneTimeAvailabilities((prev) =>
                                                            prev.map((a, idx) =>
                                                                idx === i
                                                                    ? { ...a, hourlyRate: rate }
                                                                    : a
                                                            )
                                                        );
                                                    }}
                                                />
                                                <span className="text-sm text-muted-foreground dark:text-white">
                                                    /hr
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            variant={"ghost"}
                                            size={"icon"}
                                            onClick={() =>
                                                setOneTimeAvailabilities((prev) =>
                                                    prev.filter((_, idx) => idx !== i)
                                                )
                                            }
                                        >
                                            <X className={"w-6 h-6 text-red-700"} />
                                        </Button>
                                    </div>

                                    {/* Time Slots */}
                                    <div className="space-y-2">
                                        {entry.timeSlots.map((slot, j) => (
                                            <div
                                                key={slot.id}
                                                className={"flex items-center gap-2"}
                                            >
                                                <Input
                                                    type={"time"}
                                                    value={slot.startTime}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setOneTimeAvailabilities((prev) =>
                                                            prev.map((a, idx) =>
                                                                idx === i
                                                                    ? {
                                                                        ...a,
                                                                        timeSlots: a.timeSlots.map(
                                                                            (t, sidx) =>
                                                                                sidx === j
                                                                                    ? {
                                                                                        ...t,
                                                                                        startTime:
                                                                                        value,
                                                                                    }
                                                                                    : t
                                                                        ),
                                                                    }
                                                                    : a
                                                            )
                                                        );
                                                    }}
                                                    className={"w-[110px] secondbg"}
                                                />

                                                <span>to</span>

                                                <Input
                                                    type={"time"}
                                                    value={slot.endTime}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setOneTimeAvailabilities((prev) =>
                                                            prev.map((a, idx) =>
                                                                idx === i
                                                                    ? {
                                                                        ...a,
                                                                        timeSlots: a.timeSlots.map(
                                                                            (t, sidx) =>
                                                                                sidx === j
                                                                                    ? {
                                                                                        ...t,
                                                                                        endTime:
                                                                                        value,
                                                                                    }
                                                                                    : t
                                                                        ),
                                                                    }
                                                                    : a
                                                            )
                                                        );
                                                    }}
                                                    className={"w-[110px] secondbg"}
                                                />

                                                <Button
                                                    variant={"ghost"}
                                                    size={"icon"}
                                                    onClick={() =>
                                                        setOneTimeAvailabilities((prev) =>
                                                            prev.map((a, idx) =>
                                                                idx === i
                                                                    ? {
                                                                        ...a,
                                                                        timeSlots:
                                                                            a.timeSlots.filter(
                                                                                (_, sidx) =>
                                                                                    sidx !== j
                                                                            ),
                                                                    }
                                                                    : a
                                                            )
                                                        )
                                                    }
                                                >
                                                    <X className={"w-5 h-5 text-red-700"} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        className={"dashbutton text-white mt-2"}
                                        onClick={() =>
                                            setOneTimeAvailabilities((prev) =>
                                                prev.map((a, idx) =>
                                                    idx === i
                                                        ? {
                                                            ...a,
                                                            timeSlots: [
                                                                ...a.timeSlots,
                                                                {
                                                                    id: crypto.randomUUID(),
                                                                    startTime: "09:00",
                                                                    endTime: "10:00",
                                                                    rate:
                                                                        a.hourlyRate || 50,
                                                                },
                                                            ],
                                                        }
                                                        : a
                                                )
                                            )
                                        }
                                    >
                                        + Add Time Slot
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Weekly Schedule */}
                <div
                    className={`rounded-xl p-6 shadow-lg secondbg dark:!text-white space-y-4 ${
                        !isAvailable ? "opacity-50 pointer-events-none" : ""
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className={"flex items-center gap-2"}>
                            <Calendar className={"h-5 w-5"} />
                            <h2 className="text-xl font-semibold text-foreground dark:text-white">
                                Weekly Schedule
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {schedule.map((daySchedule) => (
                            <div key={daySchedule.day} className="p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-medium text-foreground dark:text-white">
                                        {daySchedule.day}
                                    </h3>
                                    <div className={"flex items-center gap-2"}>
                                        <span className={"text-sm text-foreground dark:text-white"}>
                                            Hourly Rate: $
                                        </span>
                                        <input
                                            type="number"
                                            min={"0"}
                                            step={"5"}
                                            value={daySchedule.hourlyRate}
                                            onChange={(e) =>
                                                handleHourlyRateChange(
                                                    daySchedule.day,
                                                    parseInt(e.target.value) || 0
                                                )
                                            }
                                            className={
                                                "w-20 h-8 text-center dark:text-black rounded"
                                            }
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
                                            variant={"destructive"}
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteDay(daySchedule.dayOfWeek)
                                            }
                                        >
                                            Clear Day
                                        </Button>
                                    )}
                                </div>

                                {daySchedule.timeSlots.map((timeSlot) => (
                                    <TimeSlotSelector
                                        key={timeSlot.id}
                                        day={daySchedule.day}
                                        slot={timeSlot}
                                        sessions={generateSessions(timeSlot).filter(
                                            (s) =>
                                                !daySchedule.excludedSessions.includes(s.id)
                                        )}
                                        onTimeChange={(type, value) =>
                                            handleTimeChange(
                                                daySchedule.day,
                                                timeSlot.id,
                                                type,
                                                value
                                            )
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
                    className={`rounded-xl p-6 shadow-lg secondbg dark:!text-white ${
                        !isAvailable ? "opacity-50 pointer-events-none" : ""
                    }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={"flex items-center gap-2"}>
                            <X className={"h-5 w-5"} />
                            <h2 className="text-xl font-semibold text-foreground dark:text-white">
                                Blackout Dates
                            </h2>
                        </div>

                        <div className="flex gap-2">
                            {showDateInput && (
                                <Input
                                    type="date"
                                    className="w-40 secondbg"
                                    value={newDateInput}
                                    onChange={(e) => setNewDateInput(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="dashbutton text-white"
                                onClick={
                                    showDateInput
                                        ? handleAddBlackoutDate
                                        : () => setShowDateInput(true)
                                }
                                disabled={showDateInput && !newDateInput}
                            >
                                {showDateInput ? "Confirm" : "+ Add Date"}
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg p-1 space-y-2 ">
                        {blackoutDates.length > 0 ? (
                            blackoutDates.map((date) => (
                                <div
                                    key={date}
                                    className="flex items-center border-gray-700 border justify-between p-2 rounded"
                                >
                                    <span className="text-sm text-foreground dark:text-white">
                                        {new Date(date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className=" text-white"
                                        onClick={() =>
                                            setBlackoutDates((prev) =>
                                                prev.filter((d) => d !== date)
                                            )
                                        }
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

                {/* Current Availability Summary */}
                {availability && availability.length > 0 && (
                    <div className={"rounded-xl p-6 shadow-lg secondbg dark:!text-white"}>
                        <h2 className={"text-xl font-semibold text-foreground dark:text-white mb-4"}>
                            Current Availability Summary
                        </h2>
                        <div className={"grid gap-4 md:grid-cols-2 lg:grid-cols-3"}>
                            {availability
                                .filter((avail: any) => avail.type === "recurring")
                                .map((avail: any) => (
                                    <div key={avail._id} className={"p-3 border rounded-lg"}>
                                        <h3 className={"font-medium text-foreground dark:text-white"}>
                                            {getDayName(avail.dayOfWeek)}
                                        </h3>
                                        <p className={"text-sm text-muted-foreground dark:text-white"}>
                                            Rate: ${avail.hourlyRate}/hour
                                        </p>
                                        <p className={"text-sm text-muted-foreground dark:text-white"}>
                                            {(avail.timeSlots || []).length} time slot(s)
                                        </p>
                                        <p className={"text-sm text-muted-foreground dark:text-white"}>
                                            Status: {avail.isActive ? "Active" : "Inactive"}
                                        </p>
                                    </div>
                                ))}
                        </div>

                        {/* Specific dates summary */}
                        {availability.some((a: any) => a.type === "specific_date") && (
                            <div className="mt-4">
                                <h3 className={"font-medium text-foreground dark:text-white mb-2"}>
                                    Specific Dates & Blackouts
                                </h3>
                                <div className={"grid gap-2"}>
                                    {availability
                                        .filter((avail: any) => avail.type === "specific_date")
                                        .map((avail: any) => {
                                            const slots =
                                                (avail.specificTimeSlots &&
                                                avail.specificTimeSlots.length > 0
                                                    ? avail.specificTimeSlots
                                                    : avail.specificTimeDate) || [];

                                            const isBlackout =
                                                !Array.isArray(slots) || slots.length === 0;

                                            return (
                                                <div
                                                    key={avail._id}
                                                    className={"p-2 border rounded text-sm"}
                                                >
                                                    <span className={"text-foreground dark:text-white"}>
                                                        {avail.specificDate
                                                            ? new Date(
                                                                avail.specificDate
                                                            ).toLocaleDateString()
                                                            : "N/A"}
                                                    </span>
                                                    {" - "}
                                                    <span className={"text-muted-foreground dark:text-white"}>
                                                        {isBlackout
                                                            ? "Blackout"
                                                            : `${slots.length} slot(s)`}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

interface TimeSlotSelectorProps {
    day: string;
    slot: TimeSlot;
    sessions: Session[];
    onTimeChange: (type: string, value: string | number) => void;
    onRemoveSlot: () => void;
    onRemoveSession: (day: string, sessionId: string) => void;
}

function TimeSlotSelector({
                              day,
                              slot,
                              sessions,
                              onTimeChange,
                              onRemoveSlot,
                          }: TimeSlotSelectorProps) {
    return (
        <div className="space-y-4 p-4 rounded-lg border border-gray-700 dark:border-gray-300 secondbg mb-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                    <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => onTimeChange("startTime", e.target.value)}
                        className="w-[120px] secondbg border border-gray-700 focus:border-transparent focus:ring-0"
                    />
                    <span className="text-muted-foreground dark:text-white">to</span>
                    <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => onTimeChange("endTime", e.target.value)}
                        className="w-[120px] secondbg border border-gray-700 focus:border-transparent focus:ring-0"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground dark:text-white">
                            $
                        </span>
                        <Input
                            type="number"
                            value={slot.rate}
                            min={0}
                            step={1}
                            placeholder="Rate"
                            onChange={(e) =>
                                onTimeChange(
                                    "rate",
                                    Math.round(Number(e.target.value)) || 0
                                )
                            }
                            className="w-[80px] secondbg border border-gray-700 focus:border-transparent focus:ring-0"
                        />
                    </div>
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
                        <span>{sessions.length} Available Session(s)</span>
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
