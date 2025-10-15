import {useEffect} from "react";
import {getSocket} from '@/lib/socket'
import {initSocketRoom} from "@/hooks/initSocketRoom";
import {useAuth} from "@/hooks/userService";
import {useNotifications} from "@/hooks/userService";
import {toast} from "react-toastify";

export function useSocket() {
    const {user} = useAuth()
    const {addNotification} = useNotifications()
    const socket = getSocket()

    useEffect(() => {
        if (!user?.id || !user.role) return;

        // Connect socket and join the user's room
        if (!socket.connected) socket.connect()
        initSocketRoom(user.id, normalizeRole(user.role))

        // listen for notifications
        socket.on('new_notification', (notification) => {
            console.log("notification received:", notification);
            addNotification(notification)

            toast.info(`${notification.title}: ${notification.description}`)
        })

        socket.on("session_updated", (data) => {
            console.log("Session updated:", data)
        })

        socket.on("session_request:update", (data) => {
            console.log("Session request update:", data)
        })

        return () => {
            socket.off("new_notification");
            socket.off("session_updated");
            socket.off("session_request:update")
            socket.disconnect()
        }
    }, [user])
}

// Helper to align backend role names
function normalizeRole(role: string): "mentor" | "mentee" | "innovator" | "problemSolver" {
    switch (role.toLowerCase()) {
        case 'advisor':
        case 'mentor':
            return "mentor"
        case "client":
        case "mentee":
            return "mentee";
        case "innovator":
            return "innovator"
        case "ps":
        case "problemsolver":
            return "problemSolver"
        default:
            return "mentee"
    }
}