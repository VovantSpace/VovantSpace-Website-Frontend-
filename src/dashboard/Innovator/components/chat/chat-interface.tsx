import React, { useState, useRef, useEffect } from "react"
import { Send, Plus, File, Mic, ImageIcon, PlusSquare } from 'lucide-react'
import { Button } from "@innovator/components/ui/button"
import { Input } from "@innovator/components/ui/input"
import { ScrollArea } from "@innovator/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@innovator/components/ui/dropdown-menu"
import type { ChatMessage, User, MessageAction, PollData } from "./types"
import { ChatMessageItem } from "./chat-message-item"
import { VideoCallDialog } from "./video-call-dialog"
import { EmojiPickerPopover } from "./emoji-picker-popover"
import { ScrollToBottom } from "./scroll-to-bottom"
import { PollCreator } from "./poll-creator"
import { encryptMessage } from "../../lib/encryption"

interface ChatInterfaceProps {
  channelId: string
  messages: ChatMessage[]
  currentUser: User
  onMessageAction: (action: MessageAction, messageId: string, data?: any) => void
}

export function ChatInterface({
  channelId,
  messages: initialMessages,
  currentUser,
  onMessageAction,
}: ChatInterfaceProps) {
  // State management
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isPollCreatorOpen, setIsPollCreatorOpen] = useState(false)
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isNearBottomRef = useRef(true)

  // Scroll handling
  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      isNearBottomRef.current = isNearBottom
      setShowScrollBottom(!isNearBottom)
    }

    scrollElement.addEventListener("scroll", handleScroll)
    return () => scrollElement.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-scroll to the bottom for new messages
  useEffect(() => {
    if (scrollRef.current && isNearBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Message sending handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const encryptedContent = await encryptMessage(newMessage)

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: encryptedContent,
      timestamp: new Date().toISOString(),
      channelId,
      status: "pending",
      user: currentUser,
      isEncrypted: true,
      seenBy: [currentUser.id],
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "delivered" } : msg
        )
      )
    }, 1000)
  }

  // File handling
  const handleFileUpload = async (type: "image" | "audio" | "document") => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image"
        ? "image/*"
        : type === "audio"
          ? "audio/*"
          : "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      fileInputRef.current.click()
    }
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      const fileUrl = URL.createObjectURL(file)

      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("audio/")
          ? "audio"
          : "document"

      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: currentUser.id,
        content: `Sent ${fileType}: ${file.name}`,
        timestamp: new Date().toISOString(),
        channelId,
        status: "pending",
        user: currentUser,
        fileType,
        fileUrl,
        isEncrypted: true,
        seenBy: [currentUser.id],
      }

      setMessages(prev => [...prev, message])

      // Simulate message delivery
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id ? { ...msg, status: "delivered" } : msg
          )
        )
      }, 1000)
    }

    e.target.value = ""
  }

  // Poll handling
  const handlePollSubmit = async (pollData: PollData) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: "Created a poll",
      timestamp: new Date().toISOString(),
      channelId,
      status: "pending",
      user: currentUser,
      isPoll: true,
      pollData,
      seenBy: [currentUser.id],
    }

    setMessages(prev => [...prev, message])
    setIsPollCreatorOpen(false)

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "delivered" } : msg
        )
      )
    }, 1000)
  }

  // Emoji handling
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  // Scroll to bottom handler
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  return (
    <div className="flex flex-col h-full dashbg overflow-hidden">
      {/* Messages Area */}
      <ScrollArea className="flex-1 md:pt-6 pt-0 px-4 dashbg dark:bg-black pb-20" ref={scrollRef}>
        <div className="space-y-3 dashbg">
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              currentUser={currentUser}
              onAction={(action, data) => onMessageAction(action, message.id, data)}
            />
          ))}
        </div>
      </ScrollArea>


      <ScrollToBottom show={showScrollBottom} onClick={scrollToBottom} />
      <div className="dark:border-gray-700 border-t fixed w-full mx-auto  border-gray-300 bottom-0">
        {/* Message Input Area */}
        <form onSubmit={handleSendMessage} className="flex items-center justify-center dashbg gap-2 p-4 pr-5 w-[100vw] md:w-[72vw] lg:md:w-[56vw] xl:w-[65vw] 2xl:w-[70vw]">
          <div className="dark:bg-white rounded-md">
            <EmojiPickerPopover
              onEmojiSelect={handleEmojiSelect}
              isOpen={isEmojiPickerOpen}
              onOpenChange={() => setIsEmojiPickerOpen(false)}
            />
          </div>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 text-sm"
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden "
            multiple
            onChange={handleFileSelected}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="dark:bg-white rounded-md" size="icon">
                <Plus className="h-5 w-5 " />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFileUpload("image")}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Gallery
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFileUpload("audio")}>
                <Mic className="h-4 w-4 mr-2" />
                Audio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFileUpload("document")}>
                <File className="h-4 w-4 mr-2" />
                Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsPollCreatorOpen(true)}>
                <PlusSquare className="h-4 w-4 mr-2" />
                Create Poll
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="submit" size="icon" className="dashbutton text-white">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Dialogs */}
      <VideoCallDialog
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        onSchedule={(data) => {
          onMessageAction("call", Date.now().toString(), data)
          setIsVideoCallOpen(false)
        }}
        mode="schedule"
      />

      <PollCreator
        isOpen={isPollCreatorOpen}
        onClose={() => setIsPollCreatorOpen(false)}
        onSubmit={handlePollSubmit}
      />
    </div>
  )
}
