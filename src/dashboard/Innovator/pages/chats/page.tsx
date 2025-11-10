import {useState, useEffect, useCallback} from "react"
import {Search, Menu, X, Loader2} from "lucide-react"
import {cn} from "@/dashboard/Innovator/lib/utils"
import axios from "axios";

import {Input} from "@/dashboard/Innovator/components/ui/input"
import {Separator} from "@/dashboard/Innovator/components/ui/separator";
import {MainLayout} from "../../components/layout/main-layout";
import {ChatInterface} from "@/dashboard/Innovator/components/chat/chat-interface";
import {ChatHeader} from "@/dashboard/Innovator/components/chat/chat-header";
import {useAuth} from "@/hooks/userService";
import {getSocket} from "@/lib/socket";
import type {Channel, ChatMessage} from "@/dashboard/Innovator/types";
import {mapToChatUser} from "@/lib/mapToChatUser";

interface ChatRoom {
    _id: string
    name: string
    description?: string
    challenge?: string
    unreadCount?: number
    participants: { _id: string; name: string; avatar?: string }[]
}

export default function ChatsPage() {
    const {user: currentUser} = useAuth()
    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [selectedChannel, setSelectedChannel] = useState<ChatRoom | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)

    // Fetch chat rooms
    const fetchRooms = useCallback(async () => {
        if (!currentUser?._id) return
        try {
            setLoading(true)
            const res = await axios.get(`/api/chat/rooms`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
            })
            if (res.data?.success) {
                const fetchedRooms = res.data.data.map((room: any) => ({
                    ...room,
                    id: room._id, // normalize for your ChatHeader component
                    unreadCount: room.unreadCount || 0,
                }))
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

    // Initial load + socket listeners
    useEffect(() => {
        fetchRooms()

        const socket = getSocket()
        socket.on("chat:room-created", (newRoom: ChatRoom) => {
            console.log("🆕 New chat room created:", newRoom)
            setRooms((prev) => {
                const exists = prev.find((r) => r._id === newRoom._id)
                return exists ? prev : [...prev, newRoom]
            })
        })

        // Listen for new incoming messages
        socket.on('chat:new-message', (newMessage: ChatMessage) => {
            console.log('New real-time message received:', newMessage)
            setMessages((prev) => {
                // Only update if message belongs to current open room
                if (selectedChannel && newMessage.channelId === selectedChannel._id) {
                    return [...prev, newMessage]
                }
                return prev
            })
        })

        return () => {
            socket.off("chat:room-created")
            socket.off("chat:new-message")
        }
    }, [fetchRooms, selectedChannel])

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChannel?._id) return
            try {
                const res = await axios.get(`/api/chat/${selectedChannel._id}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
                })
                if (res.data?.success) {
                    setMessages(res.data.data)
                }
            } catch (err) {
                console.error('Error fetching chat messages:', err)
            }
        }

        fetchMessages()
    }, [selectedChannel])

    // Handle message actions (e.g. star, delete)
    const handleMessageAction = (action: string, messageId: string, data?: any) => {
        switch (action) {
            case "star":
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === messageId ? {...msg, isStarred: !msg.isStarred} : msg
                    )
                )
                break
            case "delete":
                setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
                break
            default:
                break
        }
    }

    const handleSendMessage = async (content: string, fileUrl?: string, fileType?: string) => {
        if (!selectedChannel?._id || !content.trim()) return
        try {
            const res = await axios.post('/api/chat/send', {
                    channelId: selectedChannel._id,
                    content,
                    fileUrl: null,
                    fileType: null,
                },
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
                }
            )

            if (res.data?.success) {
                const sent = res.data.data
                setMessages((prev) => [...prev, sent])

                // Emit locally so the sender sees it instantly
                const socket = getSocket()
                socket.emit("chat:send-message", sent)
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
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext"/>
                    <Input
                        placeholder="Search Challenge"
                        className="secondbg pl-9 border dashborder dashtext focus:outline-none text-sm"
                    />
                </div>
            </div>

            <Separator className="my-2 secondbg"/>

            <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                    Active Chats
                </h2>

                {loading ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400"/>
                    </div>
                ) : rooms.length === 0 ? (
                    <p className="text-sm text-gray-500 py-6">No active chats yet.</p>
                ) : (
                    rooms.map((room) => (
                        <button
                            key={room._id}
                            className={cn(
                                "mb-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition",
                                selectedChannel?._id === room._id
                                    ? "dashbutton text-white"
                                    : "text-black dark:text-white hover:secondbg hover:dashtext"
                            )}
                            onClick={() => {
                                setSelectedChannel(room)
                                setIsSidebarOpen(false)
                            }}
                        >
                            <span className="truncate max-w-[180px]">{room.name}</span>
                            {room.unreadCount && room.unreadCount > 0 && (
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
                    <SidebarContent/>
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
                                <X className="h-6 w-6 dark:text-white"/>
                            </button>
                            <SidebarContent/>
                        </div>
                    </div>
                )}

                {/* Main Chat Content */}
                <div className="flex-1 flex flex-col">
                    <div className="fixed w-full z-10">
                        <div
                            className="md:hidden w-full border-b dark:text-white border-[#2a3142] secondbg px-4 py-2 flex items-center">
                            <button className="mr-2" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="h-4 w-4"/>
                            </button>
                            <span className="font-medium text-sm">
                {selectedChannel?.name || "Chats"}
              </span>
                        </div>

                        {selectedChannel && (
                            <ChatHeader
                                channel={{
                                    id: selectedChannel._id,
                                    name: selectedChannel.name,
                                    description: selectedChannel.description || "Challenge chat room",
                                }}
                                onVideoCall={() => setIsVideoCallOpen(true)}
                                onScheduleCall={() => setIsVideoCallOpen(true)}
                                onAudioCall={() => {
                                }}
                            />
                        )}
                    </div>

                    {/* Chat Interface */}
                    <div className="mt-24 md:mt-10 flex-1">
                        {selectedChannel ? (
                            <ChatInterface
                                channelId={selectedChannel._id}
                                // messages={messages}
                                currentUser={chatUser}
                                // onMessageAction={handleMessageAction}
                                // onSendMessage={handleSendMessage}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                Select a chat to start messaging
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}