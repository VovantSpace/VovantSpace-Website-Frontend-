import { useState, useEffect, useCallback } from "react";
import { Search, Menu, X, Loader2 } from "lucide-react";
import { cn } from "@/dashboard/Innovator/lib/utils";
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";

import { Input } from "@/dashboard/Innovator/components/ui/input";
import { Separator } from "@/dashboard/Innovator/components/ui/separator";
import { MainLayout } from "../../components/layout/main-layout";
import { ChatInterface } from "@/dashboard/Innovator/components/chat/chat-interface";
import { ChatHeader } from "@/dashboard/Innovator/components/chat/chat-header";
import type { Channel, ChatMessage } from "@/dashboard/Innovator/components/chat/types";
import { getSocket } from "@/lib/socket";
import type { User } from "@/dashboard/Innovator/types";

export default function ChatsPage() {
    const navigate = useNavigate();
    const socket = getSocket();

    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatUser, setChatUser] = useState<User | null>(null);
    const [isSending, setIsSending] = useState(false);

    const normalizeChannel = useCallback((channel: any): Channel => ({
        id: channel.id || channel._id,
        name: channel.name || "Untitled challenge",
        description: channel.description ?? "",
        unreadCount: channel.unreadCount ?? 0,
        mentorId: channel.mentorId ?? "",
        menteeId: channel.menteeId ?? "",
        sessionRequestId: channel.sessionRequestId ?? "",
        chatType: channel.chatType ?? "challenge",
        status: channel.status ?? undefined,
        nextActiveDate: channel.nextActiveDate ?? null,
        closedAt: channel.closedAt ?? null,
    }), []);

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
        isStarred: msg.isStarred ?? false,
    }), []);

    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const res = await api.get("/user/profile");
                const user = res.data?.user || res.data?.data;

                if (!user) {
                    navigate("/login");
                    return;
                }

                setChatUser({
                    ...user,
                    id: user._id,
                    name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                    avatar: user.profilePicture,
                });
            } catch (err: any) {
                console.error("Error fetching current user:", err);

                if (
                    err.response?.status === 401 ||
                    err.response?.data?.message?.toLowerCase?.().includes("token")
                ) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            }
        }

        fetchCurrentUser();
    }, [navigate]);

    useEffect(() => {
        async function fetchChannels() {
            try {
                const res = await api.get("/problem-solver/chats");

                if (res.data?.success) {
                    const normalizedChannels = (res.data.data || []).map((channel: any) =>
                        normalizeChannel(channel)
                    );

                    setChannels(normalizedChannels);
                    setSelectedChannel((prev) => prev ?? normalizedChannels[0] ?? null);
                }
            } catch (err) {
                console.error("Error fetching problem solver chats:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchChannels();
    }, [normalizeChannel]);

    useEffect(() => {
        async function fetchMessages() {
            if (!selectedChannel?.id) return;

            try {
                const res = await api.get(`/chat/${selectedChannel.id}/messages`);

                if (res.data?.success) {
                    const normalizedMessages = (res.data.data || []).map((msg: any) =>
                        normalizeMessage(msg)
                    );
                    setMessages(normalizedMessages);
                }
            } catch (err) {
                console.error("Error fetching chat messages:", err);
            }
        }

        fetchMessages();
    }, [selectedChannel, normalizeMessage]);

    useEffect(() => {
        if (!selectedChannel?.id) return;

        const markMessageAsRead = async () => {
            try {
                await api.patch(`/chat/${selectedChannel.id}/read`);

                setChannels((prev) =>
                    prev.map((ch) =>
                        ch.id === selectedChannel.id ? { ...ch, unreadCount: 0 } : ch
                    )
                );
            } catch (err) {
                console.error("Error marking messages as read:", err);
            }
        };

        markMessageAsRead();
    }, [selectedChannel]);

    useEffect(() => {
        const handleRoomCreated = (rawRoom: any) => {
            const channel = normalizeChannel(rawRoom);

            setChannels((prev) => {
                const exists = prev.some((ch) => ch.id === channel.id);
                return exists ? prev : [channel, ...prev];
            });

            setSelectedChannel((prev) => prev ?? channel);
        };

        socket.on("chat:room-created", handleRoomCreated);

        return () => {
            socket.off("chat:room-created", handleRoomCreated);
        };
    }, [socket, normalizeChannel]);

    useEffect(() => {
        if (!selectedChannel?.id) return;

        const joinRoom = () => {
            socket.emit("chat:join-room", selectedChannel.id);
        };

        socket.on("connect", joinRoom);

        if (socket.connected) {
            joinRoom();
        }

        return () => {
            socket.off("connect", joinRoom);
            socket.emit("chat:leave-room", selectedChannel.id);
        };
    }, [selectedChannel, socket]);

    useEffect(() => {
        const handleRoomCreated = async () => {
            try {
                const res = await api.get("/problem-solver/chats");
                if (res.data?.success) {
                    const normalizedChannels = (res.data.data || []).map((channel: any) =>
                        normalizeChannel(channel)
                    );
                    setChannels(normalizedChannels);
                    setSelectedChannel((prev) => prev ?? normalizedChannels[0] ?? null);
                }
            } catch (err) {
                console.error("Error refreshing chats after room creation:", err);
            }
        };

        socket.on("chat:room-created", handleRoomCreated);

        return () => {
            socket.off("chat:room-created", handleRoomCreated);
        };
    }, [socket, normalizeChannel]);

    useEffect(() => {
        const handleNewMessage = (rawMsg: any) => {
            const msg = normalizeMessage(rawMsg);

            setMessages((prev) => {
                const alreadyExists = prev.some(
                    (m) =>
                        m.id === msg.id ||
                        (m.pending &&
                            m.senderId === msg.senderId &&
                            m.channelId === msg.channelId &&
                            m.content === msg.content)
                );

                if (alreadyExists) {
                    return prev.map((m) =>
                        m.pending &&
                        m.senderId === msg.senderId &&
                        m.channelId === msg.channelId &&
                        m.content === msg.content
                            ? msg
                            : m
                    );
                }

                return msg.channelId === selectedChannel?.id ? [...prev, msg] : prev;
            });
        };

        const handleMessagesRead = ({ channelId }: { channelId: string }) => {
            setChannels((prev) =>
                prev.map((ch) =>
                    ch.id === channelId ? { ...ch, unreadCount: 0 } : ch
                )
            );
        };

        const handleUnreadUpdate = ({
                                        channelId,
                                        unreadCount,
                                    }: {
            channelId: string;
            unreadCount: number;
        }) => {
            setChannels((prev) =>
                prev.map((ch) =>
                    ch.id === channelId ? { ...ch, unreadCount } : ch
                )
            );
        };

        socket.on("chat:new-message", handleNewMessage);
        socket.on("chat:messages-read", handleMessagesRead);
        socket.on("chat:unread-update", handleUnreadUpdate);

        return () => {
            socket.off("chat:new-message", handleNewMessage);
            socket.off("chat:messages-read", handleMessagesRead);
            socket.off("chat:unread-update", handleUnreadUpdate);
        };
    }, [socket, selectedChannel, normalizeMessage]);

    const handleSendMessage = async (content: string, file?: File) => {
        if (!selectedChannel || !chatUser || isSending) return;

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
            senderId: chatUser.id,
            senderName: chatUser.name,
            senderAvatar: (chatUser as any).avatar || (chatUser as any).profilePicture,
            content: file
                ? `Sending ${inferredFileType || "file"}: ${file.name}`
                : trimmedContent,
            fileUrl: file ? URL.createObjectURL(file) : undefined,
            fileType: inferredFileType,
            createdAt: new Date().toISOString(),
            pending: true,
            isStarred: false,
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
                    prev.map((m) => (m.id === tempMessage.id ? saved! : m))
                );
            } else {
                setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
            }
        } catch (err) {
            setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
            console.error("Error sending message:", err);
        } finally {
            if (file && tempMessage.fileUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(tempMessage.fileUrl);
            }
            setIsSending(false);
        }
    };

    const handleMessageAction = (action: string, messageId: string) => {
        if (action === "star") {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
                )
            );
        }
    };

    const SidebarContent = () => (
        <div>
            <div className="p-4">
                <div className="relative w-[206px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext" />
                    <Input
                        placeholder="Search Challenge"
                        className="secondbg pl-9 border dashborder dashtext focus:outline-none text-sm"
                    />
                </div>
            </div>

            <Separator className="my-2 secondbg" />

            <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                    Challenges
                </h2>

                {channels.length > 0 ? (
                    channels.map((channel) => (
                        <button
                            key={channel.id}
                            className={cn(
                                "mb-1 flex w-full items-center justify-between overflow-hidden rounded-lg px-2 py-2.5 text-sm",
                                selectedChannel?.id === channel.id
                                    ? "dashbutton text-white"
                                    : "text-black dark:text-white hover:secondbg hover:dashtext"
                            )}
                            onClick={() => {
                                setSelectedChannel(channel);
                                setIsSidebarOpen(false);
                            }}
                        >
                            <span className="flex-1 truncate text-left">{channel.name}</span>
                            {channel.unreadCount > 0 && (
                                <span className="rounded-full bg-red-500 text-white px-1.5 py-0.5 text-xs">
                                    {channel.unreadCount}
                                </span>
                            )}
                        </button>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No active challenges</p>
                )}
            </div>
        </div>
    );

    if (!chatUser && !loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="animate-spin h-6 w-6 mb-2" />
                <p className="text-sm">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="flex min-h-[93vh] md:min-h-[93vh] dashbg rounded-xl">
                <div className="hidden md:block w-[245px] pr-3 border-r dashborder secondbg rounded-l-xl">
                    <SidebarContent />
                </div>

                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <div className="relative w-64 bg-white h-full p-4 pt-0 pl-1 dashbg">
                            <button onClick={() => setIsSidebarOpen(false)} className="mb-4">
                                <X className="h-6 w-6 dark:text-white absolute right-2" />
                            </button>
                            <SidebarContent />
                        </div>
                    </div>
                )}

                <div className="flex-1 flex flex-col">
                    <div className="fixed w-full z-10">
                        <div className="md:hidden w-full border-b dark:text-white border-[#2a3142] secondbg px-4 py-2 flex items-center">
                            <button className="mr-2" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="h-4 w-4" />
                            </button>
                        </div>

                        {selectedChannel && (
                            <ChatHeader
                                channel={selectedChannel}
                                onVideoCall={() => setIsVideoCallOpen(true)}
                                onScheduleCall={() => setIsVideoCallOpen(true)}
                                onAudioCall={() => {}}
                            />
                        )}
                    </div>

                    <div className="mt-24 md:mt-10 flex-1">
                        {!chatUser ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="animate-spin h-6 w-6 mb-2" />
                                <p className="text-sm">Loading user...</p>
                            </div>
                        ) : loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="animate-spin h-6 w-6 mb-2" />
                                <p className="text-sm">Loading chats...</p>
                            </div>
                        ) : selectedChannel ? (
                            <ChatInterface
                                channelId={selectedChannel.id}
                                currentUser={chatUser as any}
                                messages={messages}
                                isSending={isSending}
                                onSendMessage={handleSendMessage}
                                chatType={selectedChannel.chatType}
                                status={selectedChannel.status}
                                nextActiveDate={selectedChannel.nextActiveDate}
                                closedAt={selectedChannel.closedAt}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                No active chats found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}