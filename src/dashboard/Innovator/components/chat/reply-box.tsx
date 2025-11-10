
import type React from "react"
import { useState } from "react"
import { Button } from "@/dashboard/Innovator/components/ui/button"
import { Input } from "@/dashboard/Innovator/components/ui/input"
import { MessageSquare, X } from "lucide-react"
import type {ReplyReference} from "@/dashboard/Innovator/types"

interface ReplyBoxProps {
  replyTo: ReplyReference
  onSubmit: (content: string) => void
  onCancel: () => void
}

export function ReplyBox({ replyTo, onSubmit, onCancel }: ReplyBoxProps) {
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content)
      setContent("")
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
        <MessageSquare className="h-4 w-4" />
        <span className="font-medium">{replyTo.userName}</span>
        <span className="truncate">{replyTo.content}</span>
        <Button variant="ghost" size="icon" onClick={onCancel} className="ml-auto h-6 w-6">
          <X className="h-3 w-3" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your reply..."
          className="flex-1"
        />
        <Button type="submit" disabled={!content.trim()}>
          Reply
        </Button>
      </form>
    </div>
  )
}

