import { useEffect } from "react";
import { getSocket } from '@/lib/socket';
import { initSocketRoom } from "@/hooks/initSocketRoom";
import { useAuth } from "@/hooks/userService";
import { toast } from "react-toastify";

export function useSocket() {
    const { user } = useAuth();
    const socket = getSocket();

    useEffect(() => {
        if (!user?._id || !user.role) return;

        const normalizedRole = normalizeRole(user.role);

        // connect & join the correct socket room
        if (!socket.connected) socket.connect();

        socket.on("connect", () =>
            console.log(`✅ Socket connected: ${socket.id}`)
        );
        socket.on("disconnect", (reason) =>
            console.log("⚠️ Socket disconnected:", reason)
        );
        socket.on("connect_error", (err) =>
            console.error("❌ Socket connection error:", err)
        );

        initSocketRoom(user._id, normalizedRole);

        socket.on("new_notification", (notification) => {
            console.log(`[${normalizedRole}] notification received:`, notification);

            toast.info(
                `${notification.title || "New Notification"}: ${notification.description}`,
                {
                    position: "bottom-right",
                    autoClose: 4000,
                    theme: "dark",
                }
            );
        });

        socket.on("session_updated", (data) => {
            console.log("Session updated:", data);
        });

        socket.on("session_request:update", (data) => {
            console.log("Session request update:", data);
        });

        return () => {
            socket.off("new_notification");
            socket.off("session_updated");
            socket.off("session_request:update");
            socket.disconnect();
        };
    }, [user]);
}

// Helper to align backend role names
function normalizeRole(role: string): "mentor" | "mentee" | "innovator" | "problemSolver" {
    switch (role.toLowerCase()) {
        case "advisor":
        case "mentor":
            return "mentor";
        case "client":
        case "mentee":
            return "mentee";
        case "innovator":
            return "innovator";
        case "ps":
        case "problemsolver":
            return "problemSolver";
        default:
            return "mentee";
    }
}
