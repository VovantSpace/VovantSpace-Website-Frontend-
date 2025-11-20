import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { toast } from "react-hot-toast";

type SessionEvent = {
    message?: string;
    type?: string;
    data?: any;
}

export function useMenteeDashboardSocket(menteeId: string) {
    const [events, setEvents] = useState<any[]>([])

    useEffect(() => {
        if (!menteeId) return;

        const socket = getSocket();

        const handle = (data: any) => {
            console.log("🔥 EVENT RECEIVED:", data);
            toast.success(data.message || "Update received");
            setEvents(prev => [...prev, data]);
        };

        socket.on("session_update", handle);
        socket.on("session_updated", handle);
        socket.on("notification:new", handle);
        socket.on("session_request:confirmation", handle);

        return () => {
            socket.off("session_update", handle);
            socket.off("session_updated", handle);
            socket.off("notification:new", handle);
            socket.off("session_request:confirmation", handle);
        };
    }, [menteeId]);

    return { events };
}


export function useSessionSocket(menteeId: string, onUpdate: (data: SessionEvent) => void) {
    useEffect(() => {
        if (!menteeId) return;

        const socket = getSocket()
        socket.emit("join_mentee_room", menteeId)

        const handle = (data: SessionEvent) => {
            console.log("mentee received session update:", data)
            onUpdate?.(data)
        }

        socket.on("session_update", handle)

        return () => {
            socket.off("session_update", handle)
        }
    }, [menteeId, onUpdate])
}