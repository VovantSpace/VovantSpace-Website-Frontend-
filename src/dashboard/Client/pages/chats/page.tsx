import {useEffect, useState} from "react"
import {Search, Star, Menu, X} from "lucide-react"
import {cn} from "@/dashboard/Innovator/lib/utils"

import {Input} from "@/dashboard/Innovator/components/ui/input"
import {Separator} from "@/dashboard/Innovator/components/ui/separator"
import {MainLayout} from "@/dashboard/Client/components/layout/main-layout";
import {ChatInterface} from "@/dashboard/Innovator/components/chat/chat-interface"
import {ChatHeader} from "@/dashboard/Innovator/components/chat/chat-header"
import type {Channel, User} from "@/dashboard/Innovator/types"
import {getSocket} from '@/lib/socket'
import axios from "axios";


export default function ChatsPage() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)


    // load current user
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get('/api/user/profile', {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            setCurrentUser(res.data.data)
        }

        fetchUser()
    }, [])

    // Fetch Advisor's active/upcoming chat rooms
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axios.get('/session-chats/my', {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
                })

                if (res.data?.success) {
                    setChannels(res.data.data)
                    if (res.data.data.length > 0) {
                        setSelectedChannel(res.data.data[0])
                    }
                }
            } catch (error) {
                console.error('Failed to load advisor chats:', error)
            }
        }
        fetchChats()
    }, [])

    // Function to handle sending a message
    const handleSendMessage = async (content: string, fileUrl?: string, fileType?: string) => {
        if (!selectedChannel) return;

        try {
            const res = await axios.post(
                "/api/session-chat/send",
                {
                    channelId: selectedChannel.id,
                    content,
                    fileUrl,
                    fileType,
                },
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                }
            );

            if (res.data.success) {
                // message will arrive via socket, so no need to insert manually
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };


    // Sidebar content as a variable for reuse on mobile and desktop
    const SidebarContent = () => (
        <>
            <div className="fixed ">
                <div className="p-4">
                    <div className="relative w-[206px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext"/>
                        <Input placeholder="Search Session"
                               className="secondbg pl-9 border dashborder dashtext focus:outline-none text-sm"/>
                    </div>
                </div>


                <Separator className="my-2 secondbg"/>

                <div className="px-4 py-2">
                    <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Sessions</h2>
                    {channels.map((channel) => (
                        <button
                            key={channel.id}
                            className={cn(
                                "mb-1 flex w-full items-center justify-between  rounded-lg px-2 py-1.5 text-sm",
                                selectedChannel?.id === channel.id
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
                                <span
                                    className="rounded-full bg-red-500 text-white px-1.5 py-0.5 text-xs">{channel.unreadCount}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )

    // update unread count
    useEffect(() => {
        const socket = getSocket()

        socket.on("chat:unread-update", ({ channelId, unreadCount }) => {
            setChannels(prev =>
                prev.map(ch =>
                    ch.id === channelId ? { ...ch, unreadCount } : ch
                )
            )
        })

        return () => {
            socket.off("chat:unread-update")
        }
    }, [])

// auto open room when activated
    useEffect(() => {
        const socket = getSocket()

        socket.on("chat:activated", ({ room }) => {
            setSelectedChannel(prev => {
                const match = channels.find(ch => ch.id === room._id.toString())
                return match || prev
            })
        })

        return () => {
            socket.off("chat:activated")
        }
    }, [channels])


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
                        <div className="relative w-64 bg-white h-full p-4 pt-0 pl-1 dashbg ">
                            <button onClick={() => setIsSidebarOpen(false)} className="mb-4">
                                <X className="h-6 w-6 dark:text-white absolute right-2 "/>
                            </button>
                            <SidebarContent/>
                        </div>
                    </div>
                )}

                {/* Main Chat Content */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="fixed w-full z-10">
                        <div
                            className="md:hidden w-full border-b dark:text-white border-[#2a3142] secondbg px-4 py-2 flex items-center">
                            <button className="mr-2" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="h-4 w-4"/>
                            </button>
                        </div>
                        <ChatHeader
                            channel={selectedChannel}
                            onVideoCall={() => {
                            }}
                            onScheduleCall={() => {
                            }}
                            onAudioCall={() => {
                            }} // Implement audio call functionality
                        />
                    </div>
                    {/* Chat Interface */}
                    <div className="mt-24 md:mt-10">
                        {selectedChannel && currentUser && (
                            <ChatInterface
                                channelId={selectedChannel.id}
                                currentUser={currentUser}
                                onSendMessage={handleSendMessage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}