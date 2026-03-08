import { useEffect, useState } from "react";
import type { ChatMessage, User } from "@/dashboard/Innovator/components/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/dashboard/Innovator/components/ui/avatar";
import { Clock, Check } from "lucide-react";
import { decryptMessage } from "../../lib/encryption";

interface ChatMessageItemProps {
    message: ChatMessage;
    currentUser: User;
    onAction?: (action: string, data?: any) => void;
}

export function ChatMessageItem({
                                    message,
                                    currentUser,
                                }: ChatMessageItemProps) {
    const [decryptedContent, setDecryptedContent] = useState(message.content || "");

    useEffect(() => {
        const runDecrypt = async () => {
            try {
                if (message.content?.includes("|")) {
                    const decrypted = await decryptMessage(message.content);
                    setDecryptedContent(decrypted || "");
                } else {
                    setDecryptedContent(message.content || "");
                }
            } catch (err) {
                console.error("Decryption failed:", err);
                setDecryptedContent(message.content || "");
            }
        };

        runDecrypt();
    }, [message.content]);

    const formatMessageTime = (dateString?: string) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderFileContent = () => {
        if (!message.fileType || !message.fileUrl) return null;

        switch (message.fileType) {
            case "image":
                return (
                    <img
                        src={message.fileUrl}
                        alt="Uploaded content"
                        className="mt-2 rounded-lg max-w-[280px] h-auto object-cover"
                    />
                );

            case "audio":
                return (
                    <div className="mt-2">
                        <audio controls className="w-full max-w-[300px]">
                            <source src={message.fileUrl} />
                        </audio>
                    </div>
                );

            case "document":
                return (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            View Document
                        </a>
                    </div>
                );

            default:
                return null;
        }
    };

    const isOwnMessage = message.senderId === currentUser.id;

    return (
        <div className="group/message relative py-1 px-2 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
            <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9 shrink-0 mt-1">
                    <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                    <AvatarFallback>
                        {message.senderName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1 text-sm">
                        <span className="font-medium dark:text-white">
                            {message.senderName || "Unknown User"}
                        </span>

                        <span className="text-xs text-muted-foreground">
                            {formatMessageTime(message.createdAt)}
                        </span>

                        {isOwnMessage && (
                            <span className="ml-1 text-xs text-muted-foreground">
                                {message.pending ? (
                                    <Clock className="h-3 w-3" />
                                ) : (
                                    <Check className="h-3 w-3" />
                                )}
                            </span>
                        )}
                    </div>

                    <div className="inline-block p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 dark:text-white">
                        <div className="break-words whitespace-pre-wrap max-w-[500px]">
                            {decryptedContent}
                            {renderFileContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}