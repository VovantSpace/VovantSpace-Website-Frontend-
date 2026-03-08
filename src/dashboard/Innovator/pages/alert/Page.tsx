import { Card } from "@/dashboard/Innovator/components/ui/card";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import { MainLayout } from "@/dashboard/Innovator/components/layout/main-layout";
import { useNotifications } from "@/hooks/useNotifications";
import type {Notification} from "@/hooks/notificationService";
import {useWallet, WalletLedgerEntry} from "@/hooks/useWallet";

export default function AlertPage() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loading: notificationsLoading,
    } = useNotifications();

    const {
        history,
        historyLoading,
    } = useWallet();

    type ActivityItem =
        | {
        id: string;
        type: "notification";
        title: string;
        description?: string;
        isRead: boolean;
        createdAt: string;
        raw: Notification;
    }
        | {
        id: string;
        type: "transaction";
        title: string;
        description: string;
        createdAt: string;
        raw: WalletLedgerEntry;
    };

    // 🔥 Merge notifications + wallet history
    const combinedFeed: ActivityItem[] = [
        ...notifications.map((n) => ({
            id: n._id,
            type: "notification" as const,
            title: n.title,
            description: n.description,
            isRead: n.isRead,
            createdAt: n.createdAt,
            raw: n,
        })),
        ...history.map((h) => ({
            id: h._id,
            type: "transaction" as const,
            title:
                h.type === "credit"
                    ? "Wallet Credit"
                    : "Wallet Debit",
            description: `${h.type === "credit" ? "+" : "-"}$${(
                h.amount / 100
            ).toFixed(2)} (${h.source})`,
            createdAt: h.createdAt,
            raw: h,
        })),
    ].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );

    return (
        <MainLayout>
            <div className="space-y-6 md:p-6 px-3 pt-2">

                {/* Header */}
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

                {(notificationsLoading || historyLoading) && (
                    <p className="text-gray-400">Loading...</p>
                )}

                {/* Activity Feed */}
                <div className="space-y-4">
                    {combinedFeed.map((item) => (
                        <Card
                            key={item.id}
                            className={`p-4 secondbg border-l-4 ${
                                item.type === "notification" && !item.isRead
                                    ? "border-[#175047]"
                                    : item.type === "transaction"
                                        ? "border-yellow-500"
                                        : "border-gray-600"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold dashtext">
                                    {item.title}
                                </h3>

                                {item.type === "notification" && (
                                    <div className="flex gap-2">
                                        {!item.isRead && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    markAsRead(item.raw._id)
                                                }
                                            >
                                                Read
                                            </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                deleteNotification(item.raw._id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-gray-400 mt-1">
                                {item.description}
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                                {new Date(item.createdAt).toLocaleString()}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}