import {useState, useEffect, useRef, useMemo} from "react";
import {getSocket} from "@/lib/socket";
import type {ChatMessage, User, ReplyReference} from "@/dashboard/Innovator/components/chat/types";
import {ChatMessageItem} from "./chat-message-item";
import {Button} from "@/dashboard/Innovator/components/ui/button";
import {Input} from "@/dashboard/Innovator/components/ui/input";
import {X, Paperclip, Send} from "lucide-react";
import {cn} from "@/dashboard/Innovator/lib/utils";

export interface ChatInterfaceProps {
    currentUser: User;
    channelId: string;
    messages: ChatMessage[];
    isSending?: boolean;
    onSendMessage: (
        content: string,
        file?: File
    ) => Promise<void> | void;

    chatType: "challenge" | "session";
    status?: "upcoming" | "active" | "closed";
    nextActiveDate?: string | null;
    closedAt?: string | null;
}

export function ChatInterface({
                                  currentUser,
                                  channelId,
                                  messages,
                                  isSending = false,
                                  onSendMessage,
                                  status,
                                  nextActiveDate,
                                  closedAt,
                                  chatType
                              }: ChatInterfaceProps) {
    const [newMessage, setNewMessage] = useState("");
    const [activeReply, setActiveReply] = useState<ReplyReference | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [now, setNow] = useState(Date.now());

    const nextActiveTime = useMemo(() => {
        if (!nextActiveDate) return null;
        const t = new Date(nextActiveDate).getTime();
        return Number.isNaN(t) ? null : t;
    }, [nextActiveDate]);

    const closedTime = useMemo(() => {
        if (!closedAt) return null;
        const t = new Date(closedAt).getTime();
        return Number.isNaN(t) ? null : t;
    }, [closedAt]);

    // Keep current time ticking only for session chats
    useEffect(() => {
        if (chatType !== "session") return;

        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [chatType]);

    // Determine actual effective status from time window
    const effectiveSessionStatus = useMemo<"upcoming" | "active" | "closed">(() => {
        if (chatType !== "session") return "active";

        if (closedTime && now >= closedTime) {
            return "closed";
        }

        if (nextActiveTime && now < nextActiveTime) {
            return "upcoming";
        }

        if (status === "closed") return "closed";
        if (status === "upcoming") return "upcoming";

        return "active";
    }, [chatType, status, now, nextActiveTime, closedTime]);

    useEffect(() => {
        if (chatType !== "session" || effectiveSessionStatus !== "upcoming" || !nextActiveTime) {
            setTimeLeft("");
            return;
        }

        const diff = nextActiveTime - now;

        if (diff <= 0) {
            setTimeLeft("");
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(
            hours > 0
                ? `${hours}h ${minutes}m ${seconds}s`
                : `${minutes}m ${seconds}s`
        );
    }, [chatType, effectiveSessionStatus, nextActiveTime, now]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        const socket = getSocket();

        const handleTypingEvent = (userName: string) => {
            setTypingUser(userName);
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
        };

        socket.on("chat:typing", handleTypingEvent);

        return () => {
            socket.off("chat:typing", handleTypingEvent);
        };
    }, [channelId]);

    const isInputDisabled =
        chatType === "session" ? effectiveSessionStatus !== "active" : false;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isInputDisabled) return;

        const messageToSend = newMessage.trim();
        if (!messageToSend || isSending) return;

        setNewMessage("");
        setActiveReply(null);

        await onSendMessage(messageToSend);
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isInputDisabled) return;

        setNewMessage(e.target.value);
        const socket = getSocket();
        socket.emit("chat:typing", {
            channelId,
            userName: currentUser.name,
        });
    };

    const handleAction = async (action: string, messageId: string, data?: any) => {
        if (action === "reply") {
            setActiveReply({
                id: messageId,
                content: data?.content || "",
                userName: data?.userName || "",
            });
        }
    };

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || isSending || isInputDisabled) return;

        setActiveReply(null);
        await onSendMessage("", file);
        e.target.value = "";
    };

    return (
        <div className="flex flex-col h-full relative">
            {chatType === "session" && effectiveSessionStatus === "upcoming" && (
                <div className="absolute top-0 left-0 right-0 z-10 bg-yellow-50 border-b border-yellow-200 p-3 text-center shadow-sm">
                    <p className="text-yellow-800 text-sm font-medium">
                        Session starts in <span className="font-bold">{timeLeft}</span>
                    </p>
                    <p className="text-yellow-600 text-xs mt-0.5">
                        Chat will open 30 minutes before the session
                    </p>
                </div>
            )}

            {chatType === "session" && effectiveSessionStatus === "closed" && (
                <div className="absolute top-0 left-0 right-0 z-10 bg-gray-100 border-b border-gray-200 p-3 text-center shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">This session has ended</p>
                    <p className="text-gray-500 text-xs mt-0.5">Chat is now read-only</p>
                </div>
            )}

            <div
                className={cn(
                    "flex-1 overflow-y-auto p-4 space-y-2",
                    chatType === "session" &&
                    (effectiveSessionStatus === "upcoming" || effectiveSessionStatus === "closed") &&
                    "pt-16"
                )}
            >
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

            <form
                onSubmit={handleSubmit}
                className="border-t p-3 flex items-center gap-3 bg-white dark:bg-gray-900"
            >
                <input type="file" id="fileInput" className="hidden" onChange={handleFileSelected} />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isInputDisabled}
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                    <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Button>

                <Input
                    value={newMessage}
                    disabled={isInputDisabled}
                    onChange={handleTyping}
                    placeholder={
                        chatType === "session"
                            ? effectiveSessionStatus === "upcoming"
                                ? "Chat opens 30 mins before session"
                                : effectiveSessionStatus === "closed"
                                    ? "This chat is closed"
                                    : "Type your message..."
                            : "Type your message..."
                    }
                    className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-white border-none focus:ring-0 text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <Button
                    type="submit"
                    disabled={isInputDisabled || !newMessage.trim() || isSending}
                    className="rounded-full bg-green-700 hover:bg-green-800 text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </div>
    );
}