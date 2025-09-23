import { Badge } from "@/dashboard/Innovator/components/ui/badge"
import { cn } from "../../Innovator/lib/utils"

interface StatusBadgeProps {
  status: "confirmed" | "completed" | "cancelled" | "pending_payment"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    confirmed: {
      label: "Confirmed",
      variant: "success" as const,
    },
    completed: {
      label: "Completed",
      variant: "success" as const,
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive" as const,
    },
    pending_payment: {
      label: "Pending Payment",
      variant: "warning" as const,
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={cn("font-medium", className)}>
      {config.label}
    </Badge>
  )
}

