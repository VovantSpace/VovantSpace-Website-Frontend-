import { useState } from "react"
import { Button } from "@/dashboard/Innovator/components/ui/button"
import { Input } from "@/dashboard/Innovator/components/ui/input"
import { Check, X } from "lucide-react"

interface MessageEditorProps {
  initialContent: string
  onSave: (content: string) => void
  onCancel: () => void
}

export function MessageEditor({ initialContent, onSave, onCancel }: MessageEditorProps) {
  const [content, setContent] = useState(initialContent)

  const handleSave = () => {
    if (content.trim() && content !== initialContent) {
      onSave(content)
    } else {
      onCancel()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input value={content} onChange={(e) => setContent(e.target.value)} className="flex-1 text-black text-sm" autoFocus />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8">
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

