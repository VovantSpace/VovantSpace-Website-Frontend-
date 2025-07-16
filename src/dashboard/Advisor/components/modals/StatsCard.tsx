import type { LucideIcon } from "lucide-react"
import { cn } from "@/dashboard/Innovator/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: {
    value: string
    positive: boolean
  }
  subtitle?: string
  iconBgColor?: string
  actionLink?: {
    text: string
    href: string
  }
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  subtitle,
  iconBgColor = "bg-primary/10",
  actionLink,
}: StatsCardProps) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-sm secondbg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground dark:text-white">{title}</h3>
        <div className={cn("rounded-full p-2", iconBgColor)}>
          <Icon className="h-5 w-5 text-primary dark:text-white" />
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-baseline">
          <h2 className="text-3xl font-bold">{value}</h2>
          {subtitle && <span className="ml-2 text-sm text-muted-foreground dark:text-white">{subtitle}</span>}
        </div>
        {change && (
          <p className="mt-1 flex items-center text-sm">
            <span className={cn("mr-1", change.positive ? "text-emerald-500" : "text-rose-500")}>
              {change.positive ? "↑" : "↓"} {change.value}
            </span>
            <span className="text-muted-foreground dark:text-white">vs last month</span>
          </p>
        )}
        {actionLink && (
          <a
            href={actionLink.href}
            className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            {actionLink.text}
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

