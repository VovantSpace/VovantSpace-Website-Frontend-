import { useState, useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { encryptMessage } from "@/dashboard/Innovator/lib/encryption";
import type { ChatMessage, User, ReplyReference } from "@/dashboard/Innovator/types";
import { ChatMessageItem } from "./chat-message-item";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import { Input } from "@/dashboard/Innovator/components/ui/input";
import { X, Paperclip, Send } from "lucide-react";

export interface ChatInterfaceProps {
    currentUser: User;
    channelId: string;
    messages: ChatMessage[];
    onSendMessage: (
        content: string,
        fileUrl?: string,
        fileType?: string
    ) => Promise<void> | void;
}

export function ChatInterface({
                                  currentUser,
                                  channelId,
                                  messages,
                                  onSendMessage,
                              }: ChatInterfaceProps) {
    const [newMessage, setNewMessage] = useState("");
    const [activeReply, setActiveReply] = useState<ReplyReference | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 🔥 Real-time socket events (typing, edits, deletions)
    useEffect(() => {
        const socket = getSocket();
        socket.emit("chat:join-room", channelId);

        socket.on("chat:typing", (userName: string) => {
            setTypingUser(userName);
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
        });

        return () => {
            socket.emit("chat:leave-room", channelId);
            socket.off("chat:typing");
        };
    }, [channelId]);

    // 📨 Send message
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const encrypted = await encryptMessage(newMessage);
        await onSendMessage(encrypted, undefined, undefined);
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
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Button>

                {/* ✏️ Input */}
                <Input
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type your message..."
                    className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-white border-none focus:ring-0 text-sm px-4 py-2"
                />

                {/* 📨 Send */}
                <Button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="rounded-full bg-green-700 hover:bg-green-800 text-white p-2"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </div>
    );
}
