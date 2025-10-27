import { Badge } from "@/dashboard/Innovator/components/ui/badge"
import { cn } from "../../Innovator/lib/utils"

interface StatusBadgeProps {
    status: "confirmed" | "completed" | "cancelled" | "pending_payment" | "upcoming" | "ongoing" | "scheduled" | "accepted" | "declined" | "counter_proposed" | "expired"
    className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const statusConfig: Record<
        string,
        { label: string; variant: "success" | "warning" | "destructive" | "secondary" }
    > = {
        confirmed: { label: "Confirmed", variant: "success" },
        completed: { label: "Completed", variant: "success" },
        cancelled: { label: "Cancelled", variant: "destructive" },
        pending_payment: { label: "Pending Payment", variant: "warning" },
        scheduled: { label: "Scheduled", variant: "success" },
        accepted: { label: "Accepted", variant: "success" },
        declined: { label: "Declined", variant: "destructive" },
        counter_proposed: { label: "Counter Proposed", variant: "warning" },
        ongoing: {label: "Ongoing", variant: "success"},
        upcoming: {label: "Upcoming", variant: "warning"},
        expired: {label: "Expired", variant: "destructive"},
    }

    const config = statusConfig[status] || {
        label: status || "Unknown",
        variant: "secondary" as const,
    }

    return (
        <Badge variant={config.variant} className={cn("font-medium", className)}>
            {config.label}
        </Badge>
    )
}
