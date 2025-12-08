import {useState, useEffect} from "react";
import {Search, Loader2} from "lucide-react";
import {cn} from "@/dashboard/Innovator/lib/utils";
import axios from "axios";
import {getSocket} from "@/lib/socket";

import {Input} from "@/dashboard/Innovator/components/ui/input";
import {Separator} from "@/dashboard/Innovator/components/ui/separator";
import {MainLayout} from "@/dashboard/Advisor/components/layout/main-layout";
import {ChatInterface} from "@/dashboard/Innovator/components/chat/chat-interface";
import {ChatHeader} from "@/dashboard/Innovator/components/chat/chat-header";

import type {Channel, ChatMessage, User} from "@/dashboard/Innovator/components/chat/types";

export default function ChatsPage() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loadingChannels, setLoadingChannels] = useState(true);

    // Load advisor user
    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await axios.get("/api/user/profile", {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                });

                const u = res.data?.user || res.data?.data;
                if (!u) return;

                setCurrentUser({
                    id: u._id,
                    name: `${u.firstName} ${u.lastName}`.trim(),
                    email: u.email,
                    avatar: u.profilePicture,
                    role: u.role,
                    timeZone: u.timeZone || "UTC",
                    phone: u.phone,
                    bio: u.bio,
                    skills: u.skills || []
                });
            } catch (err) {
                console.error("Failed to load mentor:", err);
            }
        };

        loadUser();
    }, []);

    // Subscribe to mentor socket room
    useEffect(() => {
        if (!currentUser) return;

        const socket = getSocket();
        const room = `mentor_${currentUser.id}`;

        const handleConnect = () => {
            console.log("Socket connected, joining mentor room:", room)
            socket.emit("join_mentor_room", currentUser.id)
        }

        // Join when socket connects
        socket.on("connect", handleConnect);

        // Join immediately if already connected
        if (socket.connected) handleConnect()

        return () => {
            socket.off("connect", handleConnect)
            console.log("Leaving mentor room:", room)
            socket.emit("leave-room", room);
        };
    }, [currentUser]);

    // Load session chat rooms
    useEffect(() => {
        const loadChats = async () => {
            try {
                const res = await axios.get("/api/chat/session-chats/my", {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                });

                if (res.data.success) {
                    const normalized = res.data.data.map((ch: Channel) => ({
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
                    }));

                    setChannels(normalized);

                    if (normalized.length > 0) {
                        setSelectedChannel(normalized[0]);
                    }
                }
            } catch (err) {
                console.error("Error fetching advisor session chats:", err);
            } finally {
                setLoadingChannels(false);
            }
        };

        loadChats();
    }, []);

    // updates the channel message count
    useEffect(() => {
        if (!selectedChannel) return;

        const loadMessages = async () => {
            try {
                const res = await axios.patch(
                    `/api/chat/${selectedChannel.id}/read`,
                    {},
                    {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
                )

                setChannels(prev =>
                    prev.map(c =>
                        c.id === selectedChannel.id ? {...c, unreadCount: 0} : c
                    )
                )
            } catch (err: any) {
                console.error("error fetching messages:", err)
            }
        }
        loadMessages();
    }, [selectedChannel]);

    // Load messages when channel changes
    useEffect(() => {
        if (!selectedChannel) return;

        const loadMessages = async () => {
            try {
                const res = await axios.get(`/api/chat/${selectedChannel.id}/messages`, {
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

    // Socket listeners
    useEffect(() => {
        const socket = getSocket();

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
            };

            setChannels((prev) => {
                const exists = prev.some((c) => c.id === normalized.id);
                if (!exists) return [...prev, normalized];
                return prev;
            });

            if (!selectedChannel) {
                setSelectedChannel(normalized);
            }
        });

        socket.on("chat:new-message", (msg: ChatMessage) => {
            if (msg.channelId === selectedChannel?.id) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        socket.on("chat:unread-update", ({channelId, unreadCount}) => {
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === channelId ? {...c, unreadCount} : c
                )
            );
        });

        socket.on("chat:messages-read", ({channelId}) => {
            setChannels(prev =>
                prev.map(c =>
                    c.id === channelId ? {...c, unreadCount: 0} : c
                )
            )
        })

        socket.on("session-chat:activated", ({room}) => {
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === room._id.toString()
                        ? {...c, status: "active", nextActiveDate: null}
                        : c
                )
            );
        });

        socket.on("session-chat:closed", ({room}) => {
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === room._id.toString()
                        ? {...c, status: "closed", closedAt: room.closedAt}
                        : c
                )
            );
        });

        return () => {
            socket.off("session-chat:created");
            socket.off("chat:new-message");
            socket.off("chat:unread-update");
            socket.off("session-chat:activated");
            socket.off("session-chat:closed");
            socket.off("chat:messages-read")
        };
    }, [selectedChannel]);

    // Send message
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
                {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
            );
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    // Helper function to shorten the chat title
    const shortenTitle = (title: string, limit = 25) => {
        if (!title) return "untitled"
        return title.length > limit ? title.substring(0, limit) + "..." : title;
    }

    // Sidebar component
    const SidebarContent = () => (
        <div className="fixed">
            <div className="p-4">
                <div className="relative w-[206px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext"/>
                    <Input
                        placeholder="Search Session"
                        className="secondbg pl-9 border dashborder text-sm dashtext"
                    />
                </div>
            </div>

            <Separator className="my-2 secondbg"/>

            <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                    Sessions
                </h2>

                {channels.length === 0 ? (
                    <p className="text-sm text-gray-400">No active sessions</p>
                ) : (
                    channels.map((channel) => (
                        <button
                            key={channel.id}
                            className={cn(
                                "mb-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm cursor-pointer",
                                selectedChannel?.id === channel.id
                                    ? "dashbutton text-white"
                                    : "text-black dark:text-white hover:secondbg hover:dashtext"
                            )}
                            onClick={() => setSelectedChannel(channel)}
                        >
                            <span>{shortenTitle(channel.name)}</span>
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
                <div className="h-screen flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 mr-2"/>
                    Loading chats...
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex min-h-[93vh] dashbg rounded-xl">
                {/* Sidebar */}
                <div className="hidden md:block w-[245px] pr-3 border-r dashborder secondbg rounded-l-xl">
                    <SidebarContent/>
                </div>

                {/* Main */}
                <div className="flex-1 flex flex-col">
                    <div className="fixed w-full z-10 md:relative">
                        <ChatHeader
                            channel={selectedChannel}
                            onVideoCall={() => {
                            }}
                            onAudioCall={() => {
                            }}
                            onScheduleCall={() => {
                            }}
                        />
                    </div>

                    <div className="mt-24 md:mt-10 flex-1">
                        {selectedChannel ? (
                            <ChatInterface
                                currentUser={currentUser}
                                channelId={selectedChannel.id}
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
    );
}
