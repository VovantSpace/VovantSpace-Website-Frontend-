import { useState, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/dashboard/Innovator/lib/utils";
import api from "@/utils/api";
import { getSocket } from "@/lib/socket";

import { Input } from "@/dashboard/Innovator/components/ui/input";
import { Separator } from "@/dashboard/Innovator/components/ui/separator";
import { MainLayout } from "@/dashboard/Advisor/components/layout/main-layout";
import { ChatInterface } from "@/dashboard/Innovator/components/chat/chat-interface";
import { ChatHeader } from "@/dashboard/Innovator/components/chat/chat-header";

import type { ChatMessage, User, Channel } from "@/dashboard/Innovator/components/chat/types";

export default function ChatsPage() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loadingChannels, setLoadingChannels] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const socket = getSocket();

    const normalizeChannel = (ch: any): Channel => ({
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
    });

    const normalizeMessage = useCallback((msg: any): ChatMessage => {
        return {
            id: msg.id || msg._id,
            channelId: msg.channelId,
            senderId: msg.senderId || msg.userId || msg.user?.id || msg.user?._id || "",
            senderName:
                msg.senderName ||
                msg.user?.name ||
                `${msg.user?.firstName || ""} ${msg.user?.lastName || ""}`.trim() ||
                "Unknown User",
            senderAvatar:
                msg.senderAvatar ||
                msg.user?.avatar ||
                msg.user?.profilePicture ||
                "",
            content: msg.content,
            fileUrl: msg.fileUrl,
            fileType: msg.fileType,
            createdAt: msg.createdAt || msg.timestamp || msg.updatedAt || new Date().toISOString(),
            pending: msg.pending ?? msg.status === "pending",
        };
    }, []);

    /* ---------------- USER ---------------- */

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await api.get("/user/profile");
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
                    skills: u.skills || [],
                });
            } catch (err) {
                console.error("Failed to load mentor:", err);
            }
        };

        loadUser();
    }, []);

    /* ---------------- JOIN MENTOR ROOM ---------------- */

    useEffect(() => {
        if (!currentUser) return;

        const room = `mentor_${currentUser.id}`;

        const handleConnect = () => {
            socket.emit("join_mentor_room", currentUser.id);
        };

        socket.on("connect", handleConnect);

        if (socket.connected) handleConnect();

        return () => {
            socket.off("connect", handleConnect);
            socket.emit("leave-room", room);
        };
    }, [currentUser, socket]);

    /* ---------------- LOAD CHAT CHANNELS ---------------- */

    useEffect(() => {
        const loadChats = async () => {
            try {
                const res = await api.get("/chat/session-chats/my");

                if (res.data?.success) {
                    const normalized = (res.data.data || []).map((ch: any) => normalizeChannel(ch));

                    setChannels(normalized);

                    if (normalized.length > 0) {
                        setSelectedChannel((prev) => prev ?? normalized[0]);
                    }
                }
            } catch (err) {
                console.error("Error fetching chats:", err);
            } finally {
                setLoadingChannels(false);
            }
        };

        loadChats();
    }, []);

    /* ---------------- JOIN CHANNEL ROOM ---------------- */

    useEffect(() => {
        if (!selectedChannel?.id) return;

        socket.emit("join-channel", selectedChannel.id);

        return () => {
            socket.emit("leave-channel", selectedChannel.id);
        };
    }, [selectedChannel, socket]);

    /* ---------------- LOAD MESSAGES ---------------- */

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChannel?.id) return;

            try {
                const res = await api.get(`/chat/${selectedChannel.id}/messages`);

                if (res.data?.success) {
                    const normalizedMessages: ChatMessage[] = (res.data.data || []).map((msg: any) =>
                        normalizeMessage(msg)
                    );

                    setMessages(normalizedMessages);
                }
            } catch (err) {
                console.error("Failed to load messages:", err);
            }
        };

        fetchMessages();
    }, [selectedChannel, normalizeMessage]);

    /* ---------------- MARK READ ---------------- */

    useEffect(() => {
        if (!selectedChannel?.id) return;

        const markRead = async () => {
            try {
                await api.patch(`/chat/${selectedChannel.id}/read`);

                setChannels((prev) =>
                    prev.map((c) =>
                        c.id === selectedChannel.id ? { ...c, unreadCount: 0 } : c
                    )
                );
            } catch (err) {
                console.error("Failed to mark channel read:", err);
            }
        };

        markRead();
    }, [selectedChannel]);

    /* ---------------- SOCKET LISTENERS ---------------- */

    useEffect(() => {
        const handleNewMessage = (rawMsg: any) => {
            const msg = normalizeMessage(rawMsg);

            setMessages((prev) => {
                const alreadyExists = prev.some(
                    (m) =>
                        m.id === msg.id ||
                        (
                            m.pending &&
                            m.senderId === msg.senderId &&
                            m.channelId === msg.channelId &&
                            m.content === msg.content
                        )
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

                return [...prev, msg];
            });
        };

        const handleUnread = ({ channelId, unreadCount }: { channelId: string; unreadCount: number }) => {
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === channelId ? { ...c, unreadCount } : c
                )
            );
        };

        socket.on("chat:new-message", handleNewMessage);
        socket.on("chat:unread-update", handleUnread);

        return () => {
            socket.off("chat:new-message", handleNewMessage);
            socket.off("chat:unread-update", handleUnread);
        };
    }, [socket, normalizeMessage]);

    /* ---------------- SOCKET RECONNECT SYNC ---------------- */

    useEffect(() => {
        const syncMessages = async () => {
            if (!selectedChannel?.id) return;

            try {
                const res = await api.get(`/chat/${selectedChannel.id}/messages`);

                if (res.data?.success) {
                    const normalizedMessages: ChatMessage[] = (res.data.data || []).map((msg: any) =>
                        normalizeMessage(msg)
                    );

                    setMessages(normalizedMessages);
                }
            } catch (err) {
                console.error("Message sync failed", err);
            }
        };

        socket.on("connect", syncMessages);

        return () => {
            socket.off("connect", syncMessages);
        };
    }, [selectedChannel, socket, normalizeMessage]);

    /* ---------------- SEND MESSAGE ---------------- */

    const handleSendMessage = async (content: string, fileUrl?: string, fileType?: string) => {
        if (!selectedChannel || !currentUser || isSending) return;

        const trimmedContent = content.trim();
        if (!trimmedContent && !fileUrl) return;

        setIsSending(true);

        const tempMessage: ChatMessage = {
            id: `temp-${Date.now()}`,
            channelId: selectedChannel.id,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            content: trimmedContent,
            fileUrl,
            fileType,
            createdAt: new Date().toISOString(),
            pending: true,
        };

        setMessages((prev) => [...prev, tempMessage]);

        try {
            const res = await api.post("/chat/send", {
                channelId: selectedChannel.id,
                content: trimmedContent,
                fileUrl,
                fileType,
            });

            const saved = normalizeMessage(res.data.data);

            setMessages((prev) =>
                prev.map((m) => (m.id === tempMessage.id ? saved : m))
            );
        } catch (err) {
            setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
            console.error("Message send failed:", err);
        } finally {
            setIsSending(false);
        }
    };

    /* ---------------- HELPERS ---------------- */

    const shortenTitle = (title: string, limit = 25) =>
        title.length > limit ? `${title.slice(0, limit)}...` : title;

    /* ---------------- SIDEBAR ---------------- */

    const SidebarContent = () => (
        <div className="fixed">
            <div className="p-4">
                <div className="relative w-[206px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 dashtext" />
                    <Input
                        placeholder="Search Session"
                        className="secondbg pl-9 border dashborder text-sm dashtext"
                    />
                </div>
            </div>

            <Separator className="my-2 secondbg" />

            <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                    Sessions
                </h2>

                {channels.map((channel) => (
                    <button
                        key={channel.id}
                        className={cn(
                            "mb-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm",
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
                ))}
            </div>
        </div>
    );

    /* ---------------- LOADING ---------------- */

    if (!currentUser || loadingChannels) {
        return (
            <MainLayout>
                <div className="h-screen flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                    Loading chats...
                </div>
            </MainLayout>
        );
    }

    /* ---------------- RENDER ---------------- */

    const handleVideoCall = (data: any) => console.log("Video call started", data);
    const handleAudioCall = (data: any) => console.log("Audio call started", data);
    const handleScheduleCall = (data: any) => console.log("Call scheduled", data);

    return (
        <MainLayout>
            <div className="flex min-h-[93vh] dashbg rounded-xl">
                <div className="hidden md:block w-[245px] pr-3 border-r dashborder secondbg rounded-l-xl">
                    <SidebarContent />
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="fixed w-full z-10 md:relative">
                        <ChatHeader
                            channel={selectedChannel}
                            onVideoCall={handleVideoCall}
                            onAudioCall={handleAudioCall}
                            onScheduleCall={handleScheduleCall}
                        />
                    </div>

                    <div className="mt-24 md:mt-10 flex-1">
                        {selectedChannel ? (
                            <ChatInterface
                                currentUser={currentUser}
                                channelId={selectedChannel.id}
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
    );
}