import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScrollToBottomProps {
  show: boolean
  onClick: () => void
}

export function ScrollToBottom({ show, onClick }: ScrollToBottomProps) {
  if (!show) return null

  return (
    <Button
      variant="secondary"
      size="icon"
      className="fixed bottom-20 right-8 rounded-full shadow-lg opacity-90 hover:opacity-100 transition-opacity"
      onClick={onClick}
    >
      <ArrowDown className="h-4 w-4" />
    </Button>
  )
}

