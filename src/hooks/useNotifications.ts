// src/hooks/useNotifications.ts
import { useCallback, useEffect, useState } from "react";
import notificationService, { Notification } from "@/hooks/notificationService";
import { getSocket } from "@/lib/socket";

type Role = "innovator" | "problemSolver" | "mentor" | "mentee";

export function useNotifications(role: Role | null) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (!role) return;

        try {
            setLoading(true);
            setError(null);

            const res = await notificationService.getNotifications(role);

            setNotifications(res.notifications);
            setUnreadCount(res.unreadCount);
        } catch (err) {
            console.error(err);
            setError("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    }, [role]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // 🔔 Socket live updates
    useEffect(() => {
        if (!role) return;

        const socket = getSocket();

        const handler = (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((c) => c + 1);
        };

        socket.on("new_notification", handler);

        return () => {
            socket.off("new_notification", handler);
        };
    }, [role]);

    const markAsRead = async (id: string) => {
        await notificationService.markNotificationAsRead(id);

        setNotifications((prev) =>
            prev.map((n) =>
                n._id === id ? { ...n, isRead: true } : n
            )
        );
        setUnreadCount((c) => Math.max(c - 1, 0));
    };

    const markAllAsRead = async () => {
        await notificationService.markAllNotificationsAsRead();

        setNotifications((prev) =>
            prev.map((n) => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
    };

    const deleteNotification = async (id: string) => {
        await notificationService.handleDeleteNotification(id)
        setNotifications((prev) => prev.filter((n) => n._id !== id))
    }

    return {
        notifications,
        unreadCount,
        loading,
        error,
        refetch: fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
}
