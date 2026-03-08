import { useCallback, useEffect, useState } from "react";
import notificationService, { Notification } from "@/hooks/notificationService";
import { getSocket } from "@/lib/socket";
import { toast } from "react-hot-toast";
import {useAuth} from "@/context/AuthContext";

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {user} = useAuth();

    const fetchNotifications = useCallback(async () => {

        try {
            setLoading(true);
            setError(null);
            const res = await notificationService.getNotifications();
            console.log("NOTIFICATION RESPONSE", res);
            setNotifications(res.notifications);
            setUnreadCount(res.unreadCount);
        } catch (err) {
            console.error("Failed to load notifications:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // 🔔 REAL-TIME LISTENER
    useEffect(() => {
        const socket = getSocket();

        const handler = (notification: Notification) => {
            if (!user) return;

            console.log("incoming notification:", notification);
            console.log("Current user:", user);

            if (
                notification.userId !== user._id || notification.role !== user.role
            ) {
                console.warn("Blocked cross-role notification:", notification)
                return;
            }
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((c) => c + 1);

            // 🔥 Live Toast
            toast.success(notification.title);
        };

        socket.on("notification:new", handler);

        return () => {
            socket.off("notification:new", handler);
        };
    }, []);

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
        await notificationService.handleDeleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
    };

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