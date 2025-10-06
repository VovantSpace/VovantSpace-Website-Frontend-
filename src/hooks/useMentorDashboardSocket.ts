import {useEffect} from 'react'
import {getSocket} from '@/lib/socket'
import {toast} from 'react-hot-toast'

export function useMentorDashboardSocket(mentorId: string, onRefresh: () => void) {
    useEffect(() => {
        if (!mentorId) return;

        const socket = getSocket()

        socket.emit('join_mentor_room', mentorId);

        // listen for updates
        const handleDashboardUpdate = (data: any) => {
            console.log("mentor dashboard update:", data)
            toast.success(data.message || "Dashboard updated")
            onRefresh()
        }

        const handleSessionUpdate = (data: any) => {
            console.log("Session update for mentor:", data)
            toast.success(data.message || "Session list updated")
            onRefresh()
        }

        socket.on("dashboard_update", handleDashboardUpdate)
        socket.on("session_updated", handleSessionUpdate)

        return () => {
            socket.emit("leave_mentor_room", mentorId);
            socket.off("dashboard_update", handleDashboardUpdate)
            socket.off("session_updated", handleSessionUpdate)
        }
    }, [mentorId, onRefresh]);
}