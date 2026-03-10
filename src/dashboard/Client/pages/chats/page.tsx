import { useEffect, useState, useCallback } from "react"
import { Search, X } from "lucide-react"
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
    const socket = getSocket()

    const normalizeChannel = useCallback((ch: any): Channel => ({
        id: ch.id || ch._id,
        name: ch.name || "Untitled session",
        description: ch.description,
        status: ch.status || "upcoming",
        unreadCount: ch.unreadCount ?? 0,
        nextActiveDate: ch.nextActiveDate || null,
        closedAt: ch.closedAt || null,
        mentorId: ch.mentorId,
        menteeId: ch.menteeId,
        sessionRequestId: ch.sessionRequestId,
    }), [])

    const normalizeMessage = useCallback((msg: any): ChatMessage => ({
        id: msg.id || msg._id,
        channelId: msg.channelId,
        senderId:
            msg.senderId ||
            msg.userId ||
            msg.sender?._id ||
            msg.sender?.id ||
            msg.user?._id ||
            msg.user?.id ||
            "",
        senderName:
            msg.senderName ||
            msg.sender?.name ||
            `${msg.sender?.firstName || ""} ${msg.sender?.lastName || ""}`.trim() ||
            msg.user?.name ||
            `${msg.user?.firstName || ""} ${msg.user?.lastName || ""}`.trim() ||
            "Unknown User",
        senderAvatar:
            msg.senderAvatar ||
            msg.sender?.avatar ||
            msg.sender?.profilePicture ||
            msg.user?.avatar ||
            msg.user?.profilePicture ||
            "",
        content: msg.content,
        fileUrl: msg.fileUrl,
        fileType: msg.fileType,
        createdAt: msg.createdAt || msg.timestamp || msg.updatedAt || new Date().toISOString(),
        pending: msg.pending ?? msg.status === "pending",
    }), [])

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
        if (!currentUser) return

        const handleConnect = () => {
            socket.emit("join_mentee_room", currentUser.id)
        }

        socket.on("connect", handleConnect)

        if (socket.connected) {
            handleConnect()
        }

        return () => {
            socket.off("connect", handleConnect)
        }
    }, [currentUser, socket])

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get("/chat/session-chats/my")

                if (res.data?.success) {
                    const normalized = (res.data.data || []).map((ch: any) => normalizeChannel(ch))
                    setChannels(normalized)

                    if (normalized.length > 0) {
                        setSelectedChannel((prev) => prev ?? normalized[0])
                    }
                }
            } catch (err) {
                console.error("Failed to load client session chats:", err)
            }
        }

        fetchChats()
    }, [normalizeChannel])

    useEffect(() => {
        if (!selectedChannel?.id) return

        socket.emit("chat:join-room", selectedChannel.id)

        return () => {
            socket.emit("chat:leave-room", selectedChannel.id)
        }
    }, [selectedChannel, socket])

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChannel?.id) return

            try {
                const res = await api.get(`/chat/${selectedChannel.id}/messages`)

                if (res.data?.success) {
                    const normalizedMessages: ChatMessage[] = (res.data.data || []).map((msg: any) =>
                        normalizeMessage(msg)
                    )
                    setMessages(normalizedMessages)
                }
            } catch (err) {
                console.error("Failed to load messages:", err)
            }
        }

        fetchMessages()
    }, [selectedChannel, normalizeMessage])

    useEffect(() => {
        if (!selectedChannel?.id) return

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
        const handleSessionChatCreated = (room: any) => {
            const normalized = normalizeChannel(room)

            setChannels((prev) => {
                const exists = prev.some((c) => c.id === normalized.id)
                if (exists) return prev

                const next = [...prev, normalized]

                if (!selectedChannel) {
                    setSelectedChannel(normalized)
                }

                return next
            })
        }

        const handleUnreadUpdate = ({
                                        channelId,
                                        unreadCount,
                                    }: {
            channelId: string
            unreadCount: number
        }) => {
            setChannels((prev) =>
                prev.map((c) => (c.id === channelId ? { ...c, unreadCount } : c))
            )
        }

        const handleActivated = ({ room }: any) => {
            const roomId = room.id || room._id?.toString()
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === roomId
                        ? { ...c, status: "active", nextActiveDate: null }
                        : c
                )
            )
        }

        const handleClosed = ({ room }: any) => {
            const roomId = room.id || room._id?.toString()
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === roomId
                        ? { ...c, status: "closed", closedAt: room.closedAt }
                        : c
                )
            )
        }

        const handleMessagesRead = ({ channelId }: { channelId: string }) => {
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === channelId ? { ...c, unreadCount: 0 } : c
                )
            )
        }

        const handleNewMessage = (rawMessage: any) => {
            const normalizedMessage = normalizeMessage(rawMessage)

            setMessages((prev) => {
                const alreadyExists = prev.some(
                    (m) =>
                        m.id === normalizedMessage.id ||
                        (
                            m.pending &&
                            m.senderId === normalizedMessage.senderId &&
                            m.channelId === normalizedMessage.channelId &&
                            m.content === normalizedMessage.content
                        )
                )

                if (alreadyExists) {
                    return prev.map((m) =>
                        m.pending &&
                        m.senderId === normalizedMessage.senderId &&
                        m.channelId === normalizedMessage.channelId &&
                        m.content === normalizedMessage.content
                            ? normalizedMessage
                            : m
                    )
                }

                return normalizedMessage.channelId === selectedChannel?.id
                    ? [...prev, normalizedMessage]
                    : prev
            })
        }

        socket.on("session-chat:created", handleSessionChatCreated)
        socket.on("chat:unread-update", handleUnreadUpdate)
        socket.on("chat:activated", handleActivated)
        socket.on("chat:closed", handleClosed)
        socket.on("chat:messages-read", handleMessagesRead)
        socket.on("chat:new-message", handleNewMessage)

        return () => {
            socket.off("session-chat:created", handleSessionChatCreated)
            socket.off("chat:unread-update", handleUnreadUpdate)
            socket.off("chat:activated", handleActivated)
            socket.off("chat:closed", handleClosed)
            socket.off("chat:messages-read", handleMessagesRead)
            socket.off("chat:new-message", handleNewMessage)
        }
    }, [socket, selectedChannel, normalizeChannel, normalizeMessage])

    useEffect(() => {
        const syncMessages = async () => {
            if (!selectedChannel?.id) return

            try {
                const res = await api.get(`/chat/${selectedChannel.id}/messages`)

                if (res.data?.success) {
                    const normalizedMessages: ChatMessage[] = (res.data.data || []).map((msg: any) =>
                        normalizeMessage(msg)
                    )

                    setMessages(normalizedMessages)
                }
            } catch (err) {
                console.error("Message sync failed:", err)
            }
        }

        socket.on("connect", syncMessages)

        return () => {
            socket.off("connect", syncMessages)
        }
    }, [selectedChannel, socket, normalizeMessage])

    const handleSendMessage = async (content: string, file?: File) => {
        if (!selectedChannel || !currentUser || isSending) return;

        const trimmedContent = content.trim();
        if (!trimmedContent && !file) return;

        setIsSending(true);

        const inferredFileType = file
            ? file.type.startsWith("image/")
                ? "image"
                : file.type.startsWith("audio/")
                    ? "audio"
                    : "document"
            : undefined;

        const tempMessage: ChatMessage = {
            id: `temp-${Date.now()}`,
            channelId: selectedChannel.id,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            content: file
                ? `Sending ${inferredFileType || "file"}: ${file.name}`
                : trimmedContent,
            fileUrl: file ? URL.createObjectURL(file) : undefined,
            fileType: inferredFileType,
            createdAt: new Date().toISOString(),
            pending: true,
        };

        setMessages((prev) => [...prev, tempMessage]);

        try {
            let saved: ChatMessage | null = null;

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("channelId", selectedChannel.id);
                formData.append("uploadType", "chat");

                const res = await api.post("/chat/upload?uploadType=chat", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (res.data?.success && res.data.data) {
                    saved = normalizeMessage(res.data.data);
                }
            } else {
                const res = await api.post("/chat/send", {
                    channelId: selectedChannel.id,
                    content: trimmedContent,
                });

                if (res.data?.success && res.data.data) {
                    saved = normalizeMessage(res.data.data);
                }
            }

            if (saved) {
                setMessages((prev) =>
                    prev.map((m) => (m.id === tempMessage.id ? saved : m))
                );
            } else {
                setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
            }
        } catch (err) {
            setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
            console.error("Failed to send message:", err);
        } finally {
            if (file && tempMessage.fileUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(tempMessage.fileUrl);
            }
            setIsSending(false);
        }
    };

    const shortenTitle = (title: string, limit = 25) => {
        if (!title) return "Untitled session"
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
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={() => setIsSidebarOpen(false)}
                        />
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
                        {selectedChannel && currentUser ? (
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
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Select a session to chat
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}