import { useState, useEffect, useCallback } from "react"
import { Search, Menu, X, Loader2 } from "lucide-react"
import { cn } from "@/dashboard/Innovator/lib/utils"
import axios from "axios";

import { Input } from "@/dashboard/Innovator/components/ui/input"
import { Separator } from "@/dashboard/Innovator/components/ui/separator";
import { MainLayout } from "../../components/layout/main-layout";
import { ChatInterface } from "@/dashboard/Innovator/components/chat/chat-interface";
import { ChatHeader } from "@/dashboard/Innovator/components/chat/chat-header";
import  useAuth  from "@/hooks/userService";
import { getSocket } from "@/lib/socket";
import type { Channel, ChatMessage } from "@/dashboard/Innovator/types";
import { mapToChatUser } from "@/lib/mapToChatUser";

export default function ChatsPage() {
    const { user: currentUser } = useAuth()
    const [rooms, setRooms] = useState<Channel[]>([])
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
    const [loading, setLoading] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)

    // Fetch chat rooms (Session Chats)
    const fetchRooms = useCallback(async () => {
        if (!currentUser?._id) return
        try {
            setLoading(true)
            // Use the session-chats endpoint to get timing info
            const res = await axios.get(`/session-chats/my`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            if (res.data?.success) {
                const fetchedRooms = res.data.data
                setRooms(fetchedRooms)

                // Auto-select first room if none selected
                if (!selectedChannel && fetchedRooms.length > 0) {
                    setSelectedChannel(fetchedRooms[0])
                }
            }
        } catch (err) {
            console.error("❌ Error fetching chat rooms:", err)
        } finally {
            setLoading(false)
        }
    }, [currentUser, selectedChannel])

    // Initial load
    useEffect(() => {
        fetchRooms()
    }, [fetchRooms])

    // Socket listeners for Session Status & Unread
    useEffect(() => {
        const socket = getSocket()

        // Listen for session activation
        socket.on("session-chat:activated", ({ room }) => {
            setRooms(prev =>
                prev.map(ch =>
                    ch.id === room._id ? { ...ch, status: 'active' } : ch
                )
            )
            if (selectedChannel?.id === room._id) {
                setSelectedChannel(prev => prev ? { ...prev, status: 'active' } : null)
            }
        })

        // Listen for session closing
        socket.on("session-chat:closed", ({ room }) => {
            setRooms(prev =>
                prev.map(ch =>
                    ch.id === room._id ? { ...ch, status: 'closed' } : ch
                )
            )
            if (selectedChannel?.id === room._id) {
                setSelectedChannel(prev => prev ? { ...prev, status: 'closed' } : null)
            }
        })

        // Listen for unread updates
        socket.on("chat:unread-update", ({ channelId, unreadCount }) => {
            setRooms(prev =>
                prev.map(ch =>
                    ch.id === channelId ? { ...ch, unreadCount } : ch
                )
            )
        })

        return () => {
            socket.off("session-chat:activated")
            socket.off("session-chat:closed")
            socket.off("chat:unread-update")
        }
    }, [selectedChannel])


    // Handle sending message
    const handleSendMessage = async (content: string, fileUrl?: string, fileType?: string) => {
        if (!selectedChannel?.id || !content.trim()) return
        try {
            const res = await axios.post('/api/session-chat/send', {
                channelId: selectedChannel.id,
                content,
                fileUrl,
                fileType,
            },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            )

            if (res.data?.success) {
                // Message will arrive via socket
            }
        } catch (err) {
            console.error('Error sending message:', err)
        }
    }

    // Sidebar content (desktop + mobile)
    const SidebarContent = () => (
        <div className="fixed md:relative w-[240px]">
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext" />
                    <Input
                        placeholder="Search Session"
                        className="secondbg pl-9 border dashborder dashtext focus:outline-none text-sm"
                    />
                </div>
            </div>

            <Separator className="my-2 secondbg" />

            <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                    Sessions
                </h2>

                {loading ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                ) : rooms.length === 0 ? (
                    <p className="text-sm text-gray-500 py-6">No active sessions yet.</p>
                ) : (
                    rooms.map((room) => (
                        <button
                            key={room.id}
                            className={cn(
                                "mb-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition",
                                selectedChannel?.id === room.id
                                    ? "dashbutton text-white"
                                    : "text-black dark:text-white hover:secondbg hover:dashtext"
                            )}
                            onClick={() => {
                                setSelectedChannel(room)
                                setIsSidebarOpen(false)
                            }}
                        >
                            <span className="truncate max-w-[180px]">{room.name}</span>
                            {room.unreadCount > 0 && (
                                <span className="rounded-full bg-red-500 text-white px-1.5 py-0.5 text-xs">
                                    {room.unreadCount}
                                </span>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>
    )

    if (!currentUser) {
        return (
            <MainLayout>
                <div className={'flex items-center justify-center h-screen'}>
                    <p className={'text-gray-500 text-sm'}>Loading user...</p>
                </div>
            </MainLayout>
        )
    }

    const chatUser = mapToChatUser(currentUser)

    return (
        <MainLayout>
            <div className="flex min-h-[93vh] dashbg rounded-xl overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-[245px] pr-3 border-r dashborder secondbg rounded-l-xl">
                    <SidebarContent />
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <div className="relative w-64 bg-white h-full p-4 pt-0 pl-1 dashbg">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="mb-4 absolute right-2 top-2"
                            >
                                <X className="h-6 w-6 dark:text-white" />
                            </button>
                            <SidebarContent />
                        </div>
                    </div>
                )}

                {/* Main Chat Content */}
                <div className="flex-1 flex flex-col">
                    <div className="fixed w-full z-10">
                        <div
                            className="md:hidden w-full border-b dark:text-white border-[#2a3142] secondbg px-4 py-2 flex items-center">
                            <button className="mr-2" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="h-4 w-4" />
                            </button>
                            <span className="font-medium text-sm">
                                {selectedChannel?.name || "Sessions"}
                            </span>
                        </div>

                        {selectedChannel && (
                            <ChatHeader
                                channel={selectedChannel}
                                onVideoCall={() => setIsVideoCallOpen(true)}
                                onScheduleCall={() => setIsVideoCallOpen(true)}
                                onAudioCall={() => {
                                }}
                            />
                        )}
                    </div>

                    {/* Chat Interface */}
                    <div className="mt-24 md:mt-10 flex-1 h-[calc(100vh-140px)]">
                        {selectedChannel ? (
                            <ChatInterface
                                channelId={selectedChannel.id}
                                currentUser={chatUser}
                                onSendMessage={handleSendMessage}
                                status={selectedChannel.status}
                                nextActiveDate={selectedChannel.nextActiveDate}
                                closedAt={selectedChannel.closedAt}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                Select a session to start messaging
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}