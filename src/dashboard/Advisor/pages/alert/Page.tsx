import { Card } from "@/dashboard/Innovator/components/ui/card";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import { MainLayout } from "../../../component/main-layout";
import { useNotifications } from "@/hooks/useNotifications";
import { useWallet, WalletLedgerEntry } from "@/hooks/useWallet";

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
        raw: any;
    }
        | {
        id: string;
        type: "transaction";
        title: string;
        description: string;
        createdAt: string;
        raw: WalletLedgerEntry;
    };

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
            title: h.type === "credit" ? "Wallet Credit" : "Wallet Debit",
            description: `${h.type === "credit" ? "+" : "-"}$${(h.amount / 100).toFixed(2)} (${h.source})`,
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                            <div className="flex justify-between items-center gap-4">
                                <h3 className="font-semibold dashtext">{item.title}</h3>

                                {item.type === "notification" && (
                                    <div className="flex gap-2">
                                        {!item.isRead && (
                                            <Button
                                                size="sm"
                                                onClick={() => markAsRead(item.raw._id)}
                                            >
                                                Read
                                            </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => deleteNotification(item.raw._id)}
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

                    {!notificationsLoading && !historyLoading && combinedFeed.length === 0 && (
                        <Card className="p-4 secondbg">
                            <p className="text-sm text-gray-400">No alerts yet.</p>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}