import { Star } from "lucide-react"
import { cn } from "@innovator/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  count?: number
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showCount = false,
  count,
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {stars.map((star) => (
        <Star
          key={star}
          className={cn(sizeClasses[size], "fill-current", star <= rating ? "text-yellow-400" : "text-muted")}
        />
      ))}

      {showCount && count !== undefined && (
        <span className={cn("text-muted-foreground ml-1", textSize[size])}>({count})</span>
      )}
    </div>
  )
}

