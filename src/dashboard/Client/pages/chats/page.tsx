import { useEffect, useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { cn } from "@/dashboard/Innovator/lib/utils"

import { Input } from "@/dashboard/Innovator/components/ui/input"
import { Separator } from "@/dashboard/Innovator/components/ui/separator"
import { MainLayout } from "@/dashboard/Client/components/layout/main-layout"
import { ChatInterface } from "@/dashboard/Innovator/components/chat/chat-interface"
import { ChatHeader } from "@/dashboard/Innovator/components/chat/chat-header"
import type { Channel, User, ChatMessage } from "@/dashboard/Innovator/components/chat/types"
import { getSocket } from "@/lib/socket"
import api from "@/utils/api"

export default function ChatsPage() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/user/profile")
                const u = res.data?.user || res.data?.data
                if (!u) return

                setCurrentUser({
                    id: u._id,
                    name: `${u.firstName} ${u.lastName}`.trim(),
                    email: u.email,
                    avatar: u.profilePicture,
                    role: u.role,
                    timeZone: u.timeZone || "UTC",
                    phone: u.phone,
                    bio: u.bio,
                    skills: u.skills || [],
                })
            } catch (error) {
                console.error("Failed to load client profile:", error)
            }
        }

        fetchUser()
    }, [])

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get("/chat/session-chats/my")

                if (res.data?.success) {
                    const chats: Channel[] = res.data.data || []

                    const normalized = chats.map((ch) => ({
                        id: ch.id,
                        name: ch.name,
                        description: ch.description,
                        status: ch.status || "upcoming",
                        unreadCount: ch.unreadCount ?? 0,
                        nextActiveDate: ch.nextActiveDate || null,
                        closedAt: ch.closedAt || null,
                        mentorId: ch.mentorId,
                        menteeId: ch.menteeId,
                        sessionRequestId: ch.sessionRequestId,
                    }))

                    setChannels(normalized)

                    if (!selectedChannel && normalized.length > 0) {
                        setSelectedChannel(normalized[0])
                    }
                }
            } catch (err) {
                console.error("Failed to load client session chats:", err)
            }
        }

        fetchChats()
    }, [])

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChannel?.id) return

            try {
                const res = await api.get(`/chat/${selectedChannel.id}/messages`)

                console.log("raw messages response:", res.data.data)
                console.log("first raw message:", res.data.data?.[0])

                if (res.data?.success) {
                    const normalizedMessages: ChatMessage[] = (res.data.data || []).map((msg: any) => ({
                        id: msg.id || msg._id,
                        channelId: msg.channelId,
                        senderId: msg.senderId || msg.userId || msg.user?.id || msg.user?._id || "",
                        senderName:
                            msg.senderName ||
                            msg.user?.name ||
                            `${msg.user?.firstName || ""} ${msg.user?.lastName || ""}`.trim() ||
                            "Unknown User",
                        senderAvatar:
                            msg.senderAvatar ||
                            msg.user?.avatar ||
                            msg.user?.profilePicture ||
                            "",
                        content: msg.content,
                        fileUrl: msg.fileUrl,
                        fileType: msg.fileType,
                        createdAt: msg.createdAt || msg.timestamp || msg.updatedAt,
                        pending: msg.status === "pending",
                    }))

                    setMessages(normalizedMessages)
                }
            } catch (err) {
                console.error("Failed to load messages:", err)
            }
        }

        fetchMessages()
    }, [selectedChannel])

    useEffect(() => {
        if (!selectedChannel) return

        const markAsRead = async () => {
            try {
                await api.patch(`/chat/${selectedChannel.id}/read`)

                setChannels((prev) =>
                    prev.map((c) =>
                        c.id === selectedChannel.id ? { ...c, unreadCount: 0 } : c
                    )
                )
            } catch (err) {
                console.error("Failed to mark messages as read:", err)
            }
        }

        markAsRead()
    }, [selectedChannel])

    useEffect(() => {
        const socket = getSocket()

        socket.on("session-chat:created", (room) => {
            const normalized: Channel = {
                id: room.id || room._id,
                name: room.name,
                description: room.description,
                status: room.status ?? "upcoming",
                unreadCount: room.unreadCount ?? 0,
                nextActiveDate: room.nextActiveDate ?? null,
                closedAt: room.closedAt ?? null,
                mentorId: room.mentorId,
                menteeId: room.menteeId,
                sessionRequestId: room.sessionRequestId,
            }

            setChannels((prev) => {
                const exists = prev.some((c) => c.id === normalized.id)
                if (exists) return prev

                const next = [...prev, normalized]

                if (!selectedChannel) setSelectedChannel(normalized)
                return next
            })
        })

        socket.on("chat:unread-update", ({ channelId, unreadCount }) => {
            setChannels((prev) =>
                prev.map((c) => (c.id === channelId ? { ...c, unreadCount } : c))
            )
        })

        socket.on("session-chat:activated", ({ room }) => {
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === room._id.toString()
                        ? { ...c, status: "active", nextActiveDate: null }
                        : c
                )
            )
        })

        socket.on("session-chat:closed", ({ room }) => {
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === room._id.toString()
                        ? { ...c, status: "closed", closedAt: room.closedAt }
                        : c
                )
            )
        })

        socket.on("chat:messages-read", ({ channelId }) => {
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === channelId ? { ...c, unreadCount: 0 } : c
                )
            )
        })

        // Socket to check for new messages
        socket.on("chat:new-message", (message: any) => {
            const normalizedMessage: ChatMessage = {
                id: message.id || message._id,
                channelId: message.channelId,
                senderId: message.senderId || message.userId || message.user?.id || message.user?._id || "",
                senderName:
                    message.senderName ||
                    message.user?.name ||
                    `${message.user?.firstName || ""} ${message.user?.lastName || ""}`.trim() ||
                    "Unknown User",
                senderAvatar:
                    message.senderAvatar ||
                    message.user?.avatar ||
                    message.user?.profilePicture ||
                    "",
                content: message.content,
                fileUrl: message.fileUrl,
                fileType: message.fileType,
                createdAt: message.createdAt || message.timestamp || message.updatedAt,
                pending: message.status === "pending",
            }

            if (normalizedMessage.channelId === selectedChannel?.id) {
                setMessages((prev) => {
                    const exists = prev.some((m) => m.id === normalizedMessage.id)
                    return exists ? prev : [...prev, normalizedMessage]
                })
            }
        })

        return () => {
            socket.off("session-chat:created")
            socket.off("chat:unread-update")
            socket.off("session-chat:activated")
            socket.off("session-chat:closed")
            socket.off("chat:messages-read")
            socket.off("chat:new-message")
        }
    }, [selectedChannel])

    const handleSendMessage = async (content: string, fileUrl?: string, fileType?: string) => {
        if (!selectedChannel || !currentUser || isSending) return

        const trimmedContent = content.trim()
        if (!trimmedContent && !fileUrl) return

        setIsSending(true)

        const tempMessage: ChatMessage = {
            id: `temp-${Date.now()}`,
            channelId: selectedChannel.id,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            content: trimmedContent,
            fileUrl,
            fileType,
            createdAt: new Date().toISOString(),
            pending: true,
        }

        setMessages((prev) => [...prev, tempMessage])

        try {
            const res = await api.post("/chat/send", {
                channelId: selectedChannel.id,
                content: trimmedContent,
                fileUrl,
                fileType,
            })

            if (res.data?.success && res.data.data) {
                const saved: ChatMessage = {
                    id: res.data.data.id || res.data.data._id,
                    channelId: res.data.data.channelId,
                    senderId: res.data.data.senderId,
                    senderName: res.data.data.senderName,
                    senderAvatar: res.data.data.senderAvatar,
                    content: res.data.data.content,
                    fileUrl: res.data.data.fileUrl,
                    fileType: res.data.data.fileType,
                    createdAt: res.data.data.createdAt,
                    pending: false,
                }

                setMessages((prev) =>
                    prev.map((m) => (m.id === tempMessage.id ? saved : m))
                )
            }
        } catch (err) {
            setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id))
            console.error("Failed to send message:", err)
        } finally {
            setIsSending(false)
        }
    }

    const shortenTitle = (title: string, limit = 25) => {
        if (!title) return "untitled"
        return title.length > limit ? title.substring(0, limit) + "..." : title
    }

    const SidebarContent = () => (
        <div className="fixed">
            <div className="p-4">
                <div className="relative w-[206px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext" />
                    <Input
                        placeholder="Search Session"
                        className="secondbg pl-9 border dashborder dashtext text-sm"
                    />
                </div>
            </div>

            <Separator className="my-2 secondbg" />

            <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Sessions</h2>

                {channels.map((ch) => (
                    <button
                        key={ch.id}
                        onClick={() => {
                            setSelectedChannel(ch)
                            setIsSidebarOpen(false)
                        }}
                        className={cn(
                            "mb-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm",
                            selectedChannel?.id === ch.id
                                ? "dashbutton text-white"
                                : "text-black dark:text-white hover:secondbg hover:dashtext"
                        )}
                    >
                        <span>{shortenTitle(ch.name)}</span>
                        {!!ch.unreadCount && (
                            <span className="rounded-full bg-red-500 text-white px-1.5 py-0.5 text-xs">
                                {ch.unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )

    return (
        <MainLayout>
            <div className="flex min-h-[93vh] dashbg rounded-xl">
                <div className="hidden md:block w-[245px] pr-3 border-r dashborder secondbg rounded-l-xl">
                    <SidebarContent />
                </div>

                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsSidebarOpen(false)} />
                        <div className="relative w-64 bg-white h-full p-4 dashbg">
                            <button onClick={() => setIsSidebarOpen(false)} className="mb-4">
                                <X className="h-6 w-6 dark:text-white absolute right-2" />
                            </button>
                            <SidebarContent />
                        </div>
                    </div>
                )}

                <div className="flex-1 flex flex-col">
                    <div className="fixed w-full z-10 md:relative">
                        <ChatHeader
                            channel={selectedChannel}
                            onVideoCall={() => {}}
                            onScheduleCall={() => {}}
                            onAudioCall={() => {}}
                        />
                    </div>

                    <div className="mt-24 md:mt-10 h-[calc(100vh-140px)]">
                        {selectedChannel && currentUser && (
                            <ChatInterface
                                channelId={selectedChannel.id}
                                currentUser={currentUser}
                                messages={messages}
                                isSending={isSending}
                                onSendMessage={handleSendMessage}
                                status={selectedChannel.status}
                                nextActiveDate={selectedChannel.nextActiveDate}
                                closedAt={selectedChannel.closedAt}
                            />
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}