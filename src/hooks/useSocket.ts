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
        const roomName = `${normalizedRole}_${user._id}`

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

        console.log("🧩 useSocket user:", user);
        console.log("🧩 normalizeRole output:", normalizedRole);


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
            // socket.disconnect();
        };
    }, [user]);
}

// Helper to align backend role names
function normalizeRole(role: string): "mentor" | "mentee" | "innovator" | "problemSolver" {
    const r = role.toLowerCase();

    if (r.includes("mentor") || r.includes("advisor")) return "mentor";
    if (r.includes("mentee") || r.includes("client")) return "mentee";
    if (r.includes("innovator")) return "innovator";
    if (r.includes("solver") || r.includes("ps") || r.includes("problem")) return "problemSolver";

    return "mentee";
}