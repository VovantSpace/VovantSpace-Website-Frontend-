import { Card } from "@/dashboard/Innovator/components/ui/card";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import { MainLayout } from "@/dashboard/Client/components/layout/main-layout";
import { useNotifications } from "@/hooks/useNotifications";

export default function AlertPage() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loading,
    } = useNotifications();

    return (
        <MainLayout>
            <div className="space-y-6 md:p-6 px-3 pt-2">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold dashtext">Alerts</h1>
                        <p className="text-sm text-gray-400">
                            {unreadCount} unread notifications
                        </p>
                    </div>

                    <Button className="dashbutton" onClick={markAllAsRead}>
                        Mark All as Read
                    </Button>
                </div>

                {loading && <p className="text-gray-400">Loading...</p>}

                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <Card
                            key={notification._id}
                            className={`p-4 secondbg border-l-4 ${
                                notification.isRead
                                    ? "border-gray-600"
                                    : "border-[#175047]"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold dashtext">
                                    {notification.title}
                                </h3>

                                <div className="flex gap-2">
                                    {!notification.isRead && (
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                markAsRead(notification._id)
                                            }
                                        >
                                            Read
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            deleteNotification(notification._id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 mt-1">
                                {notification.description}
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                                {new Date(
                                    notification.createdAt
                                ).toLocaleString()}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}