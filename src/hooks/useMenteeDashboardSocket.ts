import {useEffect, useState} from 'react'
import {io} from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function useMenteeDashboardSocket(menteeId: string) {
    const [events, setEvents] = useState<any[]>([])

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            withCredentials: true,
        })

        // Join the mentee room
        socket.emit("join_mentee_room", menteeId)

        // list for the dashboard updates
        socket.on("dashboard_update", (data) => {
            console.log("Dashboard update received:", data)
            setEvents((prevEvents) => [...prevEvents, data])
        })

        return () => {
            socket.emit("leave_mentee_room", menteeId)
            socket.disconnect()
        }
    }, [menteeId])

    return {events}
}