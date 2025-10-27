import { useEffect, useState } from "react"
import { getSocket } from "@/lib/socket"
import { toast } from "react-hot-toast"

type SessionEvent = {
    message?: string;
    type?: string;
    data?: any;
}

export function useMenteeDashboardSocket(menteeId: string) {
    const [events, setEvents] = useState<any[]>([])

    useEffect(() => {
        if (!menteeId) return

        const socket = getSocket()

        // ✅ Join mentee room once
        socket.emit("join_mentee_room", menteeId)

        // ✅ Dashboard updates
        const handleDashboardUpdate = (data: any) => {
            toast.success(data.message || "Dashboard updated");
            setEvents((prev) => [...prev, data])
        }

        // ✅ Session updates
        const handleSessionUpdate = (data: any) => {
            toast.success(data.message || "Session updated");
            setEvents((prev) => [...prev, data]);
        }

        // ✅ Register listeners
        socket.on("dashboard_update", handleDashboardUpdate);
        socket.on("session_updated", handleSessionUpdate);

        // ✅ Clean up listeners properly
        return () => {
            socket.emit("leave_mentee_room", menteeId);
            socket.off("dashboard_update", handleDashboardUpdate);
            socket.off("session_updated", handleSessionUpdate);
        }
    }, [menteeId]);

    return { events }
}

export function useSessionSocket(menteeId: string, onUpdate: (data: SessionEvent) => void) {
    useEffect(() => {
        if (!menteeId) return

        const socket = getSocket()
        socket.emit("join_mentee_room", menteeId)

        const handle = (data: SessionEvent) => {
            console.log("mentee received session update:", data)
            onUpdate?.(data)
        }

        socket.on("session_update", handle)

        return () => {
            socket.off("session_updated", handle)
        }
    }, [menteeId, onUpdate])
}