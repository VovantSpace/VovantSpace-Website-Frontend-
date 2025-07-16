import { cn } from "@innovator/lib/utils"

interface AvatarInitialProps {
  initial: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AvatarInitial({ initial, size = "md", className }: AvatarInitialProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-lg",
    lg: "h-16 w-16 text-xl",
  }

  // Generate a consistent color based on the initial
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]

  const colorIndex = initial.charCodeAt(0) % colors.length
  const bgColor = colors[colorIndex]

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full text-white font-medium",
        sizeClasses[size],
        bgColor,
        className,
      )}
    >
      {initial}
    </div>
  )
}

