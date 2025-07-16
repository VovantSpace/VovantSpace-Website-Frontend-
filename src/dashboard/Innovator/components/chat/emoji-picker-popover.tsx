
import { useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@innovator/components/ui/popover"
import { Button } from "@innovator/components/ui/button"
import { Smile } from "lucide-react"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"

interface EmojiPickerPopoverProps {
  onEmojiSelect: (emoji: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function EmojiPickerPopover({ onEmojiSelect, isOpen, onOpenChange }: EmojiPickerPopoverProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onOpenChange])

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji)
    onOpenChange(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" ref={triggerRef}>
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side="top">
        <EmojiPicker onEmojiClick={handleEmojiClick} skinTonesDisabled searchDisabled height={350} width={300} />
      </PopoverContent>
    </Popover>
  )
}

