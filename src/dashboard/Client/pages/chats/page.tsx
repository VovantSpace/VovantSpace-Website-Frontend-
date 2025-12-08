import { useEffect, useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { cn } from "@/dashboard/Innovator/lib/utils"

import { Input } from "@/dashboard/Innovator/components/ui/input"
import { Separator } from "@/dashboard/Innovator/components/ui/separator"
import { MainLayout } from "@/dashboard/Client/components/layout/main-layout"
import { ChatInterface } from "@/dashboard/Innovator/components/chat/chat-interface"
import { ChatHeader } from "@/dashboard/Innovator/components/chat/chat-header"
import type { Channel, User } from "@/dashboard/Innovator/components/chat/types"
import { getSocket } from "@/lib/socket"
import axios from "axios"

export default function ChatsPage() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    // ------------------------------------------------------
    // Load current user (client)
    // ------------------------------------------------------
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/user/profile", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                })

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
    // ------------------------------------------------------
    // Load existing chat rooms
    // ------------------------------------------------------
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axios.get("/api/chat/session-chats/my", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                })

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
                        sessionRequestId: ch.sessionRequestId
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

    // ------------------------------------------------------
    // Mark messages as read when opening a channel
    // ------------------------------------------------------
    useEffect(() => {
        if (!selectedChannel) return;

        const markAsRead = async () => {
            try {
                await axios.patch(
                    `/api/chat/${selectedChannel.id}/read`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                // Update UI immediately
                setChannels((prev) =>
                    prev.map((c) =>
                        c.id === selectedChannel.id
                            ? { ...c, unreadCount: 0 }
                            : c
                    )
                );
            } catch (err) {
                console.error("Failed to mark messages as read:", err);
            }
        };

        markAsRead();
    }, [selectedChannel]);

    // ------------------------------------------------------
    // Socket listeners
    // ------------------------------------------------------
    useEffect(() => {
        const socket = getSocket()

        socket.on("session-chat:created", (room) => {
            const normalized: Channel = {
                id: room.id,
                name: room.name,
                description: room.description,
                status: room.status ?? "upcoming",
                unreadCount: room.unreadCount ?? 0,
                nextActiveDate: room.nextActiveDate ?? null,
                closedAt: room.closedAt ?? null,
                mentorId: room.mentorId,
                menteeId: room.menteeId,
                sessionRequestId: room.sessionRequestId
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

        socket.on("chat:messages-read", ({channelId}) => {
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === channelId ? {...c, unreadCount: 0 } : c
                )
            )
        })

        return () => {
            socket.off("session-chat:created")
            socket.off("chat:unread-update")
            socket.off("session-chat:activated")
            socket.off("session-chat:closed")
            socket.off("chat:messages-read")
        }
    }, [selectedChannel])

    // ------------------------------------------------------
    // Send message
    // ------------------------------------------------------
    const handleSendMessage = async (content: string, fileUrl?: string, fileType?: string) => {
        if (!selectedChannel) return

        try {
            await axios.post(
                "/api/chat/send",
                {
                    channelId: selectedChannel.id,
                    content,
                    fileUrl,
                    fileType,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            )
        } catch (err) {
            console.error("Failed to send message:", err)
        }
    }

    // Helper function to shorten the chat title
    const shortenTitle = (title: string, limit = 25) => {
        if (!title) return "untitled"
        return title.length > limit ? title.substring(0, limit) + "..." : title;
    }

    // ------------------------------------------------------
    // Sidebar component
    // ------------------------------------------------------
    const SidebarContent = () => (
        <div className="fixed">
            <div className="p-4">
                <div className="relative w-[206px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext" />
                    <Input placeholder="Search Session" className="secondbg pl-9 border dashborder dashtext text-sm" />
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
                {/* Desktop sidebar */}
                <div className="hidden md:block w-[245px] pr-3 border-r dashborder secondbg rounded-l-xl">
                    <SidebarContent />
                </div>

                {/* Mobile sidebar */}
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

                {/* Main content */}
                <div className="flex-1 flex flex-col">
                    {/* header */}
                    <div className="fixed w-full z-10 md:relative">
                        <ChatHeader
                            channel={selectedChannel}
                            onVideoCall={() => {}}
                            onScheduleCall={() => {}}
                            onAudioCall={() => {}}
                        />
                    </div>

                    {/* Chat interface */}
                    <div className="mt-24 md:mt-10 h-[calc(100vh-140px)]">
                        {selectedChannel && currentUser && (
                            <ChatInterface
                                channelId={selectedChannel.id}
                                currentUser={currentUser}
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
