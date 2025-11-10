import {useState, useEffect} from "react"
import {Search, Menu, X} from "lucide-react"
import {cn} from "@/dashboard/Innovator/lib/utils"
import axios from "axios"

import {Input} from "@/dashboard/Innovator/components/ui/input"
import {Separator} from "@/dashboard/Innovator/components/ui/separator"
import {MainLayout} from "../../components/layout/main-layout"
import {ChatInterface} from "@/dashboard/Innovator/components/chat/chat-interface"
import {ChatHeader} from "@/dashboard/Innovator/components/chat/chat-header"
import {currentUser} from "@/dashboard/Innovator/data/user"
import type {Channel, ChatMessage} from "@/dashboard/Innovator/types"
import {getSocket} from "@/lib/socket"
import {mapToChatUser} from "@/lib/mapToChatUser"

export default function ChatsPage() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])

    useEffect(() => {
        async function fetchChannels() {
            try {
                const res = await axios.get("/api/problem-solver/chats", {withCredentials: true})
                if (res.data.success) {
                    setChannels(res.data.data)
                    setSelectedChannel(res.data.data[0] || null)
                }
            } catch (err) {
                console.error("Error fetching problem solver chats:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchChannels()
    }, [])

    useEffect(() => {
        if (!selectedChannel) return

        async function fetchMessages() {
            try {
                const res = await axios.get(`/api/chat/${selectedChannel?.id}`, {withCredentials: true})
                if (res.data.success) setMessages(res.data.data)
            } catch (err) {
                console.error("Error fetching chat messages:", err)
            }
        }

        fetchMessages()
    }, [selectedChannel])

    useEffect(() => {
        if (!selectedChannel) return
        const socket = getSocket()
        socket.emit("chat:join-room", selectedChannel.id)
        socket.on("chat:new-message", (msg) => {
            const mapped = {...msg, user: msg.user ? mapToChatUser(msg.user) : undefined}
            setMessages((prev) => [...prev, mapped])
        })
        return () => {
            socket.emit("chat:leave-room", selectedChannel.id)
            socket.off("chat:new-message")
        }
    }, [selectedChannel])

    const handleSendMessage = async (content: string, fileUrl?: string, fileType?: string) => {
        if (!selectedChannel) return
        try {
            const res = await axios.post(
                "/api/chat/send",
                {channelId: selectedChannel.id, content, fileUrl, fileType},
                {withCredentials: true}
            )
            if (res.data?.success) {
                const newMessage = res.data.data
                setMessages((prev) => [...prev, newMessage])
                const socket = getSocket()
                socket.emit("chat:new-message", newMessage)
            }
        } catch (err) {
            console.error("Error sending message:", err)
        }
    }

    const handleMessageAction = (action: string, messageId: string, data?: any) => {
        if (action === "star") {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? {...msg, isStarred: !msg.isStarred} : msg
                )
            )
        }
    }

    const SidebarContent = () => (
        <div className="fixed">
            <div className="p-4">
                <div className="relative w-[206px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext"/>
                    <Input
                        placeholder="Search Challenge"
                        className="secondbg pl-9 border dashborder dashtext focus:outline-none text-sm"
                    />
                </div>
            </div>

            <Separator className="my-2 secondbg"/>

            <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Challenges</h2>
                {channels.length > 0 ? (
                    channels.map((channel) => (
                        <button
                            key={channel.id}
                            className={cn(
                                "mb-1 flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-sm",
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
                    ))
                ) : (
                    <p>No active challenges</p>
                )}
            </div>
        </div>
    )

    return (
        <MainLayout>
            <div className="flex min-h-[93vh] md:min-h-[93vh] dashbg rounded-xl">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-[245px] pr-3 border-r dashborder secondbg rounded-l-xl">
                    <SidebarContent/>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsSidebarOpen(false)}/>
                        <div className="relative w-64 bg-white h-full p-4 pt-0 pl-1 dashbg">
                            <button onClick={() => setIsSidebarOpen(false)} className="mb-4">
                                <X className="h-6 w-6 dark:text-white absolute right-2"/>
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

                    <div className="mt-24 md:mt-10 flex-1">
                        {selectedChannel ? (
                            <ChatInterface
                                channelId={selectedChannel.id}
                                currentUser={currentUser}
                            />
                        ) : loading ? (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                Loading chats...
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                No active chats found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
