import {
    Video as VideoIcon,
    Phone as PhoneIcon,
    Calendar as CalendarIcon,
    Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";
import { VideoCallDialog } from "./video-call-dialog";
import { ScheduleReviewDialog } from "../modals/schedule-review-dialog";
import type { Channel, ChatMessage, User, CallData } from "@/dashboard/Innovator/components/chat/types";
import { format } from "date-fns";

interface ChatHeaderProps {
    channel: Channel | null;
    onVideoCall: (data: CallData) => void;
    onAudioCall: (data: CallData) => void;
    onScheduleCall: (data: { date: string; time: string; duration: string }) => void;
}

export function ChatHeader({
                               channel,
                               onVideoCall,
                               onAudioCall,
                               onScheduleCall
                           }: ChatHeaderProps) {
    const [activeDialog, setActiveDialog] = useState<
        "video" | "audio" | "schedule" | null
    >(null);

    const [countdown, setCountdown] = useState<string | null>(null);

    // ------------------------------------------------------
    // Countdown Support For Upcoming Sessions
    // ------------------------------------------------------
    useEffect(() => {
        if (!channel || channel.status !== "upcoming" || !channel.nextActiveDate) {
            setCountdown(null);
            return;
        }

        const nextTime = channel.nextActiveDate;
        if(!nextTime) return;

        const targetTime = new Date(nextTime).getTime();
        if (isNaN(targetTime)) return;

        const interval = setInterval(() => {
            const now = Date.now()
            const diff = targetTime - now;

            if (diff <= 0) {
                setCountdown(null);
                clearInterval(interval);
                return;
            }

            const hrs = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setCountdown(`${hrs}h ${mins}m`);
        }, 60_000); // update every 1 min

        return () => clearInterval(interval);
    }, [channel]);

    if (!channel) {
        return (
            <div className="border-b px-6 py-3 flex items-center justify-between dashtext dashbg">
                <h1 className="text-sm font-semibold">No channel selected</h1>
            </div>
        );
    }

    const handleClose = () => setActiveDialog(null);

    return (
        <div className="border-b px-6 py-3 flex items-center justify-between dashtext dashbg">
            <div>
                <h1 className="text-sm font-semibold">{channel.name}</h1>

                {/* DESCRIPTION */}
                {channel.description && (
                    <p className="text-xs text-muted-foreground flex gap-x-1 items-center dark:text-gray-400">
                        <Briefcase className="h-4 w-4 md:flex hidden" />
                        {channel.description}
                    </p>
                )}

                {/* STATUS BANNERS */}
                {channel.status === "active" && (
                    <p className="text-xs text-green-500 mt-1">Session is active</p>
                )}

                {channel.status === "upcoming" && (
                    <p className="text-xs text-yellow-500 mt-1">
                        Session locked — unlocks at{" "}
                        {channel.nextActiveDate
                            ? format(new Date(channel.nextActiveDate), "PPpp")
                            : "unknown time"}
                        {countdown && ` • in ${countdown}`}
                    </p>
                )}

                {channel.status === "closed" && (
                    <p className="text-xs text-red-500 mt-1">
                        Session closed{channel.closedAt && (
                        <> at {format(new Date(channel.closedAt), "PPpp")}</>
                    )}
                    </p>
                )}
            </div>

            {/* --------- SCHEDULE DIALOG --------- */}
            {activeDialog === "schedule" && (
                <ScheduleReviewDialog
                    isOpen={true}
                    onClose={handleClose}
                    onSchedule={(data) => {
                        onScheduleCall(data);
                        handleClose();
                    }}
                />
            )}

            {/* --------- VIDEO / AUDIO DIALOG --------- */}
            {(activeDialog === "video" || activeDialog === "audio") && (
                <VideoCallDialog
                    isOpen={true}
                    onClose={handleClose}
                    onSchedule={(data) => {
                        if (activeDialog === "video") {
                            onVideoCall({ ...data, type: "video" });
                        } else if (activeDialog === "audio") {
                            onAudioCall({ ...data, type: "audio" });
                        }
                        handleClose();
                    }}
                    mode="ongoing"
                    type={activeDialog === "audio" ? "audio" : "video"}
                />
            )}
        </div>
    );
}