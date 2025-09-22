import { useState } from "react"
import { Search, Star, Menu, X } from "lucide-react"
import { cn } from "@innovator/lib/utils"

import { Input } from "@innovator/components/ui/input"
import { ScrollArea } from "@innovator/components/ui/scroll-area"
import { Separator } from "@innovator/components/ui/separator"
import { MainLayout } from "../../../component/main-layout";
import { ChatInterface } from "@innovator/components/chat/chat-interface"
import { ChatHeader } from "@innovator/components/chat/chat-header"
import { users, currentUser } from "@innovator/data/user"
import type { Channel, StarredMessage, ChatMessage } from "@innovator/types"

const channels: Channel[] = [
  {
    id: "1",
    name: "Ayotomiwa Alao",
    company: '#ai-smart-farming',
    unreadCount: 3,
    description: "A Full Stack Developer and CEO",
  },
  {
    id: "2",
    name: "Abdul Rafay",
    unreadCount: 0,
    description: "A Full Stack Developer and CEO",
  },
]

const starredMessages: StarredMessage[] = [
  {
    id: "1",
    content: "Important milestone achieved!",
    author: users[0],
    timestamp: "2h ago",
    channelId: "ai-smart-farming",
  },
]

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    userId: users[0].id,
    content: "I've analyzed the crop yield data and created a preliminary ML model.",
    timestamp: new Date().toISOString(),
    channelId: "ai-smart-farming",
    user: users[0],
    status: "delivered",
  },
  {
    id: "2",
    userId: users[1].id,
    content: "Great work! Can you share the accuracy metrics?",
    timestamp: new Date().toISOString(),
    channelId: "ai-smart-farming",
    user: users[1],
    status: "delivered",
  },
]

export default function ChatsPage() {
  const [selectedChannel, setSelectedChannel] = useState(channels[0])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)

  // Sidebar content as a variable for reuse on mobile and desktop
  const SidebarContent = () => (
    <>
      <div className="fixed ">
        <div className="p-4">
          <div className="relative w-[206px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext" />
            <Input placeholder="Search Session" className="secondbg pl-9 border dashborder dashtext focus:outline-none text-sm" />
          </div>
        </div>

        {/* <div className="px-4 py-2">
        <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Starred Messages</h2>
        <ScrollArea className="h-[100px]">
          {starredMessages.map((message) => (
            <div key={message.id} className="mb-2 rounded-lg p-2 hover:secondbg">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[#00bf8f]" />
                <span className="text-sm dashtext">{message.content}</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                {message.author.name} • {message.timestamp}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div> */}

        <Separator className="my-2 secondbg" />

        <div className="px-4 py-2">
          <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Sessions</h2>
          {channels.map((channel) => (
            <button
              key={channel.id}
              className={cn(
                "mb-1 flex w-full items-center justify-between  rounded-lg px-2 py-1.5 text-sm",
                selectedChannel.id === channel.id
                  ? "dashbutton text-white"
                  : "text-black dark:text-white hover:secondbg hover:dashtext",
              )}
              onClick={() => {
                setSelectedChannel(channel)
                setIsSidebarOpen(false)
              }}
            >
              <span className="">{channel.name}</span>
              {channel.unreadCount > 0 && (
                <span className="rounded-full bg-red-500 text-white px-1.5 py-0.5 text-xs">{channel.unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  )

  const handleMessageAction = (action: string, messageId: string, data?: any) => {
    switch (action) {
      case "star":
        const message = messages.find((m) => m.id === messageId)
        if (message) {
          const newStarredMessage: StarredMessage = {
            id: message.id,
            content: message.content,
            author: message.user || users[0],
            timestamp: new Date(message.timestamp).toLocaleTimeString(),
            channelId: message.channelId,
          }
          starredMessages.push(newStarredMessage)
        }
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg)))
        break
      // Other actions handled by ChatInterface
    }
  }

  return (
    <MainLayout>
      <div className="flex min-h-[93vh] md:min-h-[93vh] dashbg rounded-xl">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-[245px] pr-3 border-r dashborder secondbg rounded-l-xl">
          <SidebarContent />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsSidebarOpen(false)} />
            <div className="relative w-64 bg-white h-full p-4 pt-0 pl-1 dashbg ">
              <button onClick={() => setIsSidebarOpen(false)} className="mb-4">
                <X className="h-6 w-6 dark:text-white absolute right-2 " />
              </button>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main Chat Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}


          {/* Chat Header */}
          <div className="fixed w-full z-10">
          <div className="md:hidden w-full border-b dark:text-white border-[#2a3142] secondbg px-4 py-2 flex items-center">
            <button className="mr-2" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </button>
          </div>
            <ChatHeader
              channel={selectedChannel}
              onVideoCall={() => setIsVideoCallOpen(true)}
              onScheduleCall={() => setIsVideoCallOpen(true)}
              onAudioCall={() => { }} // Implement audio call functionality
            />
          </div>
          {/* Chat Interface */}
          <div className="mt-24 md:mt-10">
            <ChatInterface
              channelId={selectedChannel.id}
              messages={messages}
              currentUser={currentUser}
              onMessageAction={handleMessageAction}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

