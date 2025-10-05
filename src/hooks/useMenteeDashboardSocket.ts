import {useEffect, useState} from 'react'
import {getSocket} from '@/lib/socket'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function useMenteeDashboardSocket(menteeId: string) {
    const [events, setEvents] = useState<any[]>([])

    useEffect(() => {
        if (!menteeId) return;
        const socket = getSocket()

        // Join the mentee room
        socket.emit("join_mentee_room", menteeId)

        // list for the dashboard updates
        const handleDashboardUpdate = (data: any) => {
            console.log("Dashboard update received:", data)
            setEvents((prev) => [...prev, data])
        }

        socket.on("dashboard_update", handleDashboardUpdate)

        return () => {
            socket.emit("leave_mentee_room", menteeId)
            socket.off("dashboard_update", handleDashboardUpdate)
        }
    }, [menteeId])

    return {events}
}

export function useSessionSocket(menteeId: string, onUpdate: () => void) {
    useEffect(() => {
        if (!menteeId)  return;
        const socket = getSocket()

        socket.on("session_updated", (data) => {
            console.log("Real-time session update:", data)
            onUpdate()
        })

        return () => {
            socket.off("session_updated")
        }
    }, [menteeId, onUpdate])
}