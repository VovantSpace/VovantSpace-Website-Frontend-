import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/dashboard/Innovator/components/ui/dropdown-menu";
import { Button } from "@/dashboard/Innovator/components/ui/button";

import { useNotifications } from "@/hooks/useNotifications";

export interface Notification {
    _id: string;
    title: string;
    description?: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    metaData?: Record<string, any>;
}

interface Props {
    role: "innovator" | "problemSolver" | "mentor" | "mentee";
    onNotificationClick?: (notification: Notification) => void;
}

export function NotificationsDropdown({ role, onNotificationClick }: Props) {
    // ✅ Use the hook as the single source of truth (fetching + sockets + state)
    const {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        refetch,
    } = useNotifications("innovator");

    const handleSelect = async (notification: Notification) => {
        try {
            // ✅ Optimistically mark as read via hook
            if (!notification.isRead) {
                await markAsRead(notification._id);
            }
            onNotificationClick?.(notification);
        } catch (err) {
            console.error("Failed to handle notification select:", err);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
              {unreadCount}
            </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-96 p-2 max-h-[420px] overflow-y-auto">
                <div className="flex items-center justify-between px-2 py-1">
                    <div className="text-sm font-semibold">Notifications</div>

                    {/* Optional: manual refresh */}
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="text-xs text-muted-foreground hover:underline"
                        disabled={loading}
                    >
                        Refresh
                    </button>
                </div>

                {loading && (
                    <div className="p-3 text-sm text-muted-foreground">
                        Loading notifications…
                    </div>
                )}

                {!loading && error && (
                    <div className="p-3 text-sm text-red-500">
                        {error}
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="text-xs underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                {!loading && !error && notifications.length === 0 && (
                    <div className="p-3 text-sm text-muted-foreground">
                        No notifications yet
                    </div>
                )}

                {!loading &&
                    !error &&
                    notifications.map((n) => (
                        <div
                            key={n._id}
                            onClick={() => handleSelect(n)}
                            className={`cursor-pointer rounded-md px-3 py-2 text-sm transition hover:bg-muted ${
                                !n.isRead ? "bg-muted/60 font-medium" : ""
                            }`}
                        >
                            <div className="flex justify-between gap-2">
                                <span>{n.title}</span>
                                {!n.isRead && (
                                    <span className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
                                )}
                            </div>

                            {n.description && (
                                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                    {n.description}
                                </p>
                            )}
                        </div>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
