import { useState, useRef, useEffect } from "react"
import type { ChatMessage, User, MessageAction } from "@/dashboard/Innovator/types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/dashboard/Innovator/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/dashboard/Innovator/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/dashboard/Innovator/components/ui/popover"
import {
    MoreVertical,
    Clock,
    Check,
    CheckCheck,
    Star,
    Flag,
    Pencil,
    Trash2,
    SmilePlus,
    Reply,
} from "lucide-react"
import EmojiPicker from "emoji-picker-react"
import { MessageEditor } from "./message-editor"
import { ReplyBox } from "./reply-box"
import { PollView } from "./poll-view"
import { decryptMessage } from "../../lib/encryption"
import { getAvailableActions } from "../../lib/permissions"

interface ChatMessageItemProps {
    message: ChatMessage
    currentUser: User
    onAction: (action: MessageAction, data?: any) => void
}

export function ChatMessageItem({ message, currentUser, onAction }: ChatMessageItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
    const [decryptedContent, setDecryptedContent] = useState(message.content)

    const emojiPickerRef = useRef<HTMLDivElement>(null)
    const messageRef = useRef<HTMLDivElement>(null)
    const availableActions = getAvailableActions(message, currentUser)

    // 🧠 Decrypt message once when it changes
    useEffect(() => {
        const runDecrypt = async () => {
            try {
                if (message.content?.includes("|")) {
                    const decrypted = await decryptMessage(message.content)
                    setDecryptedContent(decrypted)
                } else {
                    setDecryptedContent(message.content)
                }
            } catch (err) {
                console.error("Decryption failed:", err)
                setDecryptedContent(message.content)
            }
        }
        runDecrypt()
    }, [message.content])

    // 🖱️ Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isEmojiPickerOpen &&
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setIsEmojiPickerOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isEmojiPickerOpen])

    // 📎 Handle attached media
    const renderFileContent = () => {
        if (!message.fileType || !message.fileUrl) return null

        switch (message.fileType) {
            case "image":
                return (
                    <img
                        src={message.fileUrl}
                        alt="Uploaded content"
                        className="mt-2 rounded-lg max-w-[280px] h-auto object-cover"
                    />
                )
            case "audio":
                return (
                    <div className="mt-2">
                        <audio controls className="w-full max-w-[300px]">
                            <source src={message.fileUrl} type="audio/mpeg" />
                        </audio>
                    </div>
                )
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
                )
            default:
                return null
        }
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <div
            className="group/message relative py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
            ref={messageRef}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <Avatar className="h-9 w-9 shrink-0 mt-1">
                    <AvatarImage src={message.user?.avatar} alt={message.user?.name} />
                    <AvatarFallback>{message.user?.name?.[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-baseline gap-2 mb-1 text-sm">
                        <span className="font-medium dark:text-white">{message.user?.name}</span>
                        <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
              })}
            </span>
                        {message.status && message.userId === currentUser.id && (
                            <span className="ml-1 text-xs text-muted-foreground">
                {message.status === "pending" ? (
                    <Clock className="h-3 w-3" />
                ) : message.status === "delivered" ? (
                    <CheckCheck className="h-3 w-3 text-blue-500" />
                ) : (
                    <Check className="h-3 w-3" />
                )}
              </span>
                        )}
                    </div>

                    {/* Reply reference */}
                    {message.replyTo && (
                        <div className="mb-2 text-sm border-l-2 border-blue-500 pl-2 text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Reply className="h-4 w-4" />
                                <span className="font-medium">{message.replyTo.userName}</span>
                            </div>
                            <div className="truncate">{message.replyTo.content}</div>
                        </div>
                    )}

                    {/* Message bubble */}
                    <div className="relative">
                        {isEditing ? (
                            <MessageEditor
                                initialContent={decryptedContent}
                                onSave={(content) => {
                                    onAction("edit", { content })
                                    setIsEditing(false)
                                }}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            <div
                                className={`inline-block p-3 rounded-2xl ${
                                    message.isStarred
                                        ? "bg-[#f0f8eb] dark:bg-[#1a2a1d] border border-[#00bf8f]"
                                        : "bg-gray-100 dark:bg-gray-800 dark:text-white"
                                }`}
                            >
                                <div className="break-words whitespace-pre-wrap max-w-[500px]">
                                    {decryptedContent}
                                    {renderFileContent()}
                                </div>

                                {message.isPoll && message.pollData && (
                                    <PollView
                                        pollData={message.pollData}
                                        onVote={(optionIds) => onAction("poll", { optionIds })}
                                        userVotes={message.pollData.voters?.[currentUser.id]}
                                        className="mt-2"
                                    />
                                )}
                            </div>
                        )}

                        {/* Hover actions */}
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/message:opacity-100 transition-opacity z-10">
                            <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
                                <PopoverTrigger asChild>
                                    <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                                        <SmilePlus className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent ref={emojiPickerRef} className="w-auto p-0" align="start">
                                    <EmojiPicker
                                        onEmojiClick={({ emoji }) => {
                                            onAction("react", { emoji })
                                            setIsEmojiPickerOpen(false)
                                        }}
                                        skinTonesDisabled
                                        searchDisabled
                                        height={350}
                                        width={300}
                                    />
                                </PopoverContent>
                            </Popover>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => setShowReplyBox(true)}>
                                        <Reply className="h-4 w-4 mr-2" />
                                        Reply
                                    </DropdownMenuItem>
                                    {availableActions.includes("star") && (
                                        <DropdownMenuItem onClick={() => onAction("star")}>
                                            <Star className="h-4 w-4 mr-2" />
                                            {message.isStarred ? "Unstar" : "Star"}
                                        </DropdownMenuItem>
                                    )}
                                    {availableActions.includes("edit") && (
                                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                    )}
                                    {availableActions.includes("delete") && (
                                        <DropdownMenuItem onClick={() => onAction("delete")}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    )}
                                    {availableActions.includes("report") && (
                                        <DropdownMenuItem onClick={() => onAction("report")}>
                                            <Flag className="h-4 w-4 mr-2" />
                                            Report
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Reactions */}
                    {Array.isArray(message.reactions) && message.reactions.length > 0 && (
                        <div className={'flex flex-wrap gap-1 mt-2'}>
                            {message.reactions.map((reaction, index) => (
                                <button
                                    key={index}
                                    onClick={() => onAction('react', {emoji: reaction.emoji})}
                                    className={'flex items-center gap-1 bg-gray-200 darkbg-gray-700 rounded-full px-2 py-0.5 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'}
                                >
                                    <span>{reaction.emoji}</span>
                                    <span className={'text-xs'}>{reaction.users.length}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Reply box */}
                    {showReplyBox && (
                        <div className="mt-3">
                            <ReplyBox
                                replyTo={{
                                    id: message.id,
                                    content: decryptedContent,
                                    userName: message.user?.name || "",
                                }}
                                onSubmit={(content) => {
                                    onAction("reply", {
                                        content,
                                        replyTo: {
                                            id: message.id,
                                            content: decryptedContent,
                                            userName: message.user?.name || "",
                                        },
                                    })
                                    setShowReplyBox(false)
                                }}
                                onCancel={() => setShowReplyBox(false)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
