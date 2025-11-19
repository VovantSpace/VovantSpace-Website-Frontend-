import {useState, useEffect} from "react";
import {Search, Menu, X, Loader2} from "lucide-react";
import {cn} from "@/dashboard/Innovator/lib/utils";
import axios from "axios";
import {getSocket} from "@/lib/socket";

import {Input} from "@/dashboard/Innovator/components/ui/input";
import {Separator} from "@/dashboard/Innovator/components/ui/separator";
import {MainLayout} from "@/dashboard/Advisor/components/layout/main-layout";
import {ChatInterface} from "@/dashboard/Innovator/components/chat/chat-interface";
import {ChatHeader} from "@/dashboard/Innovator/components/chat/chat-header";

import type {Channel, ChatMessage, User} from "@/dashboard/Innovator/types";

export default function ChatsPage() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [loadingChannels, setLoadingChannels] = useState(true);

    const handleVideoCall = () => {
    }
    const handleAudioCall = () => {
    }
    const handleScheduleCall = () => {
    }

    // ---------------------------------------------
    // 1️⃣ FETCH LOGGED IN ADVISOR
    // ---------------------------------------------
    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await axios.get("/api/user/profile", {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                });

                if (res.data.success) {
                    const u = res.data.user;

                    setCurrentUser({
                        id: u._id,
                        name: `${u.firstName} ${u.lastName}`,
                        email: u.email,
                        avatar: u.profilePicture,
                        role: u.role,
                        timeZone: u.timeZone || "UTC",
                        phone: u.phone,
                        bio: u.bio,
                        skills: u.skills || []
                    });
                }
            } catch (err) {
                console.error("Failed to load advisor:", err);
            }
        };

        loadUser();
    }, []);

    // ---------------------------------------------
    // 2️⃣ FETCH ADVISOR SESSION CHAT ROOMS
    // ---------------------------------------------
    useEffect(() => {
        const loadChannels = async () => {
            try {
                const res = await axios.get("/api/session-chat/advisor", {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                });

                if (res.data.success) {
                    setChannels(res.data.data);
                    setSelectedChannel(res.data.data[0] || null);
                }
            } catch (err) {
                console.error("Error fetching session chat rooms:", err);
            } finally {
                setLoadingChannels(false);
            }
        };

        loadChannels();
    }, []);

    // ---------------------------------------------
    // 3️⃣ FETCH MESSAGES WHEN CHANNEL CHANGES
    // ---------------------------------------------
    useEffect(() => {
        if (!selectedChannel) return;

        const loadMessages = async () => {
            try {
                const res = await axios.get(`/api/session-chat/messages/${selectedChannel.id}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                });

                if (res.data.success) {
                    setMessages(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        loadMessages();
    }, [selectedChannel]);

    // ---------------------------------------------
    // 4️⃣ SOCKET: REAL-TIME NEW MESSAGES + ROOM UPDATES
    // ---------------------------------------------
    useEffect(() => {
        if (!selectedChannel) return;

        const socket = getSocket();
        socket.emit("session-chat:join", selectedChannel.id);

        socket.on("session-chat:new-message", (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("session-chat:activated", ({room}) => {
            setChannels((prev) =>
                prev.map((c) => (c.id === room._id ? {...c, status: "active"} : c))
            );
        });

        socket.on("session-chat:closed", ({room}) => {
            setChannels((prev) =>
                prev.map((c) => (c.id === room._id ? {...c, status: "closed"} : c))
            );
        });

        return () => {
            socket.emit("session-chat:leave", selectedChannel.id);
            socket.off("session-chat:new-message");
            socket.off("session-chat:activated");
            socket.off("session-chat:closed");
        };
    }, [selectedChannel]);

    // ---------------------------------------------
    // 5️⃣ SEND MESSAGE HANDLER → passed to ChatInterface
    // ---------------------------------------------
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

    // ---------------------------------------------
    // Sidebar Template
    // ---------------------------------------------
    const SidebarContent = () => (
        <div className="fixed">
            <div className="p-4">
                <div className="relative w-[206px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext"/>
                    <Input
                        placeholder="Search Session"
                        className="secondbg pl-9 border dashborder dashtext focus:outline-none text-sm"
                    />
                </div>
            </div>

            <Separator className="my-2 secondbg"/>

            <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">Sessions</h2>

                {channels.length === 0 ? (
                    <p className="text-sm text-gray-400">No active session chats</p>
                ) : (
                    channels.map((channel) => (
                        <button
                            key={channel.id}
                            className={cn(
                                "mb-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm",
                                selectedChannel?.id === channel.id
                                    ? "dashbutton text-white"
                                    : "text-black dark:text-white hover:secondbg hover:dashtext"
                            )}
                            onClick={() => {
                                setSelectedChannel(channel);
                                setIsSidebarOpen(false);
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
                )}
            </div>
        </div>
    );

    if (!currentUser || loadingChannels) {
        return (
            <MainLayout>
                <div className="h-screen flex items-center justify-center text-gray-400">
                    <Loader2 className="animate-spin h-6 w-6 mr-2"/>
                    Loading chat...
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex min-h-[93vh] dashbg rounded-xl">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-[245px] pr-3 border-r dashborder secondbg rounded-l-xl">
                    <SidebarContent/>
                </div>

                {/* Mobile Sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <div className="relative w-64 bg-white h-full p-4 dashbg">
                            <button className="mb-4" onClick={() => setIsSidebarOpen(false)}>
                                <X className="h-6 w-6 absolute right-2 dark:text-white"/>
                            </button>
                            <SidebarContent/>
                        </div>
                    </div>
                )}

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="fixed w-full z-10">
                        <div className="md:hidden border-b border-[#2a3142] secondbg px-4 py-2 flex items-center">
                            <button onClick={() => setIsSidebarOpen(true)} className="mr-2">
                                <Menu className="h-4 w-4"/>
                            </button>
                        </div>

                        {selectedChannel && (
                            <ChatHeader channel={selectedChannel} onVideoCall={handleVideoCall}
                                        onAudioCall={handleAudioCall} onScheduleCall={handleScheduleCall}/>
                        )}
                    </div>

                    {/* Chat Interface */}
                    <div className="mt-24 md:mt-10 flex-1">
                        {selectedChannel ? (
                            <ChatInterface
                                channelId={selectedChannel.id}
                                currentUser={currentUser}
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
    );
}