import { useEffect, useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { cn } from "@/dashboard/Innovator/lib/utils"

import { Input } from "@/dashboard/Innovator/components/ui/input"
import { Separator } from "@/dashboard/Innovator/components/ui/separator"
import { MainLayout } from "@/dashboard/Client/components/layout/main-layout";
import { ChatInterface } from "@/dashboard/Innovator/components/chat/chat-interface"
import { ChatHeader } from "@/dashboard/Innovator/components/chat/chat-header"
import type { Channel, User } from "@/dashboard/Innovator/types"
import { getSocket } from '@/lib/socket'
import axios from "axios";


export default function ChatsPage() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    // Load current user
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get('/api/user/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setCurrentUser(res.data.data)
        }

        fetchUser()
    }, [])

    // Fetch CLIENT session chat rooms (same endpoint works for mentor or client)
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axios.get('/api/chat/session-chats/my', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })

                if (res.data?.success) {
                    const chats = res.data.data

                    setChannels(chats)

                    if (chats.length > 0) {
                        setSelectedChannel(chats[0])
                    }
                }
            } catch (error) {
                console.error('Failed to load client session chats:', error)
            }
        }
        fetchChats()
    }, [])

    // Send message handler
    const handleSendMessage = async (content: string, fileUrl?: string, fileType?: string) => {
        if (!selectedChannel) return;

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
            );
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    // Sidebar content
    const SidebarContent = () => (
        <>
            <div className="fixed">
                <div className="p-4">
                    <div className="relative w-[206px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext" />
                        <Input
                            placeholder="Search Session"
                            className="secondbg pl-9 border dashborder dashtext focus:outline-none text-sm"
                        />
                    </div>
                </div>

                <Separator className="my-2 secondbg" />

                <div className="px-4 py-2">
                    <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Sessions</h2>

                    {channels.map((channel) => (
                        <button
                            key={channel.id}
                            className={cn(
                                "mb-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm",
                                selectedChannel?.id === channel.id
                                    ? "dashbutton text-white"
                                    : "text-black dark:text-white hover:secondbg hover:dashtext"
                            )}
                            onClick={() => {
                                setSelectedChannel(channel)
                                setIsSidebarOpen(false)
                            }}
                        >
                            <span>{channel.name}</span>

                            {channel.unreadCount > 0 && (
                                <span className="rounded-full bg-red-500 text-white px-1.5 py-0.5 text-xs">
                                    {channel.unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )

    // Socket listeners
    useEffect(() => {
        const socket = getSocket()

        // create chat
        socket.on('session-chat:created', (room) => {
            setChannels(prev => [...prev, room])

            if (!selectedChannel) setSelectedChannel(room)
        })

        // unread updates
        socket.on("chat:unread-update", ({ channelId, unreadCount }) => {
            setChannels(prev =>
                prev.map(ch =>
                    ch.id === channelId ? { ...ch, unreadCount } : ch
                )
            )
        })

        // session activation
        socket.on("session-chat:activated", ({ room }) => {
            setChannels(prev =>
                prev.map(ch =>
                    ch.id === room._id ? { ...ch, status: 'active' } : ch
                )
            )

            if (selectedChannel?.id === room._id) {
                setSelectedChannel(prev =>
                    prev ? { ...prev, status: 'active' } : null
                )
            }
        })

        // session closed
        socket.on("session-chat:closed", ({ room }) => {
            setChannels(prev =>
                prev.map(ch =>
                    ch.id === room._id ? { ...ch, status: 'closed' } : ch
                )
            )

            if (selectedChannel?.id === room._id) {
                setSelectedChannel(prev =>
                    prev ? { ...prev, status: 'closed' } : null
                )
            }
        })

        return () => {
            socket.off("chat:unread-update")
            socket.off("session-chat:activated")
            socket.off("session-chat:closed")
        }
    }, [selectedChannel])

    // Auto-open room when activated
    useEffect(() => {
        const socket = getSocket()

        socket.on("chat:activated", ({ room }) => {
            const match = channels.find(ch => ch.id === room._id.toString())
            if (match) setSelectedChannel(match)
        })

        return () => {
            socket.off("chat:activated")
        }
    }, [channels])


    return (
        <MainLayout>
            <div className="flex min-h-[93vh] dashbg rounded-xl">

                {/* Desktop Sidebar */}
                <div className="hidden md:block w-[245px] pr-3 border-r dashborder secondbg rounded-l-xl">
                    <SidebarContent />
                </div>

                {/* Mobile Sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="absolute inset-0 bg-black opacity-50"
                             onClick={() => setIsSidebarOpen(false)}
                        />
                        <div className="relative w-64 bg-white h-full p-4 pt-0 pl-1 dashbg ">
                            <button onClick={() => setIsSidebarOpen(false)} className="mb-4">
                                <X className="h-6 w-6 dark:text-white absolute right-2" />
                            </button>
                            <SidebarContent />
                        </div>
                    </div>
                )}

                {/* Main Chat Content */}
                <div className="flex-1 flex flex-col">

                    {/* Header */}
                    <div className="fixed w-full z-10">
                        <div className="md:hidden w-full border-b dark:text-white border-[#2a3142] secondbg px-4 py-2 flex items-center">
                            <button className="mr-2" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="h-4 w-4" />
                            </button>
                        </div>

                        <ChatHeader
                            channel={selectedChannel}
                            onVideoCall={() => {}}
                            onScheduleCall={() => {}}
                            onAudioCall={() => {}}
                        />
                    </div>

                    {/* Chat Interface */}
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
