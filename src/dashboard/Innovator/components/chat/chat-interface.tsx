import { useState, useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { encryptMessage } from "@/dashboard/Innovator/lib/encryption";
import type { ChatMessage, User, ReplyReference } from "@/dashboard/Innovator/types";
import { ChatMessageItem } from "./chat-message-item";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import { Input } from "@/dashboard/Innovator/components/ui/input";
import { X, Paperclip, Send } from "lucide-react";
import api from "@/utils/api"
import { cn } from "@/dashboard/Innovator/lib/utils";

export interface ChatInterfaceProps {
    currentUser: User;
    channelId: string;
    onSendMessage: (
        content: string,
        fileUrl?: string,
        fileType?: string
    ) => Promise<void> | void;

    status?: 'upcoming' | 'active' | 'closed'
    nextActiveDate?: string | null;
    closedAt?: string | null;
}

export function ChatInterface({
    currentUser,
    channelId,
    onSendMessage,
    status,
    nextActiveDate,
    closedAt
}: ChatInterfaceProps) {
    const [newMessage, setNewMessage] = useState("");
    const [activeReply, setActiveReply] = useState<ReplyReference | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // Session status state
    const [sessionStatus, setSessionStatus] = useState<'upcoming' | 'active' | 'closed'>('active');
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [localNextActiveDate, setLocalNextActiveDate] = useState<string | null | undefined>(nextActiveDate);

    useEffect(() => {
        if (status) setSessionStatus(status);
    }, [status]);

    useEffect(() => {
        setLocalNextActiveDate(nextActiveDate);
    }, [nextActiveDate]);

    // Countdown timer logic
    useEffect(() => {
        if (sessionStatus !== 'upcoming' || !localNextActiveDate) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const start = new Date(localNextActiveDate).getTime();
            const diff = start - now;

            if (diff <= 0) {
                setSessionStatus('active');
                clearInterval(interval);
                return;
            }

            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [sessionStatus, localNextActiveDate]);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await api.get(`/api/chat/${channelId}/messages`);

                console.log('Chat response', response.data)

                if (response.data?.success) {
                    setMessages(response.data.data);
                    if (response.data.meta) {
                        setSessionStatus(response.data.meta.status);
                        setLocalNextActiveDate(response.data.meta.nextActiveDate);
                    }
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }

        if (channelId) fetchMessages();
    }, [channelId]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    // 🔥 Real-time socket events (typing, edits, deletions)
    useEffect(() => {
        const socket = getSocket();
        socket.emit("chat:join-room", channelId);

        socket.on("chat:typing", (userName: string) => {
            setTypingUser(userName);
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
        });

        socket.on('chat:new-message', (incoming: ChatMessage) => {
            setMessages(prev => {
                const exists = prev.some(m => m.id === incoming.id);
                return exists ? prev : [...prev, incoming];
            })
        })

        return () => {
            socket.emit("chat:leave-room", channelId);
            socket.off("chat:typing");
            socket.off("chat:new-message");
        };
    }, [channelId]);

    // 📨 Send message
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // const encrypted = await encryptMessage(newMessage);
        // await onSendMessage(encrypted, undefined, undefined);
        await onSendMessage(newMessage, undefined, undefined);
        setNewMessage("");
        setActiveReply(null);
    };

    // 🧠 Typing indicator
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        const socket = getSocket();
        socket.emit("chat:typing", {
            channelId,
            userName: currentUser.name,
        });
    };

    // 🧩 Reply, Edit, Delete
    const handleAction = async (action: string, messageId: string, data?: any) => {
        if (action === "reply") {
            setActiveReply({
                id: messageId,
                content: data?.content || "",
                userName: data?.userName || "",
            });
        }
    };

    // 📎 File upload handler
    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fileType = file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("audio/")
                ? "audio"
                : "document";
        const fileUrl = URL.createObjectURL(file); // preview
        await onSendMessage(`[${fileType} uploaded]`, fileUrl, fileType);
        e.target.value = "";
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Status Banners */}
            {sessionStatus === 'upcoming' && (
                <div className="absolute top-0 left-0 right-0 z-10 bg-yellow-50 border-b border-yellow-200 p-3 text-center shadow-sm">
                    <p className="text-yellow-800 text-sm font-medium">
                        Session starts in <span className="font-bold">{timeLeft}</span>
                    </p>
                    <p className="text-yellow-600 text-xs mt-0.5">Chat will open 30 minutes before the session</p>
                </div>
            )}

            {sessionStatus === 'closed' && (
                <div className="absolute top-0 left-0 right-0 z-10 bg-gray-100 border-b border-gray-200 p-3 text-center shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">This session has ended</p>
                    <p className="text-gray-500 text-xs mt-0.5">Chat is now read-only</p>
                </div>
            )}

            {/* Messages */}
            <div className={cn(
                "flex-1 overflow-y-auto p-4 space-y-2",
                (sessionStatus === 'upcoming' || sessionStatus === 'closed') && "pt-16"
            )}>
                {messages.map((message) => (
                    <ChatMessageItem
                        key={message.id}
                        message={message}
                        currentUser={currentUser}
                        onAction={(action, data) => handleAction(action, message.id, data)}
                    />
                ))}
                <div ref={messagesEndRef} />

                {isTyping && (
                    <div className="text-xs text-gray-400 pl-2 italic">
                        {typingUser} is typing...
                    </div>
                )}
            </div>

            {/* 🗨️ Reply Bar */}
            {activeReply && (
                <div className="p-2 border-t border-gray-300 dark:border-gray-700 bg-muted/20 flex items-center justify-between">
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold">{activeReply.userName}</span>
                        <span className="text-xs truncate text-gray-500">
                            {activeReply.content}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setActiveReply(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Input Bar */}
            <form
                onSubmit={handleSubmit}
                className="border-t p-3 flex items-center gap-3 bg-white dark:bg-gray-900"
            >
                <input type="file" id="fileInput" className="hidden" onChange={handleFileSelected} />

                {/* 📎 Attach */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={sessionStatus !== 'active'}
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                    <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Button>

                {/* ✏️ Input */}
                <Input
                    value={newMessage}
                    disabled={sessionStatus !== 'active'}
                    onChange={handleTyping}
                    placeholder={
                        sessionStatus === 'upcoming' ? "Chat opens 30 mins before session" :
                            sessionStatus === 'closed' ? "Session ended" :
                                "Type your message..."
                    }
                    className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-white border-none focus:ring-0 text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {/* 📨 Send */}
                <Button
                    type="submit"
                    disabled={sessionStatus !== 'active' || !newMessage.trim()}
                    className="rounded-full bg-green-700 hover:bg-green-800 text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </div>
    );
}